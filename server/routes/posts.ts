import { Router, Response } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { AuthRequest, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req: AuthRequest, res: Response) => {
  await db.read()

  const header = _req.headers.authorization
  let userId: string | null = null
  if (header?.startsWith('Bearer ')) {
    try {
      const jwt = await import('jsonwebtoken')
      const JWT_SECRET = process.env.JWT_SECRET || 'memory-lane-dev-secret-2026'
      const decoded = jwt.default.verify(header.slice(7), JWT_SECRET) as { userId: string }
      userId = decoded.userId
    } catch {}
  }

  const posts = db.data!.posts.map((p) => ({
    ...p,
    comments: db.data!.comments.filter((c) => c.post_id === p.id).length,
    is_liked: false,
  }))

  if (userId) {
    const likesPostIds: string[] = []
    try {
      const likeIds: string[] = JSON.parse(localStorage.getItem(`likes_${userId}`) || '[]')
      likeIds.forEach((id) => likesPostIds.push(id))
    } catch {}

    posts.forEach((p) => {
      p.is_liked = likesPostIds.includes(p.id)
    })
  }

  res.json(posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { content, tags } = req.body
  if (!content) {
    res.status(400).json({ error: 'content required' })
    return
  }

  await db.read()
  const user = db.data!.users.find((u) => u.id === req.userId)

  const post = {
    id: uuid(),
    user_id: req.userId!,
    user_name: user?.name || 'User',
    user_avatar: user?.avatar_url || '',
    content,
    tags: tags || [],
    likes: 0,
    created_at: new Date().toISOString(),
  }
  db.data!.posts.push(post)
  await db.write()
  res.json(post)
})

router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  await db.read()
  const post = db.data!.posts.find((p) => p.id === req.params.id)
  if (!post) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  post.likes += 1
  await db.write()
  res.json({ likes: post.likes })
})

export default router
