import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { useCommunityStore } from '../store/communityStore';
import { useAuthStore } from '../store/authStore';
import { Comment } from '../types';
import { formatTime } from '../lib/utils';
import UserAvatar from '../components/UserAvatar';

function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { posts, comments, likePost, addComment, likeComment } = useCommunityStore();
  const { currentUser } = useAuthStore();
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const post = posts.find((p) => p.id === postId);
  const postComments = comments.filter((c) => c.post_id === postId);

  useEffect(() => {
    if (!post) {
      navigate('/community');
    }
  }, [post, navigate]);

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      post_id: postId || '',
      user_id: currentUser?.id || '',
      user_name: currentUser?.name || '旅人',
      user_avatar: '',
      content: commentInput,
      likes: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
    };
    
    addComment(newComment);
    setCommentInput('');
    setIsSubmitting(false);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cream-400">帖子不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-cream-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span>返回心灵交换</span>
        </button>

        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <UserAvatar name={post.user_name} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-cream-100">{post.user_name}</span>
                <span className="text-cream-500 text-sm">{formatTime(post.created_at)}</span>
              </div>
              <p className="text-cream-200 leading-relaxed text-lg mb-4">{post.content}</p>
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
                  <Heart size={20} fill={post.is_liked ? 'currentColor' : 'none'} />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-cream-500">
                  <MessageCircle size={20} />
                  <span>{post.comments} 评论</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="font-serif text-xl text-cream-100 mb-4">评论 ({postComments.length})</h3>
          
          {postComments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cream-500">暂无评论，来说点什么吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {postComments.map((comment) => (
                <div key={comment.id} className="pb-4 border-b border-white/5 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <UserAvatar name={comment.user_name} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-cream-100 text-sm">{comment.user_name}</span>
                        <span className="text-cream-500 text-xs">{formatTime(comment.created_at)}</span>
                      </div>
                      <p className="text-cream-300 text-sm mb-2">{comment.content}</p>
                      <button
                        onClick={() => likeComment(comment.id)}
                        className={`flex items-center gap-1 text-xs transition-all duration-300 ${
                          comment.is_liked ? 'text-red-400' : 'text-cream-500 hover:text-red-400'
                        }`}
                      >
                        <Heart size={14} fill={comment.is_liked ? 'currentColor' : 'none'} />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-effect rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <UserAvatar name={currentUser?.name || '旅人'} size="sm" />
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                placeholder="写下你的评论..."
                className="w-full bg-night-900/50 border border-white/10 rounded-full px-4 py-2 text-cream-200 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <button
              onClick={handleSubmitComment}
              disabled={!commentInput.trim() || isSubmitting}
              className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className="text-night-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;