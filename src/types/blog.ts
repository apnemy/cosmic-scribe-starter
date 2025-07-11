export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  status: 'draft' | 'published';
  author_id: string;
  read_time: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  profiles?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface PostWithLikes extends Post {
  likes: Like[];
  like_count: number;
  user_has_liked: boolean;
}