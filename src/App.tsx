import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useMemoryStore } from './store/memoryStore';
import { useCommunityStore } from './store/communityStore';
import { useStoryStore } from './store/storyStore';

const Home = lazy(() => import('./pages/Home'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Game = lazy(() => import('./pages/Game'));
const Gallery = lazy(() => import('./pages/Gallery'));
const StoryDetail = lazy(() => import('./pages/StoryDetail'));
const Record = lazy(() => import('./pages/Record'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Community = lazy(() => import('./pages/Community'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { initSession, isInitialized } = useAuthStore();
  const { loadMemories } = useMemoryStore();
  const { loadPosts } = useCommunityStore();
  const { loadStories } = useStoryStore();

  useEffect(() => {
    initSession();
    loadMemories();
    loadPosts();
    loadStories();
  }, [initSession, loadMemories, loadPosts, loadStories]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-900">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/game" element={<Game />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:storyId" element={<StoryDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:postId" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/record" element={<Record />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
