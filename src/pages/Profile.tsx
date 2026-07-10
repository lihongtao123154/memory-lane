import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Heart, Settings, LogOut, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useMemoryStore } from '../store/memoryStore';
import { getEmotionInfo, EMOTIONS } from '../lib/utils';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { memories, deleteMemory, updateMemory } = useMemoryStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<Record<string, string>>({});

  const handleEdit = (id: string, field: string, value: string) => {
    setEditContent((prev) => ({ ...prev, [`${id}-${field}`]: value }));
  };

  const handleSaveEdit = (id: string) => {
    const updates: Record<string, string> = {};
    const title = editContent[`${id}-title`];
    const description = editContent[`${id}-description`];
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (Object.keys(updates).length > 0) {
      updateMemory(id, updates);
    }
    setEditingId(null);
    setEditContent((prev) => {
      const newContent = { ...prev };
      delete newContent[`${id}-title`];
      delete newContent[`${id}-description`];
      return newContent;
    });
  };

  const emotionStats = memories.reduce((acc, m) => {
    acc[m.emotion] = (acc[m.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-warm flex items-center justify-center mx-auto mb-4">
            <User className="text-night-900" size={40} />
          </div>
          <h1 className="font-serif text-3xl text-cream-100 mb-2">{user?.name || '用户'}</h1>
          <p className="text-cream-400 flex items-center justify-center gap-2">
            <Mail size={16} />
            {user?.email}
          </p>
          <p className="text-cream-500 text-sm mt-2 flex items-center justify-center gap-1">
            <Calendar size={14} />
            加入于 {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-serif text-amber-400 mb-2">{memories.length}</div>
            <div className="text-cream-400 text-sm">总记忆数</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-serif text-amber-400 mb-2">
              {memories.filter((m) => m.is_public).length}
            </div>
            <div className="text-cream-400 text-sm">公开分享</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-serif text-amber-400 mb-2">
              {new Set(memories.map((m) => new Date(m.date).getFullYear())).size}
            </div>
            <div className="text-cream-400 text-sm">跨越年份</div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="font-serif text-xl text-cream-100 mb-4">情感分布</h2>
          <div className="flex flex-wrap gap-3">
            {EMOTIONS.map((emotion) => {
              const count = emotionStats[emotion.value] || 0;
              const percentage = memories.length > 0 ? (count / memories.length) * 100 : 0;
              return (
                <div key={emotion.value} className="flex items-center gap-2">
                  <span className="text-lg">{emotion.emoji}</span>
                  <span className="text-cream-300 text-sm">{emotion.label}</span>
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: emotion.color }}
                    />
                  </div>
                  <span className="text-cream-500 text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h2 className="font-serif text-xl text-cream-100 mb-4">我的记忆</h2>
          <div className="space-y-4">
            {memories.map((memory) => {
              const emotionInfo = getEmotionInfo(memory.emotion);
              const isEditing = editingId === memory.id;

              return (
                <div key={memory.id} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {memory.photo_url ? (
                      <img
                        src={memory.photo_url}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-night-700 flex items-center justify-center text-cream-500">
                        <Heart size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={memory.title}
                        onChange={(e) => handleEdit(memory.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-amber-500/50 rounded-lg text-cream-100 focus:outline-none focus:border-amber-500 mb-2"
                      />
                    ) : (
                      <h3 className="font-serif text-lg text-cream-100 mb-1">{memory.title}</h3>
                    )}
                    {isEditing ? (
                      <textarea
                        defaultValue={memory.description}
                        onChange={(e) => handleEdit(memory.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-white/10 border border-amber-500/50 rounded-lg text-cream-100 focus:outline-none focus:border-amber-500 mb-2 resize-none"
                      />
                    ) : (
                      <p className="text-cream-400 text-sm line-clamp-2">{memory.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-night-900"
                        style={{ backgroundColor: emotionInfo.color }}
                      >
                        {emotionInfo.emoji} {emotionInfo.label}
                      </span>
                      <span className="text-cream-500 text-xs">
                        {new Date(memory.date).toLocaleDateString('zh-CN')}
                      </span>
                      {memory.is_public ? (
                        <span className="flex items-center gap-1 text-cream-500 text-xs">
                          <Eye size={12} />
                          公开
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-cream-500 text-xs">
                          <EyeOff size={12} />
                          私密
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(memory.id)}
                        className="p-2 bg-amber-500 text-night-900 rounded-lg hover:bg-amber-400 transition-colors"
                        title="保存"
                      >
                        <Edit2 size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(memory.id)}
                        className="p-2 bg-white/10 text-cream-400 rounded-lg hover:bg-white/20 hover:text-cream-200 transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="p-2 bg-white/10 text-cream-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {memories.length === 0 && (
            <div className="text-center py-8">
              <Heart className="mx-auto text-cream-500 mb-4" size={32} />
              <p className="text-cream-400">还没有记录任何记忆</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-cream-300 rounded-full hover:bg-white/20 transition-colors">
            <Settings size={18} />
            设置
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
          >
            <LogOut size={18} />
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
