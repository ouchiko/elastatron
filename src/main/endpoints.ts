import { safeStorage, app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { randomUUID } from 'crypto'

export interface EndpointMeta {
  id: string
  name: string
  url: string
  authMethod: 'basic' | 'apikey'
  username?: string
  ignoreSSL: boolean
}

export interface EndpointInput {
  name: string
  url: string
  authMethod: 'basic' | 'apikey'
  username?: string
  credential?: string
  ignoreSSL: boolean
}

const dataDir = app.getPath('userData')
const endpointsPath = join(dataDir, 'endpoints.json')
const credentialsPath = join(dataDir, 'credentials.json')
const activePath = join(dataDir, 'active.json')

function readJSON<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJSON(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}

export function listEndpoints(): EndpointMeta[] {
  return readJSON<EndpointMeta[]>(endpointsPath, [])
}

export function addEndpoint(input: EndpointInput): EndpointMeta {
  const endpoints = listEndpoints()
  const id = randomUUID()
  const meta: EndpointMeta = {
    id,
    name: input.name,
    url: input.url,
    authMethod: input.authMethod,
    username: input.username,
    ignoreSSL: input.ignoreSSL
  }
  endpoints.push(meta)
  writeJSON(endpointsPath, endpoints)
  if (input.credential) {
    const creds = readJSON<Record<string, string>>(credentialsPath, {})
    creds[id] = safeStorage.encryptString(input.credential).toString('base64')
    writeJSON(credentialsPath, creds)
  }
  return meta
}

export function updateEndpoint(id: string, input: EndpointInput): EndpointMeta {
  const endpoints = listEndpoints()
  const idx = endpoints.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error(`Endpoint ${id} not found`)
  const meta: EndpointMeta = {
    id,
    name: input.name,
    url: input.url,
    authMethod: input.authMethod,
    username: input.username,
    ignoreSSL: input.ignoreSSL
  }
  endpoints[idx] = meta
  writeJSON(endpointsPath, endpoints)
  if (input.credential !== undefined) {
    const creds = readJSON<Record<string, string>>(credentialsPath, {})
    if (input.credential) {
      creds[id] = safeStorage.encryptString(input.credential).toString('base64')
    } else {
      delete creds[id]
    }
    writeJSON(credentialsPath, creds)
  }
  return meta
}

export function deleteEndpoint(id: string): void {
  const endpoints = listEndpoints().filter((e) => e.id !== id)
  writeJSON(endpointsPath, endpoints)
  const creds = readJSON<Record<string, string>>(credentialsPath, {})
  delete creds[id]
  writeJSON(credentialsPath, creds)
  const active = readJSON<{ activeId: string | null }>(activePath, { activeId: null })
  if (active.activeId === id) {
    writeJSON(activePath, { activeId: endpoints[0]?.id ?? null })
  }
}

export function getActiveEndpointId(): string | null {
  return readJSON<{ activeId: string | null }>(activePath, { activeId: null }).activeId
}

export function setActiveEndpoint(id: string): void {
  writeJSON(activePath, { activeId: id })
}

export function getCredential(id: string): string | null {
  const creds = readJSON<Record<string, string>>(credentialsPath, {})
  const encrypted = creds[id]
  if (!encrypted) return null
  try {
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
  } catch {
    return null
  }
}
