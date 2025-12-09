import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { HeartIcon, Share2Icon, ClockIcon } from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import dynamic from 'next/dynamic';
import CopyUrlButton from '@/components/CopyUrlButton';
import TableOfContents from '@/components/TableOfContents';
import FontSizeControl from '@/components/FontSizeControl';

// 동적 임포트로 번들 크기 최적화
const FirebaseComments = dynamic(() => import('@/components/FirebaseComments'), {
  loading: () => <div className="text-center py-8 opacity-60">댓글 로딩 중...</div>,
  ssr: false,
});

// 읽기 시간 계산 함수 (평균 250 단어/분 기준)
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 250;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// ISR: 60초마다 재검증
export const revalidate = 60;

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const post = allPosts.find((post) => post._raw.flattenedPath === decodedSlug);

  if (!post) notFound();

  const readingTime = calculateReadingTime(post.body.raw);

  return (
    <>
      {/* 폰트 사이즈 조절 컨트롤 */}
      <FontSizeControl />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--menu-main)' }}>
        <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: 'var(--menu-main)' }}>
          {post.title}
        </h1>

        {/* 작성날짜 및 읽기 시간 */}
        <div className="mb-3 flex items-center gap-4 text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
          <time dateTime={post.date}>
            {format(new Date(post.date), 'yyyy년 MM월 dd일')}
          </time>
          <div className="flex items-center gap-1">
            <ClockIcon size={14} />
            <span>읽는 시간 : {readingTime}분</span>
          </div>
        </div>

        {/* 태그 및 URL 복사 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {post.tags && post.tags.length > 0 ? (
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
          ) : (
            <div />
          )}
          <CopyUrlButton />
        </div>
      </div>

      {/* 목차 (TOC) */}
      <TableOfContents />

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
            댓글
          </h3>
          <FirebaseComments postSlug={post._raw.flattenedPath} />
        </div>
      )}
      </div>
    </>
  );
}