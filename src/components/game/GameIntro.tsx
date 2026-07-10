import { Sparkles, Play } from 'lucide-react'

interface GameIntroProps {
  memoryCount: number
  onStart: () => void
}

function GameIntro({ memoryCount, onStart }: GameIntroProps) {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-night-900 via-amber-900/10 to-night-900" />
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-8">
          <Sparkles className="text-amber-400" size={16} />
          <span className="text-amber-300 text-sm">AI 驱动的记忆探索</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl text-cream-100 mb-6">
          记忆回廊
        </h1>
        <p className="text-cream-400 text-lg md:text-xl mb-4 leading-relaxed">
          你的每一段记忆都是一扇门。<br />
          走进去，让"记忆织者"为你重现那时的光影、温度与心跳。
        </p>
        <p className="text-cream-500 text-sm mb-10">
          每当触碰一段记忆，AI 将生成独一无二的叙事体验
        </p>
        {memoryCount > 0 ? (
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-10 py-4 bg-amber-500 text-night-900 rounded-full text-lg font-medium 
              hover:bg-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:scale-105"
          >
            <Play size={22} fill="currentColor" />
            <span>开始旅程（{memoryCount} 段记忆）</span>
          </button>
        ) : (
          <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-cream-400 mb-4">还没有记录任何记忆</p>
            <p className="text-cream-500 text-sm">先去"记录记忆"页面添加一些人生故事吧</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameIntro
