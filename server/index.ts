import express from 'express'
import cors from 'cors'
import path from 'path'
import { initDB } from './db.js'
import authRoutes from './routes/auth.js'
import memoriesRoutes from './routes/memories.js'
import postsRoutes from './routes/posts.js'
import commentsRoutes from './routes/comments.js'
import storiesRoutes from './routes/stories.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/memories', memoriesRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/stories', storiesRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const distPath = path.resolve(process.cwd(), 'dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

async function start() {
  await initDB()
  app.listen(PORT, () => {
    console.log(`\n  Memory Lane running at http://localhost:${PORT}`)
    console.log(`  Health check: http://localhost:${PORT}/api/health\n`)
  })
}
start()
