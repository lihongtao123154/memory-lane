import { useState } from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { Memory } from '../types';
import { getEmotionInfo } from '../lib/utils';
import MemoryDetailModal from '../components/MemoryDetailModal';

function Timeline() {
  const { memories } = useMemoryStore();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const groupedMemories = memories.reduce((acc, memory) => {
    const year = new Date(memory.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(memory);
    return acc;
  }, {} as Record<number, Memory[]>);

  const sortedYears = Object.keys(groupedMemories).map(Number).sort((a, b) => b - a);

  if (memories.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="text-amber-400" size={32} />
          </div>
          <h2 className="font-serif text-2xl text-cream-100 mb-4">还没有记录任何记忆</h2>
          <p className="text-cream-400">开始记录你的第一个人生故事吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-cream-100 mb-4">人生时间线</h1>
          <p className="text-cream-400">沿着时光的轨迹，重温每一个珍贵的瞬间</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-600 to-transparent" />

          {sortedYears.map((year, yearIndex) => (
            <div key={year} className="mb-12 animate-slide-up" style={{ animationDelay: `${yearIndex * 0.1}s` }}>
              <div className="flex items-center mb-6">
                <div className="absolute left-4 w-5 h-5 rounded-full bg-amber-500 border-4 border-night-900" />
                <span className="font-serif text-3xl text-amber-400 ml-16">{year}</span>
              </div>

              <div className="ml-16 space-y-4">
                {groupedMemories[year].map((memory) => {
                  const emotionInfo = getEmotionInfo(memory.emotion);
                  const date = new Date(memory.date);
                  const month = date.getMonth() + 1;
                  const day = date.getDate();

                  return (
                    <button
                      key={memory.id}
                      onClick={() => setSelectedMemory(memory)}
                      className="w-full text-left glass-effect rounded-xl p-4 hover:border-amber-500/30 transition-all duration-300 group"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-night-700">
                          {memory.photo_url ? (
                            <img
                              src={memory.photo_url}
                              alt={memory.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-cream-500">
                              <Heart size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-sm px-2 py-0.5 rounded-full text-night-900 font-medium"
                              style={{ backgroundColor: emotionInfo.color }}
                            >
                              {emotionInfo.emoji} {emotionInfo.label}
                            </span>
                            <span className="text-cream-500 text-sm flex items-center gap-1">
                              <Calendar size={12} />
                              {month}月{day}日
                            </span>
                          </div>
                          <h3 className="font-serif text-xl text-cream-100 mb-1 truncate">{memory.title}</h3>
                          <p className="text-cream-400 text-sm line-clamp-2">{memory.description}</p>
                          {memory.location && (
                            <p className="text-cream-500 text-xs mt-1 flex items-center gap-1">
                              <MapPin size={12} />
                              {memory.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMemory && (
        <MemoryDetailModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
      )}
    </div>
  );
}

export default Timeline;