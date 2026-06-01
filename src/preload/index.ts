import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { EndpointInput, EndpointMeta } from '../main/endpoints'
import type { StatusEvent, IndexMeta } from '../main/connection'

const endpointsAPI = {
  list: (): Promise<EndpointMeta[]> => ipcRenderer.invoke('endpoints:list'),
  add: (input: EndpointInput): Promise<EndpointMeta> => ipcRenderer.invoke('endpoints:add', input),
  update: (id: string, input: EndpointInput): Promise<EndpointMeta> =>
    ipcRenderer.invoke('endpoints:update', id, input),
  delete: (id: string): Promise<void> => ipcRenderer.invoke('endpoints:delete', id),
  getActive: (): Promise<string | null> => ipcRenderer.invoke('endpoints:getActive'),
  setActive: (id: string): Promise<void> => ipcRenderer.invoke('endpoints:setActive', id)
}

const indicesAPI = {
  list: (): Promise<IndexMeta[]> => ipcRenderer.invoke('indices:list')
}

const connectionAPI = {
  connect: (id: string): Promise<void> => ipcRenderer.invoke('connection:connect', id),
  getStatus: (): Promise<StatusEvent> => ipcRenderer.invoke('connection:getStatus'),
  onStatus: (cb: (event: StatusEvent) => void): void => {
    ipcRenderer.on('connection:status', (_, event: StatusEvent) => cb(event))
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('endpoints', endpointsAPI)
    contextBridge.exposeInMainWorld('connection', connectionAPI)
    contextBridge.exposeInMainWorld('indices', indicesAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.endpoints = endpointsAPI
  // @ts-ignore
  window.connection = connectionAPI
  // @ts-ignore
  window.indices = indicesAPI
}
