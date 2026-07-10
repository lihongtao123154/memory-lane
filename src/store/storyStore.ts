import { create } from 'zustand'
import { Story } from '../types'
import { mockStories } from '../data/mockData'
import { api } from '../lib/api'

interface StoryState {
  stories: Story[]
  isLoading: boolean
  addStory: (story: Story) => Promise<void>
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>
  deleteStory: (id: string) => Promise<void>
  loadStories: () => Promise<void>
}

async function tryApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: mockStories,
  isLoading: false,

  addStory: async (story) => {
    const data = await tryApi(
      () => api.stories.create({ title: story.title, cover_url: story.cover_url, summary: story.summary, is_public: story.is_public }),
      null,
    )
    if (data) {
      set((state) => ({ stories: [data, ...state.stories] }))
    } else {
      set((state) => ({ stories: [story, ...state.stories] }))
    }
  },

  updateStory: async (id, updates) => {
    set((state) => ({ stories: state.stories.map((s) => (s.id === id ? { ...s, ...updates } : s)) }))
  },

  deleteStory: async (id) => {
    set((state) => ({ stories: state.stories.filter((s) => s.id !== id) }))
  },

  loadStories: async () => {
    const data = await tryApi(() => api.stories.list(), null)
    if (data && data.length > 0) {
      set({ stories: data })
    }
  },
}))
