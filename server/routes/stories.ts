import { Router, Response } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { AuthRequest, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req: AuthRequest, res: Response) => {
  await db.read()
  res.json(db.data!.stories.filter((s) => s.is_public))
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, cover_url, summary, is_public } = req.body
  if (!title) {
    res.status(400).json({ error: 'title required' })
    return
  }

  const story = {
    id: uuid(),
    user_id: req.userId!,
    title,
    cover_url: cover_url || '',
    summary: summary || '',
    is_public: is_public !== false,
    created_at: new Date().toISOString(),
  }
  db.data!.stories.push(story)
  await db.write()
  res.json(story)
})

export default router
