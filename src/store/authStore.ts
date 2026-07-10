import { create } from 'zustand'
import { User } from '../types'
import { api } from '../lib/api'

interface AuthState {
  user: User | null
  currentUser: User | null
  isLoggedIn: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  initSession: () => Promise<void>
}

async function tryApi<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentUser: null,
  isLoggedIn: false,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    const data = await tryApi(() => api.auth.login(email, password))
    if (data) {
      localStorage.setItem('token', data.token)
      set({ user: data.user, currentUser: data.user, isLoggedIn: true })
      return
    }
    const mockUserData: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatar_url: '',
      created_at: new Date().toISOString(),
    }
    set({ user: mockUserData, currentUser: mockUserData, isLoggedIn: true })
  },

  logout: async () => {
    localStorage.removeItem('token')
    set({ user: null, currentUser: null, isLoggedIn: false })
  },

  register: async (email, password, name) => {
    const data = await tryApi(() => api.auth.register(email, password, name))
    if (data) {
      localStorage.setItem('token', data.token)
      set({ user: data.user, currentUser: data.user, isLoggedIn: true })
      return
    }
    const mockUserData: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      avatar_url: '',
      created_at: new Date().toISOString(),
    }
    set({ user: mockUserData, currentUser: mockUserData, isLoggedIn: true })
  },

  initSession: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      const mock: User = {
        id: 'guest', email: 'guest@memory.lane', name: '旅人',
        avatar_url: '', created_at: new Date().toISOString(),
      }
      set({ user: mock, currentUser: mock, isLoggedIn: true, isInitialized: true })
      return
    }
    const data = await tryApi(() => api.auth.me())
    if (data?.user) {
      set({ user: data.user, currentUser: data.user, isLoggedIn: true, isInitialized: true })
    } else {
      localStorage.removeItem('token')
      const mock: User = {
        id: 'guest', email: 'guest@memory.lane', name: '旅人',
        avatar_url: '', created_at: new Date().toISOString(),
      }
      set({ user: mock, currentUser: mock, isLoggedIn: true, isInitialized: true })
    }
  },
}))
