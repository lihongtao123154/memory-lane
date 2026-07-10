import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Tag, Filter } from 'lucide-react';
import { useCommunityStore } from '../store/communityStore';
import { POST_TAGS } from '../types';
import { formatTime } from '../lib/utils';
import PostModal from '../components/PostModal';
import UserAvatar from '../components/UserAvatar';

function Community() {
  const navigate = useNavigate();
  const { posts, likePost } = useCommunityStore();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-cream-100 mb-4">心灵交换</h1>
          <p className="text-cream-400">在这里倾诉心声，与他人共鸣</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedTag === null
                  ? 'bg-amber-500 text-night-900'
                  : 'glass-effect text-cream-300 hover:border-amber-500/30'
              }`}
            >
              <Filter size={16} />
              <span>全部</span>
            </button>
            {POST_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-night-900'
                    : 'glass-effect text-cream-300 hover:border-amber-500/30'
                }`}
              >
                <Tag size={16} />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-warm text-night-900 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Send size={18} />
            <span>发布心声</span>
          </button>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="glass-effect rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <UserAvatar name={post.user_name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-cream-100">{post.user_name}</span>
                    <span className="text-cream-500 text-sm">{formatTime(post.created_at)}</span>
                  </div>
                  <p className="text-cream-300 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        post.is_liked ? 'text-red-400' : 'text-cream-500 hover:text-red-400'
                      }`}
                    >
                      <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => navigate(`/community/${post.id}`)}
                      className="flex items-center gap-2 text-cream-500 hover:text-amber-400 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments} 评论</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full glass-effect flex items-center justify-center mx-auto mb-4">
              <Tag className="text-cream-500" size={32} />
            </div>
            <p className="text-cream-400">暂无相关帖子</p>
          </div>
        )}

      </div>

      {showPostModal && (
        <PostModal onClose={() => setShowPostModal(false)} />
      )}
    </div>
  );
}

export default Community;