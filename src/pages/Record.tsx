import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Sparkles, Save, X } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { useAuthStore } from '../store/authStore';
import { EMOTIONS, Memory, MemoryFormData } from '../types';

function Record() {
  const navigate = useNavigate();
  const { addMemory } = useMemoryStore();
  const { currentUser } = useAuthStore();

  const [formData, setFormData] = useState<MemoryFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    emotion: '',
    photo_url: '',
    is_public: false,
  });

  const [isPolishing, setIsPolishing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) {
      alert('请填写标题和日期');
      return;
    }

    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      user_id: currentUser?.id || 'guest',
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await addMemory(newMemory);
    navigate('/timeline');
  };

  const handlePolish = async () => {
    if (!formData.title && !formData.description) {
      alert('请先填写一些内容');
      return;
    }

    setIsPolishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const polishOptions = [
      `在${formData.date ? `${new Date(formData.date).toLocaleDateString()}` : '那一天'}，${formData.location ? `${formData.location}` : ''}，${formData.title}。这是一段珍贵的回忆，值得永远珍藏。`,
      `${formData.title}，${formData.location ? '发生在' + formData.location : ''}。${formData.date ? '那是' + new Date(formData.date).toLocaleDateString() + '的事' : ''}，至今回想起来，依然历历在目。`,
      `回忆起${formData.title}的那一刻，心中充满了${EMOTIONS.find((e) => e.value === formData.emotion)?.label || '温暖'}。${formData.location ? `${formData.location}` : ''}的点点滴滴，都成为了人生中宝贵的财富。`,
    ];

    setFormData((prev) => ({
      ...prev,
      description: polishOptions[Math.floor(Math.random() * polishOptions.length)],
    }));
    setIsPolishing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, photo_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-cream-100">记录记忆</h1>
          <button
            onClick={() => navigate('/timeline')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-cream-400 hover:text-cream-200 hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <label className="block text-cream-300 text-sm font-medium mb-2">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="给这段记忆起个名字..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-cream-300 text-sm font-medium mb-2">日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-cream-300 text-sm font-medium mb-2">地点</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500" size={18} />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="这段记忆发生在哪里？"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-cream-300 text-sm font-medium mb-3">情感标签</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, emotion: emotion.value }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    formData.emotion === emotion.value
                      ? 'ring-2 ring-offset-2 ring-offset-night-900'
                      : 'bg-white/5 hover:bg-white/10 text-cream-400'
                  }`}
                  style={{
                    backgroundColor: formData.emotion === emotion.value ? emotion.color : undefined,
                    color: formData.emotion === emotion.value ? '#1D3557' : undefined,
                    boxShadow: formData.emotion === emotion.value ? `0 0 0 2px ${emotion.color}` : undefined,
                  }}
                >
                  {emotion.emoji} {emotion.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-cream-300 text-sm font-medium mb-2">照片</label>
            <div
              className={`relative w-full h-48 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                previewImage ? 'border-amber-500/50' : 'border-white/20 hover:border-amber-500/30'
              }`}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {previewImage ? (
                <img src={previewImage} alt="预览" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto text-cream-500 mb-2" size={32} />
                  <p className="text-cream-500 text-sm">点击上传照片</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-cream-300 text-sm font-medium">描述</label>
              <button
                type="button"
                onClick={handlePolish}
                disabled={isPolishing}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isPolishing
                    ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed'
                    : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <Sparkles size={14} className={isPolishing ? 'animate-spin' : ''} />
                {isPolishing ? 'AI 润色中...' : 'AI 润色'}
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="写下这段记忆的故事..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="is-public"
              checked={formData.is_public}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_public: e.target.checked }))}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50"
            />
            <label htmlFor="is-public" className="text-cream-400 text-sm">
              设为公开（可被他人在公共画廊中看到）
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-warm text-night-900 rounded-xl font-medium text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <Save size={20} />
            保存记忆
          </button>
        </form>
      </div>
    </div>
  );
}

export default Record;
