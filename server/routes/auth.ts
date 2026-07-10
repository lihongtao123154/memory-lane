import { Router, Request, Response } from 'express'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { v4 as uuid } from 'uuid'
import db from '../db.js'
import { generateToken } from '../middleware/auth.js'

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':')
  const hash = scryptSync(password, salt, 64).toString('hex')
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(key))
  } catch {
    return false
  }
}

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    res.status(400).json({ error: 'email, password, name required' })
    return
  }

  await db.read()
  const existing = db.data!.users.find((u) => u.email === email)
  if (existing) {
    res.status(409).json({ error: 'Email already registered' })
    return
  }

  const hashed = hashPassword(password)
  const user = {
    id: uuid(),
    email,
    name,
    avatar_url: '',
    password: hashed,
    created_at: new Date().toISOString(),
  }
  db.data!.users.push(user)
  await db.write()

  const token = generateToken(user.id)
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url, created_at: user.created_at },
  })
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'email, password required' })
    return
  }

  await db.read()
  const user = db.data!.users.find((u) => u.email === email)
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = verifyPassword(password, user.password)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = generateToken(user.id)
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url, created_at: user.created_at },
  })
})

router.get('/me', async (req: Request, res: Response) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.json({ user: null })
    return
  }

  try {
    const jwt = await import('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'memory-lane-dev-secret-2026'
    const decoded = jwt.default.verify(header.slice(7), JWT_SECRET) as { userId: string }
    await db.read()
    const user = db.data!.users.find((u) => u.id === decoded.userId)
    if (user) {
      res.json({ user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url, created_at: user.created_at } })
    } else {
      res.json({ user: null })
    }
  } catch {
    res.json({ user: null })
  }
})

export default router
