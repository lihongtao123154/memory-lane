import { Router, Response } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { AuthRequest, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req: AuthRequest, res: Response) => {
  await db.read()
  const header = req.headers.authorization
  let userId: string | null = null
  if (header?.startsWith('Bearer ')) {
    try {
      const jwt = await import('jsonwebtoken')
      const JWT_SECRET = process.env.JWT_SECRET || 'memory-lane-dev-secret-2026'
      const decoded = jwt.default.verify(header.slice(7), JWT_SECRET) as { userId: string }
      userId = decoded.userId
    } catch {}
  }

  const memories = db.data!.memories.filter((m) => m.is_public || m.user_id === userId)
  res.json(memories)
})

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, description, date, location, emotion, photo_url, is_public } = req.body
  if (!title || !date) {
    res.status(400).json({ error: 'title, date required' })
    return
  }

  const memory = {
    id: uuid(),
    user_id: req.userId!,
    title,
    description: description || '',
    date,
    location: location || '',
    emotion: emotion || '',
    photo_url: photo_url || '',
    is_public: is_public || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  db.data!.memories.push(memory)
  await db.write()
  res.json(memory)
})

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  await db.read()
  const idx = db.data!.memories.findIndex((m) => m.id === req.params.id && m.user_id === req.userId)
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  db.data!.memories[idx] = { ...db.data!.memories[idx], ...req.body, updated_at: new Date().toISOString() }
  await db.write()
  res.json(db.data!.memories[idx])
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  await db.read()
  const idx = db.data!.memories.findIndex((m) => m.id === req.params.id && m.user_id === req.userId)
  if (idx === -1) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  db.data!.memories.splice(idx, 1)
  await db.write()
  res.json({ success: true })
})

export default router
