import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { HeartIcon, Share2Icon } from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import FirebaseComments from '@/components/FirebaseComments';

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const post = allPosts.find((post) => post._raw.flattenedPath === decodedSlug);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--menu-main)' }}>
        <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: 'var(--menu-main)' }}>
          {post.title}
        </h1>

        {/* 작성날짜 */}
        <div className="mb-3 text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
          <time dateTime={post.date}>
            {format(new Date(post.date), 'yyyy년 MM월 dd일')}
          </time>
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--menu-sub)',
                  color: 'var(--menu-sub-text)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 본문 */}
      <article
        className="prose md:prose-lg max-w-none mb-12 dark:prose-invert"
        style={{ color: 'var(--foreground)' }}
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />

      {/* 좋아요/공유 토글 버튼 */}
      <div className="pt-8 border-t" style={{ borderColor: 'var(--menu-main)' }}>
        <div className="flex justify-center">
          <ToggleGroup type="multiple" variant="outline" className="gap-2">
            {/* 좋아요 버튼 */}
            <ToggleGroupItem
              value="heart"
              aria-label="좋아요"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 px-6 py-3 text-base"
            >
              <HeartIcon className="mr-2 h-5 w-5" />
              <span>좋아요</span>
            </ToggleGroupItem>

            {/* 공유 버튼 */}
            <ToggleGroupItem
              value="share"
              aria-label="공유하기"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 px-6 py-3 text-base"
            >
              <Share2Icon className="mr-2 h-5 w-5" />
              <span>공유</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* 좋아요 개수 표시 */}
        <div className="mt-4 text-center text-sm opacity-60">
          <p>좋아요 0개</p>
        </div>
      </div>

      {/* 댓글 섹션 - Firebase */}
      {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && (
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--menu-main)' }}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--menu-main)' }}>
            💬 댓글
          </h3>
          <FirebaseComments postSlug={post._raw.flattenedPath} />
        </div>
      )}
    </div>
  );
}