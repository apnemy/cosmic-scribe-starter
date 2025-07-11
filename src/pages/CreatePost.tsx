import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MDEditor from '@uiw/react-md-editor';
import { Upload, X, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import readingTime from 'reading-time';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { isAdmin, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const uploadCoverImage = async () => {
    if (!coverImage || !user) return;

    setUploadingImage(true);
    try {
      const fileExt = coverImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cover-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, coverImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setCoverImageUrl(publicUrl);
      toast({
        title: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error uploading image',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const savePost = async (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim() || !user) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in title and content.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Upload cover image if needed
      if (coverImage && !coverImageUrl) {
        await uploadCoverImage();
      }

      const slug = generateSlug(title);
      const stats = readingTime(content);
      
      const postData = {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        cover_image_url: coverImageUrl || null,
        tags,
        status,
        author_id: user.id,
        read_time: Math.ceil(stats.minutes),
        ...(status === 'published' && { published_at: new Date().toISOString() }),
      };

      const { error } = await supabase
        .from('posts')
        .insert(postData);

      if (error) throw error;

      toast({
        title: `Post ${status === 'published' ? 'published' : 'saved as draft'}`,
        description: `Your post has been ${status === 'published' ? 'published' : 'saved'} successfully.`,
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error saving post',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-muted-foreground">Write and publish your blog post</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of your post"
                className="mt-1"
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a tag and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cover Image */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Image</CardTitle>
            <CardDescription>Upload a cover image for your post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCoverImage(file);
                      setCoverImageUrl('');
                    }
                  }}
                />
              </div>

              {coverImage && !coverImageUrl && (
                <Button
                  onClick={uploadCoverImage}
                  disabled={uploadingImage}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
              )}

              {coverImageUrl && (
                <div className="space-y-2">
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCoverImageUrl('');
                      setCoverImage(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <CardDescription>Write your post content in Markdown</CardDescription>
          </CardHeader>
          <CardContent>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              data-color-mode="light"
              height={400}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            variant="outline"
            onClick={() => savePost('draft')}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            onClick={() => savePost('published')}
            disabled={loading}
          >
            <Eye className="mr-2 h-4 w-4" />
            Publish Post
          </Button>
        </div>
      </div>
    </div>
  );
}