import Link from 'next/link';
import Image from 'next/image';
import { allPosts } from 'contentlayer/generated';
import { compareDesc, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, FileTextIcon } from 'lucide-react';

// 마크다운 본문에서 첫 번째 이미지 URL 추출
function extractFirstImage(markdown: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : null;
}

export default function Test2() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--menu-main)' }}>
          글 목록
        </h1>
        <p className="text-lg opacity-70">
          작성된 모든 글을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const firstImage = extractFirstImage(post.body.raw);

          return (
            <Link
              key={post._id}
              href={post.url}
              className="group"
            >
              <article
                className="h-full rounded-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col overflow-hidden"
                style={{
                  backgroundColor: 'rgba(130, 102, 68, 0.03)',
                  borderColor: 'var(--menu-main)',
                }}
              >
                {/* 썸네일 이미지 */}
                {firstImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={firstImage}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* 콘텐츠 영역 */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* 작성일 */}
                  <div className="flex items-center gap-2 text-sm opacity-60 mb-3">
                    <CalendarIcon size={14} />
                    <time dateTime={post.date}>
                      {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
                    </time>
                  </div>

                  {/* 제목 */}
                  <h2
                    className="text-xl font-bold mb-3 group-hover:opacity-70 transition-opacity line-clamp-2"
                    style={{ color: 'var(--menu-main)' }}
                  >
                    {post.title}
                  </h2>

                  {/* 요약문 (summary가 있으면 summary, 없으면 description) */}
                  <p className="opacity-70 mb-4 line-clamp-3 text-sm flex-grow">
                    {post.summary || post.description || '요약문이 없습니다.'}
                  </p>

                  {/* 태그 */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-3 border-t" style={{ borderColor: 'rgba(130, 102, 68, 0.2)' }}>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs rounded-full font-medium"
                          style={{
                            backgroundColor: 'var(--menu-sub)',
                            color: 'var(--menu-sub-text)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2.5 py-1 text-xs opacity-50">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {/* 글이 없을 때 */}
      {posts.length === 0 && (
        <div className="text-center py-20">
          <FileTextIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg opacity-60">작성된 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}