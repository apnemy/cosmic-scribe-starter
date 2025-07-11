import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PostWithLikes } from '@/types/blog';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Posts() {
  const [posts, setPosts] = useState<PostWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            email
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch likes for each post
      const postsWithLikes = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: likes, error: likesError } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', post.id);

          if (likesError) throw likesError;

          const userHasLiked = user ? likes?.some(like => like.user_id === user.id) || false : false;

          return {
            ...post,
            likes: likes || [],
            like_count: likes?.length || 0,
            user_has_liked: userHasLiked,
          };
        })
      );

      setPosts(postsWithLikes as PostWithLikes[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error fetching posts',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like posts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (currentlyLiked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });
      }

      // Refresh posts
      fetchPosts();
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Latest Posts</h1>
        <p className="text-xl text-muted-foreground">
          Discover our latest blog posts and insights
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
          <p className="text-muted-foreground">Check back later for new content!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {post.cover_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <CardTitle className="line-clamp-2">
                  <Link
                    to={`/post/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                
                <CardDescription className="line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.profiles?.full_name || post.profiles?.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.read_time || 5} min read</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id, post.user_has_liked)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}