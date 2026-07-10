import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, Gamepad2, Grid3X3, MessageCircleHeart, Plus, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuthStore();

  if (location.pathname === '/login') return null;

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/timeline', icon: Clock, label: '时间线' },
    { path: '/game', icon: Gamepad2, label: '游戏模式' },
    { path: '/gallery', icon: Grid3X3, label: '公共画廊' },
    { path: '/community', icon: MessageCircleHeart, label: '心灵交换' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center">
              <span className="text-night-900 font-serif font-bold text-lg">M</span>
            </div>
            <span className="font-serif text-xl text-cream-200">Memory Lane</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-cream-300 hover:bg-white/10 hover:text-cream-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/record')}
                  className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/30"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">记录记忆</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center text-night-900 hover:scale-105 transition-transform duration-300"
                  title={user?.name}
                >
                  <User size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-amber-500 text-night-900 rounded-full font-medium hover:bg-amber-400 transition-all duration-300"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
