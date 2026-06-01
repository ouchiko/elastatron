import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { EndpointInput, EndpointMeta } from '../main/endpoints'

const endpointsAPI = {
  list: (): Promise<EndpointMeta[]> => ipcRenderer.invoke('endpoints:list'),
  add: (input: EndpointInput): Promise<EndpointMeta> => ipcRenderer.invoke('endpoints:add', input),
  update: (id: string, input: EndpointInput): Promise<EndpointMeta> =>
    ipcRenderer.invoke('endpoints:update', id, input),
  delete: (id: string): Promise<void> => ipcRenderer.invoke('endpoints:delete', id),
  getActive: (): Promise<string | null> => ipcRenderer.invoke('endpoints:getActive'),
  setActive: (id: string): Promise<void> => ipcRenderer.invoke('endpoints:setActive', id)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('endpoints', endpointsAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.endpoints = endpointsAPI
}
