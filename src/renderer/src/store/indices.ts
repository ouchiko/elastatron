import { create } from 'zustand'
import type { IndexMeta } from '../types/electron'

interface IndicesStore {
  indices: IndexMeta[]
  loading: boolean
  error: string | null
  load: () => Promise<void>
}

export const useIndicesStore = create<IndicesStore>((set) => ({
  indices: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const indices = await window.indices.list()
      set({ indices, loading: false })
    } catch (err) {
      set({ loading: false, error: String(err), indices: [] })
    }
  }
}))
