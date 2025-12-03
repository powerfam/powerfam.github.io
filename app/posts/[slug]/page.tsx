import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) notFound();

  return (
    <article>
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ color: 'var(--menu-main)' }}
        >
          {post.title}
        </h1>
        <p className="text-sm opacity-60">
          {new Date(post.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      <div 
        className="prose prose-slate dark:prose-invert max-w-none"
        style={{ color: 'var(--foreground)' }}
        dangerouslySetInnerHTML={{ __html: post.body.html }} 
      />
    </article>
  );
}