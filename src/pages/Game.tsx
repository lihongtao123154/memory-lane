import { useState, useMemo, useEffect } from 'react'
import { Sparkles, RotateCcw, Settings, X, ExternalLink } from 'lucide-react'
import { useMemoryStore } from '../store/memoryStore'
import { Memory, EMOTIONS } from '../types'
import GameChat from '../components/game/GameChat'
import { PROVIDERS, saveConfig, clearConfig, getCurrentProvider, hasAPIKey } from '../lib/deepseek'

type GamePhase = 'intro' | 'select' | 'chat' | 'results'

function Game() {
  const { memories } = useMemoryStore()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set())
  const [showSettings, setShowSettings] = useState(false)
  const [apiProvider, setApiProvider] = useState('')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [aiReady, setAiReady] = useState(false)

  useEffect(() => {
    const cur = getCurrentProvider()
    setApiProvider(cur.id)
    setAiReady(hasAPIKey())
  }, [])

  const remainingMemories = useMemo(() => memories.filter((m) => !exploredIds.has(m.id)), [memories, exploredIds])
  const grouped = useMemo(() => {
    const map = new Map<string, Memory[]>()
    for (const m of remainingMemories) {
      const key = m.emotion
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(m)
    }
    return map
  }, [remainingMemories])

  const handleStart = () => {
    if (memories.length === 0) return
    if (remainingMemories.length === 0) { setPhase('results'); return }
    setPhase('select')
  }

  const handleSelectMemory = (memory: Memory) => {
    setSelectedMemory(memory)
    setPhase('chat')
  }

  const handleCompleteMemory = (memoryId: string) => {
    const newExplored = new Set(exploredIds)
    newExplored.add(memoryId)
    setExploredIds(newExplored)
    setSelectedMemory(null)
    if (newExplored.size >= memories.length) { setPhase('results') }
    else { setPhase('select') }
  }

  const handleRestart = () => {
    setPhase('intro')
    setSelectedMemory(null)
    setExploredIds(new Set())
  }

  const handleSaveKey = () => {
    if (apiKeyInput.trim() && apiProvider) {
      saveConfig(apiProvider, apiKeyInput.trim())
      setApiKeyInput('')
      setAiReady(true)
      setShowSettings(false)
    }
  }

  const handleClearKey = () => {
    clearConfig()
    setApiKeyInput('')
    setAiReady(false)
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 via-amber-900/10 to-night-900" />
        {[...Array(25)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-amber-400/40 animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${5 + Math.random() * 5}s` }} />
        ))}
        <div className="relative z-10 text-center px-4 max-w-lg">
          <div className="text-5xl mb-6">🕯️</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream-100 mb-4">记忆回廊</h1>
          <p className="text-cream-400 text-lg mb-2 leading-relaxed">
            我是「记忆织者」。
            让我陪你聊聊那些被你珍藏的回忆。
          </p>
          <p className="text-cream-500 text-sm mb-8">
            {memories.length > 0
              ? `你记录了 ${memories.length} 段记忆，其中 ${exploredIds.size} 段已被唤醒`
              : '先去记录一些记忆再来找我吧'}
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleStart}
              disabled={memories.length === 0}
              className="inline-flex items-center gap-3 px-10 py-4 bg-amber-500 text-night-900 rounded-full text-lg font-medium hover:bg-amber-400 transition-all disabled:opacity-40 shadow-lg"
            >
              <Sparkles size={20} />
              <span>{remainingMemories.length > 0 ? '开始对话' : exploredIds.size > 0 ? '查看旅程总结' : '开始旅程'}</span>
            </button>
            {aiReady ? (
              <span className="text-xs text-green-400/70">AI 已就绪 · {getCurrentProvider().name}</span>
            ) : (
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 text-cream-500 text-sm hover:text-cream-300 transition-colors mt-2">
                <Settings size={14} />配置 AI 密钥
              </button>
            )}
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-900/70 backdrop-blur-sm">
            <div className="glass-effect rounded-2xl max-w-md w-full p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-cream-100">AI 服务配置</h3>
                <button onClick={() => setShowSettings(false)} className="text-cream-500 hover:text-cream-300"><X size={18} /></button>
              </div>

              <label className="block text-cream-300 text-xs font-medium mb-2">选择服务商</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setApiProvider(p.id); setApiKeyInput('') }}
                    className={`px-3 py-2.5 rounded-xl text-sm text-left transition-all border ${
                      apiProvider === p.id
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-white/5 border-white/10 text-cream-300 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] opacity-60 mt-0.5">{p.model}</div>
                  </button>
                ))}
              </div>

              <label className="block text-cream-300 text-xs font-medium mb-2">API Key</label>
              {(() => {
                const cur = PROVIDERS.find((p) => p.id === apiProvider)
                return (
                  <p className="text-cream-500 text-xs mb-3">
                    在 <a href={cur?.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-0.5">{cur?.name}<ExternalLink size={10} /></a> 获取密钥
                  </p>
                )
              })()}
              <input
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="粘贴 API Key..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 mb-3 text-sm"
              />
              <div className="flex gap-3">
                <button onClick={handleSaveKey} disabled={!apiKeyInput.trim()} className="flex-1 py-2.5 bg-amber-500 text-night-900 rounded-full font-medium text-sm hover:bg-amber-400 transition-all disabled:opacity-40">保存</button>
                <button onClick={handleClearKey} className="py-2.5 px-4 border border-white/10 text-cream-400 rounded-full text-sm hover:border-red-400/30 hover:text-red-400 transition-all">清除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'select') {
    return (
      <div className="min-h-screen pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-cream-100 mb-2">选择一段记忆来聊聊</h1>
            <p className="text-cream-500 text-sm">已唤醒 {exploredIds.size} / {memories.length} · 剩余 {remainingMemories.length}</p>
          </div>

          <div className="space-y-3">
            {[...EMOTIONS].filter((e) => grouped.has(e.value)).map((emotion) => (
              <div key={emotion.value} className="glass-effect rounded-xl overflow-hidden border border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                  <span className="text-xl">{emotion.emoji}</span>
                  <span className="text-cream-100 font-medium text-sm">{emotion.label}</span>
                  <span className="text-cream-500 text-xs ml-auto">{grouped.get(emotion.value)!.length} 段</span>
                </div>
                <div className="divide-y divide-white/5">
                  {grouped.get(emotion.value)!.map((memory) => (
                    <button
                      key={memory.id}
                      onClick={() => handleSelectMemory(memory)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-amber-500/5 transition-colors"
                    >
                      <span className="text-cream-500 text-xs font-mono w-14 shrink-0">{new Date(memory.date).getFullYear()}</span>
                      <span className="flex-1 text-cream-200 text-sm truncate">{memory.title}</span>
                      <span className="text-cream-500 text-xs shrink-0">聊一聊 →</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {exploredIds.size > 0 && (
            <div className="text-center mt-8">
              <button onClick={() => setPhase('results')} className="px-6 py-2.5 border border-white/10 text-cream-400 rounded-full text-sm hover:border-amber-500/30 transition-all">
                查看旅程总结
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'chat' && selectedMemory) {
    return (
      <GameChat
        memory={selectedMemory}
        onBack={() => { setSelectedMemory(null); setPhase('select') }}
        onComplete={handleCompleteMemory}
      />
    )
  }

  if (phase === 'results') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night-900 via-amber-900/10 to-night-900" />
        <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🪢</div>
          <h1 className="font-serif text-4xl text-cream-100 mb-4">旅程小结</h1>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-amber-400">{exploredIds.size}</div>
              <div className="text-cream-500 text-xs">唤醒的记忆</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-serif text-amber-400">{memories.length}</div>
              <div className="text-cream-500 text-xs">全部记忆</div>
            </div>
          </div>
          <p className="text-cream-400 text-sm mb-8 leading-relaxed">
            {exploredIds.size === 0
              ? '你还没有和记忆织者聊过任何记忆。下次来的时候，试试打开一段记忆，看看里面藏着什么故事吧。'
              : `你与记忆织者一起重温了 ${exploredIds.size} 段记忆。每一段对话都是一次重新发现——那些你以为已经淡忘的细节，其实一直在你心里。`}
          </p>
          <button onClick={handleRestart} className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-all shadow-lg">
            <RotateCcw size={18} />
            <span>{exploredIds.size > 0 ? '再次出发' : '开始旅程'}</span>
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default Game
