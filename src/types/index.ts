export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          name?: string | null;
          avatar_url?: string;
          created_at?: string;
        };
      };
      memories: {
        Row: Memory;
        Insert: Omit<Memory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Memory, 'id' | 'user_id' | 'created_at'>>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'likes' | 'comments' | 'is_liked' | 'created_at'>;
        Update: Partial<Post>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'likes' | 'is_liked' | 'created_at'>;
        Update: Partial<Comment>;
      };
      stories: {
        Row: Story;
        Insert: Omit<Story, 'id' | 'created_at'>;
        Update: Partial<Story>;
      };
    };
  };
}

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  emotion: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface Story {
  id: string;
  user_id: string;
  title: string;
  cover_url: string;
  summary: string;
  created_at: string;
  is_public: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at: string;
}

export interface MemoryFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  emotion: string;
  photo_url: string;
  is_public: boolean;
}

export type EmotionType = 'happy' | 'sad' | 'excited' | 'peaceful' | 'nostalgic' | 'proud' | 'loved' | 'grateful';

export interface EmotionOption {
  value: EmotionType;
  label: string;
  emoji: string;
  color: string;
}

export const EMOTIONS: EmotionOption[] = [
  { value: 'happy', label: '开心', emoji: '😊', color: '#FCD34D' },
  { value: 'sad', label: '难过', emoji: '😢', color: '#93C5FD' },
  { value: 'excited', label: '兴奋', emoji: '🎉', color: '#F87171' },
  { value: 'peaceful', label: '平静', emoji: '😌', color: '#A7F3D0' },
  { value: 'nostalgic', label: '怀念', emoji: '🍂', color: '#D4A373' },
  { value: 'proud', label: '自豪', emoji: '🌟', color: '#C4B5FD' },
  { value: 'loved', label: '被爱', emoji: '❤️', color: '#FCA5A5' },
  { value: 'grateful', label: '感恩', emoji: '🙏', color: '#FDBA74' },
];

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  is_liked: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  likes: number;
  is_liked: boolean;
  created_at: string;
}

export type PostTag = '心情' | '感悟' | '求助' | '分享' | '鼓励';

export const POST_TAGS: PostTag[] = ['心情', '感悟', '求助', '分享', '鼓励'];
