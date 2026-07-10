const API_BASE = '/api'

function getToken(): string | null {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }

  return res.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string; name: string; avatar_url: string; created_at: string } }>(
        '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
      ),
    register: (email: string, password: string, name: string) =>
      request<{ token: string; user: { id: string; email: string; name: string; avatar_url: string; created_at: string } }>(
        '/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }
      ),
    me: () =>
      request<{ user: { id: string; email: string; name: string; avatar_url: string; created_at: string } | null }>('/auth/me'),
  },

  memories: {
    list: () => request<any[]>('/memories'),
    create: (data: any) =>
      request<any>('/memories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/memories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/memories/${id}`, { method: 'DELETE' }),
  },

  posts: {
    list: () => request<any[]>('/posts'),
    create: (data: any) =>
      request<any>('/posts', { method: 'POST', body: JSON.stringify(data) }),
    like: (id: string) =>
      request<any>(`/posts/${id}/like`, { method: 'POST' }),
  },

  comments: {
    list: (postId?: string) =>
      request<any[]>(`/comments${postId ? `?post_id=${postId}` : ''}`),
    create: (data: any) =>
      request<any>('/comments', { method: 'POST', body: JSON.stringify(data) }),
    like: (id: string) =>
      request<any>(`/comments/${id}/like`, { method: 'POST' }),
  },

  stories: {
    list: () => request<any[]>('/stories'),
    create: (data: any) =>
      request<any>('/stories', { method: 'POST', body: JSON.stringify(data) }),
  },
}
