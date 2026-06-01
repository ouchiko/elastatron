import { create } from 'zustand'

interface AppStore {
  _placeholder: null
}

export const useAppStore = create<AppStore>(() => ({
  _placeholder: null
}))
