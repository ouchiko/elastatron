import type { Endpoint, EndpointInput } from './endpoint'

export type ConnStatus = 'idle' | 'connecting' | 'connected' | 'error'

export interface StatusEvent {
  id: string | null
  status: ConnStatus
  error?: string
}

declare global {
  interface Window {
    endpoints: {
      list: () => Promise<Endpoint[]>
      add: (input: EndpointInput) => Promise<Endpoint>
      update: (id: string, input: EndpointInput) => Promise<Endpoint>
      delete: (id: string) => Promise<void>
      getActive: () => Promise<string | null>
      setActive: (id: string) => Promise<void>
    }
    connection: {
      connect: (id: string) => Promise<void>
      getStatus: () => Promise<StatusEvent>
      onStatus: (cb: (event: StatusEvent) => void) => void
    }
  }
}
