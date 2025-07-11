import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Heart, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to BlogApp
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Discover amazing stories, insights, and ideas from our community of writers
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link to="/posts">
                Explore Posts
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/auth">
                Join the Community
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose BlogApp?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <PenTool className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Rich Writing Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Write beautiful posts with our Markdown editor featuring live preview and syntax highlighting.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Engage with Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Like and discover posts from other writers. Build connections through shared interests.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Growing Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join a community of passionate writers and readers sharing knowledge and stories.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of writers and readers in our growing community
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">
              Get Started Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
