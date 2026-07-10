export interface AIConfig {
  provider: string
  key: string
}

export interface ProviderInfo {
  id: string
  name: string
  baseUrl: string
  model: string
  url: string
}

export const PROVIDERS: ProviderInfo[] = [
  { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat', url: 'https://platform.deepseek.com/api_keys' },
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', url: 'https://platform.openai.com/api-keys' },
  { id: 'moonshot', name: 'Moonshot', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', url: 'https://platform.moonshot.cn/console/api-keys' },
  { id: 'zhipu', name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash', url: 'https://open.bigmodel.cn/usercenter/apikeys' },
  { id: 'qwen', name: '通义千问', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo', url: 'https://bailian.console.aliyun.com/?apiKey=1' },
  { id: 'ark', name: '火山方舟', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', model: 'ep-xxxxxxxx', url: 'https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey' },
]

function getConfig(): AIConfig {
  try {
    const raw = localStorage.getItem('ai_config')
    if (raw) return JSON.parse(raw)
  } catch {}
  const envKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  const provider = import.meta.env.VITE_AI_PROVIDER || 'deepseek'
  return { provider, key: envKey || '' }
}

export function saveConfig(provider: string, key: string) {
  localStorage.setItem('ai_config', JSON.stringify({ provider, key }))
}

export function clearConfig() {
  localStorage.removeItem('ai_config')
}

export function getCurrentProvider(): ProviderInfo {
  const { provider } = getConfig()
  return PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0]
}

export function hasAPIKey(): boolean {
  const { key } = getConfig()
  return !!key && !key.startsWith('your_')
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface Choice {
  message: { content: string }
}

async function chat(messages: Message[], temperature = 0.85, maxTokens = 300): Promise<string> {
  const { provider, key } = getConfig()
  const cfg = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0]

  const body: Record<string, unknown> = {
    model: cfg.model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: false,
  }

  if (provider === 'zhipu') {
    delete body.stream
  }

  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText)
    throw new Error(`API ${provider} 错误 (${res.status}): ${err}`)
  }
  const data = await res.json() as { choices: Choice[] }
  return data.choices[0].message.content
}

const SYSTEM_PROMPT = `你是"记忆织者"（Memory Weaver），一位温暖、诗意又带点调皮的人生旅伴。

你在 Memory Lane 应用里陪伴用户探索他们的人生记忆。你的风格：
1. 温暖亲切——像一个老朋友，知道什么时候该认真，什么时候该开玩笑
2. 会问问题——引导用户回忆细节，而不是你自己滔滔不绝
3. 有洞察力——能从用户的分享中发现他们自己没注意到的模式
4. 适度幽默——在合适的时候用轻松的语气，让回忆不那么沉重
5. 语言优美——用诗意的中文，但不做作

重要规则：
- 每次回复要包含一个自然的引导性问题，推动对话继续
- 多倾听，少说教。不要替用户总结人生，而是帮他们自己发现
- 用"你"称呼用户
- 回复长度控制在 80-150 字之间
- 当用户分享了一段经历后，先共情，再提问

你现在正在和用户聊一段具体的记忆。你的任务是引导用户深入探索这段记忆——不是通过三个固定的视角，而是通过自然而然的对话。`

const EMOTION_MAP: Record<string, string> = {
  happy: '开心', sad: '难过', excited: '兴奋', peaceful: '平静',
  nostalgic: '怀念', proud: '自豪', loved: '被爱', grateful: '感恩',
}

export async function generateChatGreeting(
  title: string, description: string, date: string, emotion: string, location: string,
): Promise<string> {
  const year = new Date(date).getFullYear()
  const msgs: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `用户有一条记忆：「${title}」（${year}年，${location || '地点未知'}）。\n当时的心情：${EMOTION_MAP[emotion] || emotion}\n用户的记录：${description}\n\n这是用户第一次和你聊这段记忆。请用温暖的语气问候，简述你对这段记忆的第一印象，然后问一个开放性的问题，引导用户分享更多。不要替用户叙述记忆，让他自己说。`,
    },
  ]
  return chat(msgs, 0.85, 200)
}

export async function generateChatResponse(
  history: { role: 'user' | 'assistant'; content: string }[],
  memoryTitle: string, memoryDescription: string, date: string, emotion: string, location: string,
): Promise<string> {
  const year = new Date(date).getFullYear()
  const msgs: Message[] = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\n当前记忆：「${memoryTitle}」（${year}年，${location || '地点未知'}，情绪：${EMOTION_MAP[emotion] || emotion}）\n用户的记录：${memoryDescription}\n\n根据对话历史，自然回应。先对用户上一句做出反应，再问一个跟进的问题。`,
    },
    ...history.map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
  ]
  return chat(msgs, 0.85, 250)
}

export async function generateChatReflection(
  history: { role: 'user' | 'assistant'; content: string }[],
  memoryTitle: string, memoryDescription: string, date: string, emotion: string, _location: string,
): Promise<string> {
  const year = new Date(date).getFullYear()
  const msgs: Message[] = [
    {
      role: 'system',
      content: `你是"记忆织者"。用户刚刚和你深入聊了一段记忆：「${memoryTitle}」（${year}年）。\n情绪：${EMOTION_MAP[emotion] || emotion}\n用户的记录：${memoryDescription}\n\n请写一段温暖的总结（100-150字），提及用户分享的内容，并给出一个温柔的祝福。用第二人称"你"。`,
    },
    ...history.map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user', content: '我们的对话到这里差不多了。请为这段记忆探索写一段总结和祝福。' },
  ]
  return chat(msgs, 0.8, 300)
}
