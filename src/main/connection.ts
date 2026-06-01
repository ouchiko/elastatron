import { Client } from '@elastic/elasticsearch'
import { BrowserWindow } from 'electron'
import { listEndpoints, getCredential } from './endpoints'

export type ConnStatus = 'idle' | 'connecting' | 'connected' | 'error'

export interface StatusEvent {
  id: string | null
  status: ConnStatus
  error?: string
}

let client: Client | null = null
let currentId: string | null = null
let currentStatus: ConnStatus = 'idle'

function broadcast(event: StatusEvent): void {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('connection:status', event)
  }
}

function buildClient(id: string): Client {
  const endpoints = listEndpoints()
  const meta = endpoints.find((e) => e.id === id)
  if (!meta) throw new Error(`Endpoint ${id} not found`)

  const credential = getCredential(id)
  const opts: ConstructorParameters<typeof Client>[0] = {
    node: meta.url,
    ...(meta.ignoreSSL ? { tls: { rejectUnauthorized: false } } : {})
  }

  if (credential) {
    if (meta.authMethod === 'basic') {
      opts.auth = { username: meta.username ?? '', password: credential }
    } else {
      opts.auth = { apiKey: credential }
    }
  }

  return new Client(opts)
}

export async function connectTo(id: string): Promise<void> {
  if (client) {
    try {
      await client.close()
    } catch {
      // ignore
    }
    client = null
  }

  currentId = id
  currentStatus = 'connecting'
  broadcast({ id, status: 'connecting' })

  try {
    client = buildClient(id)
    await client.ping()
    currentStatus = 'connected'
    broadcast({ id, status: 'connected' })
  } catch (err) {
    currentStatus = 'error'
    broadcast({ id, status: 'error', error: String(err) })
  }
}

export async function withReconnect<T>(fn: (c: Client) => Promise<T>): Promise<T> {
  if (!client || !currentId) throw new Error('No active connection')
  try {
    return await fn(client)
  } catch {
    // single reconnect attempt
    await connectTo(currentId)
    if (!client) throw new Error('Reconnect failed')
    return await fn(client)
  }
}

export function getStatus(): StatusEvent {
  return { id: currentId, status: currentStatus }
}

export function getClient(): Client | null {
  return client
}
