import { create } from 'zustand'
import type { Endpoint, EndpointInput } from '../types/endpoint'

interface EndpointsStore {
  endpoints: Endpoint[]
  activeId: string | null
  load: () => Promise<void>
  add: (input: EndpointInput) => Promise<void>
  update: (id: string, input: EndpointInput) => Promise<void>
  remove: (id: string) => Promise<void>
  setActive: (id: string) => Promise<void>
}

export const useEndpointsStore = create<EndpointsStore>((set) => ({
  endpoints: [],
  activeId: null,

  load: async () => {
    const [endpoints, activeId] = await Promise.all([
      window.endpoints.list(),
      window.endpoints.getActive()
    ])
    set({ endpoints, activeId })
  },

  add: async (input) => {
    const endpoint = await window.endpoints.add(input)
    set((s) => ({ endpoints: [...s.endpoints, endpoint] }))
  },

  update: async (id, input) => {
    const updated = await window.endpoints.update(id, input)
    set((s) => ({
      endpoints: s.endpoints.map((e) => (e.id === id ? updated : e))
    }))
  },

  remove: async (id) => {
    await window.endpoints.delete(id)
    set((s) => {
      const endpoints = s.endpoints.filter((e) => e.id !== id)
      const activeId = s.activeId === id ? (endpoints[0]?.id ?? null) : s.activeId
      return { endpoints, activeId }
    })
  },

  setActive: async (id) => {
    await window.endpoints.setActive(id)
    set({ activeId: id })
  }
}))
