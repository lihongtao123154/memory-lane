import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Calendar, Grid3X3 } from 'lucide-react';
import { useStoryStore } from '../store/storyStore';

function Gallery() {
  const navigate = useNavigate();
  const { stories } = useStoryStore();

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-cream-100 mb-4">公共画廊</h1>
          <p className="text-cream-400">探索他人分享的精彩人生故事</p>
        </div>

        {stories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full glass-effect flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="text-cream-500" size={32} />
            </div>
            <p className="text-cream-400">还没有人分享故事</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => navigate(`/gallery/${story.id}`)}
              className="group glass-effect rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 transform hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={story.cover_url}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl text-cream-100 mb-2">{story.title}</h3>
                  <p className="text-cream-400 text-sm line-clamp-2">{story.summary}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-cream-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(story.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {Math.floor(Math.random() * 1000) + 100}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {Math.floor(Math.random() * 200) + 20}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Gallery;
