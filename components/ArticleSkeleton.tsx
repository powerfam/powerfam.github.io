import { Skeleton } from './ui/skeleton';

export function FeaturedPostSkeleton() {
  return (
    <div className="rounded-xl border-2 overflow-hidden mb-8" style={{ borderColor: 'var(--menu-main)' }}>
      <div className="flex flex-col md:flex-row">
        {/* 이미지 스켈레톤 */}
        <div className="relative w-full md:w-1/2 h-64 md:h-80">
          <Skeleton className="w-full h-full" />
        </div>

        {/* 콘텐츠 스켈레톤 */}
        <div className="p-8 flex flex-col justify-center md:w-1/2 space-y-4">
          {/* 날짜 */}
          <Skeleton className="h-4 w-32" />

          {/* 제목 */}
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />

          {/* 요약 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* 태그 */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridPostSkeleton() {
  return (
    <div className="h-full rounded-xl border-2 overflow-hidden" style={{ borderColor: 'var(--menu-main)' }}>
      {/* 이미지 스켈레톤 */}
      <Skeleton className="w-full h-48" />

      {/* 콘텐츠 스켈레톤 */}
      <div className="p-6 space-y-3">
        {/* 날짜 */}
        <Skeleton className="h-3 w-24" />

        {/* 제목 */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* 요약 */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* 태그 */}
        <div className="flex gap-2 pt-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ArticlesPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Featured Post */}
      <FeaturedPostSkeleton />

      {/* Grid Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GridPostSkeleton />
        <GridPostSkeleton />
        <GridPostSkeleton />
      </div>
    </div>
  );
}
