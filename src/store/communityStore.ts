import { create } from 'zustand'
import { Post, Comment } from '../types'
import { mockPosts, mockComments } from '../data/mockData'
import { api } from '../lib/api'
import { useAuthStore } from './authStore'

interface CommunityState {
  posts: Post[]
  comments: Comment[]
  isLoading: boolean
  addPost: (post: Post) => Promise<void>
  likePost: (postId: string) => Promise<void>
  addComment: (comment: Comment) => Promise<void>
  likeComment: (commentId: string) => Promise<void>
  loadPosts: () => Promise<void>
  loadComments: (postId?: string) => Promise<void>
}

async function tryApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export const useCommunityStore = create<CommunityState>((set) => ({
  posts: mockPosts,
  comments: mockComments,
  isLoading: false,

  addPost: async (post) => {
    const { currentUser } = useAuthStore.getState()
    if (!currentUser) return

    const data = await tryApi(
      () => api.posts.create({ content: post.content, tags: post.tags }),
      null,
    )

    if (data) {
      const newPost: Post = {
        id: data.id,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar_url,
        content: post.content,
        tags: post.tags,
        likes: 0,
        comments: 0,
        is_liked: false,
        created_at: data.created_at,
      }
      set((state) => ({ posts: [newPost, ...state.posts] }))
    } else {
      set((state) => ({ posts: [post, ...state.posts] }))
    }
  },

  likePost: async (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.is_liked ? post.likes - 1 : post.likes + 1, is_liked: !post.is_liked }
          : post,
      ),
    }))
    await tryApi(() => api.posts.like(postId), null)
  },

  addComment: async (comment) => {
    const { currentUser } = useAuthStore.getState()
    if (!currentUser) return

    const data = await tryApi(
      () => api.comments.create({ post_id: comment.post_id, content: comment.content }),
      null,
    )

    if (data) {
      const newComment: Comment = {
        id: data.id,
        post_id: comment.post_id,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar_url,
        content: comment.content,
        likes: 0,
        is_liked: false,
        created_at: data.created_at,
      }
      set((state) => ({
        comments: [newComment, ...state.comments],
        posts: state.posts.map((p) => (p.id === comment.post_id ? { ...p, comments: p.comments + 1 } : p)),
      }))
    } else {
      set((state) => ({
        comments: [comment, ...state.comments],
        posts: state.posts.map((p) => (p.id === comment.post_id ? { ...p, comments: p.comments + 1 } : p)),
      }))
    }
  },

  likeComment: async (commentId) => {
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId
          ? { ...c, likes: c.is_liked ? c.likes - 1 : c.likes + 1, is_liked: !c.is_liked }
          : c,
      ),
    }))
    await tryApi(() => api.comments.like(commentId), null)
  },

  loadPosts: async () => {
    const data = await tryApi(() => api.posts.list(), null)
    if (data && data.length > 0) {
      set({ posts: data })
    }
  },

  loadComments: async (postId) => {
    const data = await tryApi(() => api.comments.list(postId), null)
    if (data) {
      set({ comments: data })
    }
  },
}))
