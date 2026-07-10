import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export interface DBUser {
  id: string
  email: string
  name: string
  avatar_url: string
  password: string
  created_at: string
}

export interface DBMemory {
  id: string
  user_id: string
  title: string
  description: string
  date: string
  location: string
  emotion: string
  photo_url: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface DBPost {
  id: string
  user_id: string
  user_name: string
  user_avatar: string
  content: string
  tags: string[]
  likes: number
  created_at: string
}

export interface DBComment {
  id: string
  post_id: string
  user_id: string
  user_name: string
  user_avatar: string
  content: string
  likes: number
  created_at: string
}

export interface DBStory {
  id: string
  user_id: string
  title: string
  cover_url: string
  summary: string
  is_public: boolean
  created_at: string
}

interface DBData {
  users: DBUser[]
  memories: DBMemory[]
  posts: DBPost[]
  comments: DBComment[]
  stories: DBStory[]
}

const defaultData: DBData = {
  users: [],
  memories: [],
  posts: [],
  comments: [],
  stories: [],
}

const db = new Low<DBData>(new JSONFile(path.join(__dirname, '../data.json')), defaultData)

export async function initDB() {
  await db.read()
  if (!db.data) {
    db.data = defaultData
    await db.write()
  }
}

export default db
