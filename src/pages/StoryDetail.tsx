import { useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '../store/storyStore';
import { useMemoryStore } from '../store/memoryStore';
import { getEmotionInfo } from '../lib/utils';

function StoryDetail() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { stories } = useStoryStore();
  const { memories } = useMemoryStore();

  const story = stories.find((s) => s.id === storyId);
  const storyMemories = memories.filter((m) => m.is_public);

  if (!story) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-cream-100 mb-4">故事不存在</h2>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-2 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-colors"
          >
            返回画廊
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/gallery')}
          className="flex items-center gap-2 text-cream-400 hover:text-cream-200 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          返回画廊
        </button>

        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={story.cover_url}
            alt={story.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/90 via-night-900/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="font-serif text-3xl md:text-4xl text-cream-100 mb-3">{story.title}</h1>
            <p className="text-cream-300">{story.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-cream-300 rounded-full hover:bg-white/20 transition-colors">
            <Heart size={18} />
            <span>收藏</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-cream-300 rounded-full hover:bg-white/20 transition-colors">
            <Share2 size={18} />
            <span>分享</span>
          </button>
        </div>

        <h2 className="font-serif text-2xl text-cream-100 mb-6">故事中的记忆</h2>

        <div className="space-y-4">
          {storyMemories.map((memory) => {
            const emotionInfo = getEmotionInfo(memory.emotion);
            return (
              <div key={memory.id} className="glass-effect rounded-xl p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    {memory.photo_url ? (
                      <img
                        src={memory.photo_url}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-night-700 flex items-center justify-center text-cream-500">
                        <span className="text-2xl">📷</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-sm px-2 py-0.5 rounded-full text-night-900 font-medium"
                        style={{ backgroundColor: emotionInfo.color }}
                      >
                        {emotionInfo.emoji} {emotionInfo.label}
                      </span>
                      <span className="text-cream-500 text-sm flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(memory.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-cream-100 mb-2">{memory.title}</h3>
                    <p className="text-cream-400">{memory.description}</p>
                    {memory.location && (
                      <p className="text-cream-500 text-sm mt-2 flex items-center gap-1">
                        <MapPin size={12} />
                        {memory.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StoryDetail;
