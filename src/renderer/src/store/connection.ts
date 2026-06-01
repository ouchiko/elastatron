import { create } from 'zustand'
import type { ConnStatus, StatusEvent } from '../types/electron'
import { useToastStore } from './toast'

interface ConnectionStore {
  endpointId: string | null
  status: ConnStatus
  error: string | null
  onStatusUpdate: (event: StatusEvent) => void
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  endpointId: null,
  status: 'idle',
  error: null,

  onStatusUpdate: (event) => {
    const prev = get().status
    set({ endpointId: event.id, status: event.status, error: event.error ?? null })

    if (event.status === 'connected' && prev === 'error') {
      useToastStore.getState().add('Connection restored', 'success')
    } else if (event.status === 'connected' && prev === 'connecting') {
      // no toast on initial connect — status dot is enough
    } else if (event.status === 'error') {
      useToastStore.getState().add('Connection failed', 'error')
    }
  }
}))
