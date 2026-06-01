import type { Endpoint, EndpointInput } from './endpoint'

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
  }
}
