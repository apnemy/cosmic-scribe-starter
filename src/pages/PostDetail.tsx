import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/integrations/supabase/client';
import { PostWithLikes } from '@/types/blog';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostWithLikes | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            email
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (postError) {
        if (postError.code === 'PGRST116') {
          setNotFound(true);
          return;
        }
        throw postError;
      }

      // Fetch likes for the post
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postData.id);

      if (likesError) throw likesError;

      const userHasLiked = user ? likes?.some(like => like.user_id === user.id) || false : false;

      setPost({
        ...postData,
        likes: likes || [],
        like_count: likes?.length || 0,
        user_has_liked: userHasLiked,
      } as PostWithLikes);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'Error fetching post',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !post) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like posts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (post.user_has_liked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            post_id: post.id,
            user_id: user.id,
          });
      }

      // Refresh post
      fetchPost();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (!post) {
    return <Navigate to="/posts" replace />;
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.profiles?.full_name || post.profiles?.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.read_time || 5} min read</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              post.user_has_liked ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                post.user_has_liked ? 'fill-current' : ''
              }`}
            />
            <span>{post.like_count}</span>
          </Button>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-muted-foreground leading-relaxed mb-8 p-4 border-l-4 border-primary bg-muted/20 rounded-r-lg">
            {post.excerpt}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none prose-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Last updated: {format(new Date(post.updated_at), 'MMMM d, yyyy')}
          </div>

          <Button
            variant="outline"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              post.user_has_liked ? 'text-red-500 border-red-500' : ''
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                post.user_has_liked ? 'fill-current' : ''
              }`}
            />
            {post.user_has_liked ? 'Liked' : 'Like'} ({post.like_count})
          </Button>
        </div>
      </footer>
    </article>
  );
}