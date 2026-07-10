import { Router, Response } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { AuthRequest, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req: AuthRequest, res: Response) => {
  await db.read()
  const postId = req.query.post_id as string | undefined
  let comments = db.data!.comments
  if (postId) {
    comments = comments.filter((c) => c.post_id === postId)
  }
  res.json(comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { post_id, content } = req.body
  if (!post_id || !content) {
    res.status(400).json({ error: 'post_id, content required' })
    return
  }

  await db.read()
  const user = db.data!.users.find((u) => u.id === req.userId)

  const comment = {
    id: uuid(),
    post_id,
    user_id: req.userId!,
    user_name: user?.name || 'User',
    user_avatar: user?.avatar_url || '',
    content,
    likes: 0,
    created_at: new Date().toISOString(),
  }
  db.data!.comments.push(comment)
  await db.write()
  res.json(comment)
})

router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  await db.read()
  const comment = db.data!.comments.find((c) => c.id === req.params.id)
  if (!comment) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  comment.likes += 1
  await db.write()
  res.json({ likes: comment.likes })
})

export default router
