import { useState } from 'react';
import { X, Send, Tag } from 'lucide-react';
import { POST_TAGS, Post } from '../types';
import { useCommunityStore } from '../store/communityStore';
import { useAuthStore } from '../store/authStore';
import UserAvatar from './UserAvatar';

interface PostModalProps {
  onClose: () => void;
}

function PostModal({ onClose }: PostModalProps) {
  const { currentUser } = useAuthStore();
  const { addPost } = useCommunityStore();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user_id: currentUser?.id || '',
      user_name: currentUser?.name || '旅人',
      user_avatar: '',
      content: content.trim(),
      tags: selectedTags.length > 0 ? selectedTags : ['心情'],
      likes: 0,
      comments: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
    };
    
    addPost(newPost);
    setContent('');
    setSelectedTags([]);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-night-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-effect rounded-2xl w-full max-w-lg p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-cream-100">发布心声</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="text-cream-400" size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <UserAvatar name={currentUser?.name || '旅人'} size="lg" />
          <span className="font-medium text-cream-100">{currentUser?.name || '旅人'}</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="说说你的心里话..."
          className="w-full h-40 bg-night-900/50 border border-white/10 rounded-xl p-4 text-cream-200 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
        />

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="text-cream-400" size={16} />
            <span className="text-cream-400 text-sm">添加标签（最多选3个）</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POST_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-amber-500 text-night-900'
                    : 'glass-effect text-cream-300 hover:border-amber-500/30'
                }`}
                disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-cream-500 text-sm">
            {content.length} / 500
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 glass-effect rounded-full text-cream-300 hover:border-amber-500/30 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-warm text-night-900 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>{isSubmitting ? '发布中...' : '发布'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;