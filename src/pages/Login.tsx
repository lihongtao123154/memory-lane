import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const name = nameRef.current?.value || '';
    
    if (!email || !password) {
      alert('请填写邮箱和密码');
      return;
    }
    
    if (!isLogin && !name) {
      alert('请填写昵称');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/');
    } catch (error) {
      alert('登录/注册失败，请重试');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="max-w-md w-full px-4 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-warm flex items-center justify-center mx-auto mb-4">
              <span className="text-night-900 font-serif font-bold text-2xl">M</span>
            </div>
            <h1 className="font-serif text-3xl text-cream-100 mb-2">Memory Lane</h1>
            <p className="text-cream-400">人生长廊</p>
          </div>

          <div className="flex mb-8 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-amber-500 text-night-900'
                  : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-amber-500 text-night-900'
                  : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-cream-300 text-sm font-medium mb-2">昵称</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500" size={18} />
                  <input
                    ref={nameRef}
                    type="text"
                    placeholder="请输入昵称"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-cream-300 text-sm font-medium mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500" size={18} />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="请输入邮箱"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-cream-300 text-sm font-medium mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500" size={18} />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100 placeholder-cream-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-500 hover:text-cream-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-warm text-night-900 rounded-xl font-medium text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-night-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? '登录' : '注册'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cream-500 text-sm">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-400 hover:text-amber-300 ml-1 transition-colors"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/10" />
              <span className="px-4 text-cream-500 text-sm">或</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-cream-400 hover:bg-white/20 hover:text-cream-200 transition-colors">
                <span className="text-xl">📱</span>
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-cream-400 hover:bg-white/20 hover:text-cream-200 transition-colors">
                <span className="text-xl">📧</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-cream-600 text-xs mt-6 tracking-wider">
          Memory Lane · 深 海
        </p>
      </div>
    </div>
  );
}

export default Login;
