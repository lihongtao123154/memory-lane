import { X, Calendar, MapPin } from 'lucide-react';
import { Memory } from '../types';
import { getEmotionInfo } from '../lib/utils';

interface MemoryDetailModalProps {
  memory: Memory;
  onClose: () => void;
}

function MemoryDetailModal({ memory, onClose }: MemoryDetailModalProps) {
  const emotionInfo = getEmotionInfo(memory.emotion);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div
        className="glass-effect rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {memory.photo_url && (
            <div className="h-64 overflow-hidden rounded-t-2xl">
              <img
                src={memory.photo_url}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-sm px-3 py-1 rounded-full text-night-900 font-medium"
              style={{ backgroundColor: emotionInfo.color }}
            >
              {emotionInfo.emoji} {emotionInfo.label}
            </span>
            <span className="text-cream-500 text-sm flex items-center gap-1">
              <Calendar size={14} />
              {new Date(memory.date).toLocaleDateString('zh-CN')}
            </span>
          </div>
          <h2 className="font-serif text-3xl text-cream-100 mb-4">{memory.title}</h2>
          <p className="text-cream-300 text-lg leading-relaxed mb-4">{memory.description}</p>
          {memory.location && (
            <div className="flex items-center gap-2 text-cream-400">
              <MapPin size={16} />
              <span>{memory.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryDetailModal;