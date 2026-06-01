export type AuthMethod = 'basic' | 'apikey'

export interface Endpoint {
  id: string
  name: string
  url: string
  authMethod: AuthMethod
  username?: string
  ignoreSSL: boolean
}

export interface EndpointInput {
  name: string
  url: string
  authMethod: AuthMethod
  username?: string
  credential?: string
  ignoreSSL: boolean
}
