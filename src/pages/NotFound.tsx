import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <Ghost className="text-cream-500" size={48} />
        </div>
        <h1 className="font-serif text-4xl text-cream-100 mb-4">404</h1>
        <h2 className="font-serif text-2xl text-cream-200 mb-4">页面不存在</h2>
        <p className="text-cream-400 mb-8">你要找的页面似乎迷路了...</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft size={18} />
          返回首页
        </button>
      </div>
    </div>
  );
}

export default NotFound;