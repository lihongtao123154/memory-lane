import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EMOTIONS, EmotionOption } from "../types"

export { EMOTIONS }

const emotionMap = new Map<string, EmotionOption>(
  EMOTIONS.map((e) => [e.value, e])
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEmotionInfo(emotion: string): EmotionOption {
  return emotionMap.get(emotion) || EMOTIONS[0]
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}
