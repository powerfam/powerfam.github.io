import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

export default function Test2() {
  const posts = allPosts.sort((a, b) => 
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">글 목록</h1>
        <p className="text-lg opacity-80">
          작성된 모든 글을 확인할 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article 
            key={post._id}
            className="p-6 rounded-lg border transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'rgba(130, 102, 68, 0.05)',
              borderColor: 'var(--menu-main)'
            }}
          >
            <Link href={post.url}>
              <h2 
                className="text-2xl font-bold mb-2 hover:opacity-70 transition-opacity" 
                style={{ color: 'var(--menu-main)' }}
              >
                {post.title}
              </h2>
              <p className="text-sm opacity-60 mb-3">
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="opacity-80 mb-4">
                {post.description}
              </p>
              {post.tags && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full transition-colors"
                      style={{
                        backgroundColor: 'var(--menu-sub)',
                        color: 'var(--menu-sub-text)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}