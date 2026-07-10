import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, ArrowLeft, Heart } from 'lucide-react'
import { Memory, EMOTIONS } from '../../types'
import { hasAPIKey } from '../../lib/deepseek'
import {
  getFallbackGreeting,
  getFallbackTurn,
  getFallbackReflection,
} from '../../lib/chatFallback'

interface Message {
  role: 'ai' | 'user'
  content: string
}

interface GameChatProps {
  memory: Memory
  onBack: () => void
  onComplete: (memoryId: string) => void
}

function GameChat({ memory, onBack, onComplete }: GameChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [turnIndex, setTurnIndex] = useState(0)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [fallbackOptions, setFallbackOptions] = useState<{ text: string; trait: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const isAI = hasAPIKey()

  const emotionInfo = EMOTIONS.find((e) => e.value === memory.emotion) || EMOTIONS[0]
  const year = new Date(memory.date).getFullYear()

  const scrollDown = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollDown()
  }, [messages])

  useEffect(() => {
    const greeting = isAI
      ? `你好呀～欢迎来到「记忆回廊」。\n\n${memory.title}——${year} 年的这段记忆，在你的心里存放了这么久。今天要不要一起翻开它，看看里面藏着什么？\n\n跟我说说，${memory.description ? `你记录了：「${memory.description}」——除此之外，你还有什么想补充的吗？` : '关于这一天，你最先想到的画面是什么？'}`
      : getFallbackGreeting(memory.emotion, memory.title, year)

    setMessages([{ role: 'ai', content: greeting }])
    if (!isAI) {
      const turn = getFallbackTurn(memory.emotion, 0, memory.title)
      if (turn) {
        setFallbackOptions(turn.options)
        setTimeout(() => setShowOptions(true), 800)
      }
    }
  }, [memory, isAI])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isAIThinking) return
    setInput('')
    setShowOptions(false)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setIsAIThinking(true)

    if (isAI) {
      try {
        const { generateChatResponse } = await import('../../lib/deepseek')
        const history = [...messages, { role: 'user' as const, content: text }]
        const reply = await generateChatResponse(
          history.slice(1).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
          memory.title, memory.description, memory.date, memory.emotion, memory.location,
        )
        setMessages((prev) => [...prev, { role: 'ai', content: reply }])
      } catch {
        setMessages((prev) => [...prev, { role: 'ai', content: '嗯……记忆织者的声音好像被风吹散了一些。不过没关系，我还在听。你想继续说说吗？' }])
      }
    }
    setIsAIThinking(false)
  }

  const handleFallbackChoice = async (choice: string, _trait: string) => {
    setShowOptions(false)
    setMessages((prev) => [...prev, { role: 'user', content: choice }])
    setIsAIThinking(true)

    const turn = getFallbackTurn(memory.emotion, turnIndex, memory.title)
    const reaction = turn?.reactions[choice] || '嗯，我明白了。你能这样分享，真的很不容易。'
    const nextTurn = getFallbackTurn(memory.emotion, turnIndex + 1, memory.title)

    await new Promise((r) => setTimeout(r, 1200))

    if (nextTurn) {
      setMessages((prev) => [...prev, { role: 'ai', content: reaction + '\n\n' + nextTurn.question }])
      setFallbackOptions(nextTurn.options)
      setTurnIndex((i) => i + 1)
      setTimeout(() => setShowOptions(true), 500)
    } else {
      const reflection = getFallbackReflection(memory.emotion)
      setMessages((prev) => [...prev, { role: 'ai', content: reaction }, { role: 'ai', content: reflection }])
      setIsComplete(true)
    }
    setIsAIThinking(false)
  }

  const handleFinishMemory = () => {
    onComplete(memory.id)
  }

  const handleAIFinish = async () => {
    if (isAIThinking) return
    setIsAIThinking(true)
    setShowOptions(false)
    try {
      const { generateChatReflection } = await import('../../lib/deepseek')
      const history = messages.slice(1).map((m) => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.content }))
      const reflection = await generateChatReflection(history, memory.title, memory.description, memory.date, memory.emotion, memory.location)
      setMessages((prev) => [...prev, { role: 'ai', content: reflection }])
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: `和你的这段对话让我看见了「${memory.title}」对你独特的意义。记忆也许模糊了细节，但情感一直鲜活。好好珍藏它吧。` }])
    }
    setIsAIThinking(false)
    setIsComplete(true)
  }

  return (
    <div className="min-h-screen pt-16 pb-24 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 pt-4">
          <button onClick={onBack} className="flex items-center gap-2 text-cream-500 hover:text-cream-300 transition-colors">
            <ArrowLeft size={18} /><span className="text-sm">返回</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emotionInfo.emoji}</span>
            <div className="text-right">
              <h2 className="text-cream-100 font-serif text-lg leading-tight">{memory.title}</h2>
              <p className="text-cream-500 text-xs">{year}年 · {memory.location || '未知地点'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500/20 text-cream-100 rounded-br-md'
                  : 'glass-effect text-cream-200 rounded-bl-md'
              }`}>
                {msg.role === 'ai' && (
                  <span className="text-xs text-amber-400/70 block mb-1">记忆织者</span>
                )}
                <p className="whitespace-pre-line text-[15px]">{msg.content}</p>
              </div>
            </div>
          ))}

          {isAIThinking && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass-effect rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex items-center gap-2 text-cream-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">记忆织者正在思考...</span>
                </div>
              </div>
            </div>
          )}

          {showOptions && !isAI && (
            <div className="space-y-2 pt-2 animate-fade-in">
              <p className="text-cream-500 text-xs text-center">—— 选择一个回应 ——</p>
              {fallbackOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleFallbackChoice(opt.text, opt.trait)}
                  className="w-full text-left glass-effect rounded-xl px-5 py-3.5 text-cream-200 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-[15px] leading-relaxed"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="pt-4 pb-4 border-t border-white/5 mt-4">
          {!isComplete ? (
            <div className="flex gap-3">
              {isAI ? (
                <>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isAIThinking ? '记忆织者在思考...' : '输入你的回应...'}
                    disabled={isAIThinking}
                    className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-full text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-50 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isAIThinking}
                    className="w-12 h-12 rounded-full bg-amber-500 text-night-900 flex items-center justify-center hover:bg-amber-400 transition-all disabled:opacity-40 shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-center">
                  <button
                    onClick={handleFinishMemory}
                    className="px-8 py-3 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-sm hover:bg-amber-500/30 transition-all"
                  >
                    结束这段记忆的探索
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <Heart size={16} fill="currentColor" />
                <span className="text-sm font-medium">记忆已被唤醒</span>
                <Heart size={16} fill="currentColor" />
              </div>
              <button
                onClick={handleFinishMemory}
                className="px-10 py-3 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-all shadow-lg"
              >
                携着这段记忆离开
              </button>
              {isAI && (
                <button
                  onClick={handleAIFinish}
                  disabled={isAIThinking}
                  className="block mx-auto mt-2 px-6 py-2 text-cream-500 text-sm hover:text-cream-300 transition-colors"
                >
                  {isAIThinking ? '记忆织者正在编织总结...' : '让 AI 写一段总结'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameChat
