-- Insert demo blog posts
INSERT INTO public.posts (
  title,
  slug,
  content,
  excerpt,
  author_id,
  cover_image_url,
  tags,
  status,
  read_time,
  published_at
) VALUES 
(
  'Getting Started with React and TypeScript',
  'getting-started-react-typescript',
  '# Getting Started with React and TypeScript

React and TypeScript make a powerful combination for building modern web applications. In this guide, we''ll explore how to set up a new project and start building type-safe components.

## Why TypeScript?

TypeScript adds static type checking to JavaScript, which helps catch errors early in development and provides better IDE support with features like:

- **IntelliSense**: Auto-completion and code suggestions
- **Refactoring**: Safe renaming and code restructuring
- **Error Detection**: Catch type-related bugs before runtime

## Setting Up Your Project

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

## Creating Your First Component

```tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = "primary" 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

This approach ensures your components are predictable and maintainable as your application grows.',
  'Learn how to combine React with TypeScript for better development experience and type safety.',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
  ARRAY['React', 'TypeScript', 'Web Development', 'Tutorial'],
  'published',
  5,
  NOW() - INTERVAL '2 days'
),
(
  'The Future of Web Development: Trends to Watch',
  'future-web-development-trends',
  '# The Future of Web Development: Trends to Watch

The web development landscape is constantly evolving. Here are the key trends shaping the future of how we build and interact with web applications.

## 1. Edge Computing and CDNs

Edge computing brings computation closer to users, reducing latency and improving performance. Modern frameworks are embracing this with:

- **Edge Functions**: Serverless functions running at the edge
- **Static Site Generation**: Pre-built pages served from CDNs
- **Incremental Static Regeneration**: Combining static and dynamic content

## 2. Web Assembly (WASM)

WebAssembly allows running high-performance code in browsers, opening new possibilities for:

- Complex applications like video editors
- Gaming experiences
- Scientific computing
- Legacy code migration

## 3. AI-Powered Development

Artificial Intelligence is revolutionizing how we write code:

- **Code Generation**: Tools like GitHub Copilot
- **Automated Testing**: AI-generated test cases
- **Performance Optimization**: Intelligent bundling and caching

## 4. Progressive Web Apps (PWAs)

PWAs continue to bridge the gap between web and native apps:

- **Offline Functionality**: Service workers for caching
- **Push Notifications**: Engaging users like native apps
- **Installation**: Add to home screen capabilities

The future is bright for web development, with these technologies making applications faster, more capable, and more accessible than ever before.',
  'Explore the latest trends and technologies shaping the future of web development.',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  ARRAY['Web Development', 'Technology', 'Future', 'AI', 'Performance'],
  'published',
  7,
  NOW() - INTERVAL '5 days'
),
(
  'Building Responsive UIs with Modern CSS',
  'building-responsive-uis-modern-css',
  '# Building Responsive UIs with Modern CSS

Creating responsive user interfaces has never been easier with modern CSS features. Let''s explore the tools and techniques that make building adaptive layouts a breeze.

## CSS Grid: The Layout Revolution

CSS Grid provides a two-dimensional layout system that simplifies complex designs:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

## Flexbox for One-Dimensional Layouts

Perfect for navigation bars, button groups, and centering content:

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Container Queries: The Next Big Thing

Container queries allow components to adapt based on their container size:

```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

## Custom Properties for Dynamic Theming

CSS custom properties make theming and responsive design more maintainable:

```css
:root {
  --spacing-unit: clamp(1rem, 2.5vw, 2rem);
  --primary-color: hsl(220 90% 56%);
}
```

## Best Practices

1. **Mobile-first approach**: Start with mobile designs and enhance for larger screens
2. **Use relative units**: `rem`, `em`, `vw`, `vh` for scalable designs
3. **Test on real devices**: Emulators don''t always match real-world usage
4. **Consider accessibility**: Ensure your responsive design works for all users

Modern CSS gives us incredible power to create beautiful, responsive interfaces that work seamlessly across all devices.',
  'Master modern CSS techniques for creating responsive and adaptive user interfaces.',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
  ARRAY['CSS', 'Responsive Design', 'UI', 'Frontend'],
  'published',
  6,
  NOW() - INTERVAL '1 week'
),
(
  'Database Design Best Practices for Modern Applications',
  'database-design-best-practices',
  '# Database Design Best Practices for Modern Applications

Good database design is the foundation of any successful application. Here are essential principles and practices for designing efficient, scalable databases.

## Normalization vs. Denormalization

### When to Normalize
- **Reduce data redundancy**: Avoid storing the same data in multiple places
- **Maintain data integrity**: Updates only need to happen in one place
- **Save storage space**: Especially important for large datasets

### When to Denormalize
- **Improve read performance**: Fewer JOINs mean faster queries
- **Simplify queries**: Sometimes a little redundancy makes code cleaner
- **Handle high-traffic scenarios**: Pre-computed values can improve response times

## Indexing Strategies

```sql
-- Composite index for common query patterns
CREATE INDEX idx_posts_author_status 
ON posts (author_id, status, published_at);

-- Partial index for specific conditions
CREATE INDEX idx_active_users 
ON users (email) 
WHERE active = true;
```

## Data Types Matter

Choose appropriate data types to optimize storage and performance:

```sql
-- Use specific numeric types
user_id BIGINT NOT NULL,
price DECIMAL(10, 2) NOT NULL,
is_active BOOLEAN DEFAULT true,

-- Use constraints for data validation
email VARCHAR(255) NOT NULL UNIQUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## Security Considerations

1. **Row Level Security (RLS)**: Control access at the database level
2. **Prepared statements**: Prevent SQL injection
3. **Principle of least privilege**: Give minimum necessary permissions
4. **Audit trails**: Track important data changes

## Scalability Planning

- **Partition large tables**: Split data across multiple physical tables
- **Consider read replicas**: Distribute read load across multiple servers
- **Plan for caching**: Design queries that work well with caching layers
- **Monitor query performance**: Use EXPLAIN to understand query execution

Remember: good database design is about finding the right balance between normalization, performance, and maintainability for your specific use case.',
  'Learn essential database design principles for building scalable and efficient applications.',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
  ARRAY['Database', 'SQL', 'Backend', 'Architecture'],
  'published',
  8,
  NOW() - INTERVAL '10 days'
),
(
  'Introduction to Supabase: The Firebase Alternative',
  'introduction-supabase-firebase-alternative',
  '# Introduction to Supabase: The Firebase Alternative

Supabase is quickly becoming the go-to backend-as-a-service for developers who want the power of PostgreSQL with the simplicity of Firebase. Let''s explore what makes Supabase special.

## What is Supabase?

Supabase provides:
- **PostgreSQL database**: Full SQL capabilities with ACID compliance
- **Real-time subscriptions**: Live updates across clients
- **Authentication**: Built-in user management and social logins
- **Storage**: File uploads with CDN distribution
- **Edge Functions**: Serverless functions at the edge

## Getting Started

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "your-project-url",
  "your-anon-key"
);
```

## Database Operations

Supabase''s auto-generated API makes database operations simple:

```typescript
// Insert data
const { data, error } = await supabase
  .from("posts")
  .insert({ title: "Hello World", content: "..." });

// Query with filters
const { data } = await supabase
  .from("posts")
  .select("*")
  .eq("published", true)
  .order("created_at", { ascending: false });
```

## Real-time Features

Subscribe to database changes in real-time:

```typescript
const channel = supabase
  .channel("posts")
  .on("postgres_changes", 
    { event: "INSERT", schema: "public", table: "posts" },
    (payload) => console.log("New post!", payload)
  )
  .subscribe();
```

## Row Level Security

Supabase leverages PostgreSQL''s RLS for fine-grained access control:

```sql
-- Users can only see their own posts
CREATE POLICY "Users can view own posts" ON posts
FOR SELECT USING (auth.uid() = author_id);
```

## Why Choose Supabase?

1. **Open source**: Full transparency and community-driven
2. **SQL power**: Complex queries, joins, and data integrity
3. **Real-time**: Built-in subscriptions without additional setup
4. **Type safety**: Auto-generated TypeScript types
5. **Self-hostable**: Deploy on your own infrastructure if needed

Supabase combines the best of both worlds: the simplicity of modern BaaS with the power and flexibility of PostgreSQL.',
  'Discover Supabase, the open-source Firebase alternative built on PostgreSQL.',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  ARRAY['Supabase', 'Database', 'Backend', 'PostgreSQL'],
  'published',
  6,
  NOW() - INTERVAL '3 days'
);