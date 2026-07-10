import { create } from 'zustand'
import { Memory } from '../types'
import { mockMemories } from '../data/mockData'
import { api } from '../lib/api'
import { useAuthStore } from './authStore'

const LS_KEY = 'memorylane_memories'

function loadLocal(): Memory[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return mockMemories
}

function saveLocal(memories: Memory[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(memories)) } catch {}
}

interface MemoryState {
  memories: Memory[]
  currentView: 'timeline' | 'game' | 'gallery'
  selectedMemory: Memory | null
  isLoading: boolean
  setMemories: (memories: Memory[]) => void
  addMemory: (memory: Memory) => Promise<void>
  updateMemory: (id: string, updates: Partial<Memory>) => Promise<void>
  deleteMemory: (id: string) => Promise<void>
  setCurrentView: (view: 'timeline' | 'game' | 'gallery') => void
  selectMemory: (memory: Memory | null) => void
  loadMemories: () => Promise<void>
}

async function tryApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: loadLocal(),
  currentView: 'timeline',
  selectedMemory: null,
  isLoading: false,

  setMemories: (memories) => {
    saveLocal(memories)
    set({ memories })
  },

  addMemory: async (memory) => {
    const { currentUser } = useAuthStore.getState()
    if (!currentUser) return

    const data = await tryApi(
      () => api.memories.create({
        title: memory.title, description: memory.description, date: memory.date,
        location: memory.location, emotion: memory.emotion, photo_url: memory.photo_url,
        is_public: memory.is_public, user_id: currentUser.id,
      }),
      null,
    )

    const saved = data || { ...memory, id: `mem-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    set((state) => {
      const updated = [...state.memories, saved].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      saveLocal(updated)
      return { memories: updated }
    })
  },

  updateMemory: async (id, updates) => {
    await tryApi(() => api.memories.update(id, updates), null)
    set((state) => {
      const updated = state.memories.map((m) => (m.id === id ? { ...m, ...updates } : m))
      saveLocal(updated)
      return { memories: updated }
    })
  },

  deleteMemory: async (id) => {
    await tryApi(() => api.memories.delete(id), null)
    set((state) => {
      const updated = state.memories.filter((m) => m.id !== id)
      saveLocal(updated)
      return { memories: updated }
    })
  },

  setCurrentView: (view) => set({ currentView: view }),
  selectMemory: (memory) => set({ selectedMemory: memory }),

  loadMemories: async () => {
    const data = await tryApi(() => api.memories.list(), null)
    if (data) {
      const sorted = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      saveLocal(sorted)
      set({ memories: sorted })
    }
  },
}))
