import { useNavigate } from 'react-router-dom';
import { Clock, Gamepad2, Grid3X3, MessageCircleHeart, Sparkles } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { useAuthStore } from '../store/authStore';

function Home() {
  const navigate = useNavigate();
  const { memories } = useMemoryStore();
  const { user } = useAuthStore();

  const memoryCount = memories.length;
  const earliestMemory = memories.length > 0 ? new Date(memories[0].date).getFullYear() : null;
  const latestMemory = memories.length > 0 ? new Date(memories[memories.length - 1].date).getFullYear() : null;

  const features = [
    {
      icon: Clock,
      title: '时间线浏览',
      description: '按时间顺序回顾你的人生故事',
      path: '/timeline',
      gradient: 'from-amber-500/20 to-amber-600/10',
    },
    {
      icon: Gamepad2,
      title: '游戏模式',
      description: '像玩游戏一样"走过"你的人生',
      path: '/game',
      gradient: 'from-purple-500/20 to-purple-600/10',
    },
    {
      icon: Grid3X3,
      title: '公共画廊',
      description: '探索他人分享的精彩人生',
      path: '/gallery',
      gradient: 'from-blue-500/20 to-blue-600/10',
    },
    {
      icon: MessageCircleHeart,
      title: '心灵交换',
      description: '倾诉心声，与他人共鸣',
      path: '/community',
      gradient: 'from-pink-500/20 to-pink-600/10',
    },
  ];

  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-night">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-500/30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
            <Sparkles className="text-amber-400" size={18} />
            <span className="text-amber-300 text-sm">让记忆不再是静止的片段</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-cream-100 mb-6">
            人生长廊
          </h1>
          <p className="text-xl md:text-2xl text-cream-300 max-w-2xl mx-auto mb-8">
            Memory Lane
          </p>
          <p className="text-lg text-cream-400 max-w-3xl mx-auto">
            将散落的记忆串成一条可"走"过的人生之路，重温那些温暖的瞬间，
            让数字记忆重新拥有温度。
          </p>
        </div>

        {user && memoryCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">{memoryCount}</div>
              <div className="text-cream-400">珍贵记忆</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">
                {earliestMemory ? `${latestMemory! - earliestMemory}` : 0}
              </div>
              <div className="text-cream-400">岁月跨度（年）</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">
                {new Date().getFullYear() - (earliestMemory || new Date().getFullYear())}
              </div>
              <div className="text-cream-400">记录时长（年）</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className={`group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${feature.gradient} 
                  border border-white/10 hover:border-amber-500/30 
                  transition-all duration-500 transform hover:scale-105 hover:shadow-xl`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Icon className="text-amber-400" size={32} />
                </div>
                <h3 className="font-serif text-2xl text-cream-100 mb-3">{feature.title}</h3>
                <p className="text-cream-400">{feature.description}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </button>
            );
          })}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-cream-500 text-sm">
            "每一段记忆，都是人生长廊中独特的风景"
          </p>
          <p className="text-cream-600 text-xs mt-3 tracking-widest">— 深 海</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
