'use client';

import { useState, useEffect } from 'react';
import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';
import Image from 'next/image';
import { compareDesc, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, FileTextIcon, ChevronLeft, ChevronRight, TagIcon } from 'lucide-react';
import TextType from '@/components/TextType';
import { ArticlesPageSkeleton } from '@/components/ArticleSkeleton';

type Section = 'section1' | 'section2' | 'section3';

interface SectionInfo {
  id: Section;
  title: string;
  description: string;
}

const sections: SectionInfo[] = [
  { id: 'section1', title: 'Life', description: '딸에게 전해주고 싶은 일상 속 배움' },
  { id: 'section2', title: 'Book', description: '책에서 얻은 소중한 지혜' },
  { id: 'section3', title: 'Wealth', description: '부에 대한 아빠의 솔직한 생각' },
];

// 마크다운 본문에서 첫 번째 이미지 URL 추출
function extractFirstImage(markdown: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : null;
}

const POSTS_PER_PAGE = 4; // 1개(featured) + 3개(grid) = 4개씩

export default function ArticlesPage() {
  const [activeSection, setActiveSection] = useState<Section>('section1');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 섹션별로 글 필터링
  const filteredPosts = allPosts
    .filter(post => (post.section || 'section1') === activeSection)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // 첫 번째 글 (Featured) 과 나머지 글 분리
  const featuredPost = paginatedPosts[0];
  const gridPosts = paginatedPosts.slice(1);

  // 초기 로딩 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 섹션 변경 시 페이지를 1로 리셋 및 트랜지션
  useEffect(() => {
    setCurrentPage(1);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [activeSection]);

  // 페이지 변경 시 트랜지션 효과
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 300);
  };

  const currentSectionInfo = sections.find(s => s.id === activeSection);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--menu-main)' }}>
          Articles
        </h1>
      </div>

      {/* 섹션 탭 */}
      <div className="flex flex-wrap gap-2 sm:gap-3 pb-2 items-center justify-between">
        {/* 섹션 메뉴 - 다크모드 토글 스타일 적용 */}
        <div className="flex items-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeSection === section.id ? 'shadow-md' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: activeSection === section.id ? 'var(--menu-sub)' : 'var(--menu-main)',
                color: activeSection === section.id ? 'var(--menu-sub-text)' : 'var(--menu-main-text)',
              }}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Tags 페이지 링크 - Section 메뉴와 동일한 높이 */}
        <Link
          href="/articles/tags"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:opacity-80 shadow-md"
          style={{
            backgroundColor: 'var(--menu-sub)',
            color: 'var(--menu-sub-text)',
          }}
        >
          <TagIcon size={14} className="sm:w-4 sm:h-4" />
          <span>Tags</span>
        </Link>
      </div>

      {/* 섹션 설명 */}
      <div className="py-4">
        <p className="text-lg opacity-70">
          {currentSectionInfo?.description}
        </p>
      </div>

      {/* 스켈레톤 로딩 또는 글 목록 */}
      {isInitialLoading || isTransitioning ? (
        <ArticlesPageSkeleton />
      ) : (
        <div
          className={`transition-all duration-300 opacity-100 translate-y-0`}
        >
        {/* Featured Post - 최신 글 (전체 너비) */}
        {featuredPost && (
          <Link
            href={featuredPost.url}
            className="group block mb-8 animate-fade-in-up"
            style={{
              animationDelay: '0ms',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          >
            <article
              className="rounded-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
              style={{
                backgroundColor: 'rgba(130, 102, 68, 0.03)',
                borderColor: 'var(--menu-main)',
              }}
            >
              <div className="flex flex-col md:flex-row">
                {/* 썸네일 이미지 - Featured 크기 */}
                {extractFirstImage(featuredPost.body.raw) && (
                  <div className="relative w-full md:w-1/2 h-64 md:h-80 overflow-hidden">
                    <Image
                      src={extractFirstImage(featuredPost.body.raw)!}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Featured 라벨 - 1페이지에서만 표시 */}
                    {currentPage === 1 && (
                      <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: 'var(--menu-main)',
                          color: 'var(--menu-main-text)'
                        }}
                      >
                        Latest
                      </div>
                    )}
                  </div>
                )}

                {/* 콘텐츠 영역 */}
                <div className="p-8 flex flex-col justify-center md:w-1/2">
                  {/* 작성일 */}
                  <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
                    <CalendarIcon size={14} />
                    <time dateTime={featuredPost.date}>
                      {format(new Date(featuredPost.date), 'yyyy년 M월 d일', { locale: ko })}
                    </time>
                  </div>

                  {/* 제목 */}
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-4 group-hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--menu-main)' }}
                  >
                    {featuredPost.title}
                  </h2>

                  {/* 요약문 - 타이핑 효과 */}
                  <div className="opacity-70 mb-6 text-base min-h-[4.5rem]">
                    <TextType
                      text={featuredPost.summary || featuredPost.description || '요약문이 없습니다.'}
                      typingSpeed={30}
                      loop={false}
                      showCursor={false}
                      className="line-clamp-3"
                    />
                  </div>

                  {/* 태그 - 마키 애니메이션 */}
                  {featuredPost.tags && featuredPost.tags.length > 0 && (
                    <div className="overflow-hidden relative">
                      <div className="flex gap-2 animate-marquee hover:pause-marquee">
                        {/* 첫 번째 세트 */}
                        {featuredPost.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={`first-${tag}-${index}`}
                            className="px-3 py-1.5 text-sm rounded-full font-medium whitespace-nowrap flex-shrink-0"
                            style={{
                              backgroundColor: 'var(--menu-sub)',
                              color: 'var(--menu-sub-text)'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {/* 두 번째 세트 (무한 스크롤을 위한 복제) */}
                        {featuredPost.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={`second-${tag}-${index}`}
                            className="px-3 py-1.5 text-sm rounded-full font-medium whitespace-nowrap flex-shrink-0"
                            style={{
                              backgroundColor: 'var(--menu-sub)',
                              color: 'var(--menu-sub-text)'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Grid Posts - 나머지 글 (3열 그리드) */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post, index) => {
              const firstImage = extractFirstImage(post.body.raw);

              return (
                <Link
                  key={post._id}
                  href={post.url}
                  className="group animate-fade-in-up"
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
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
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

                      {/* 요약문 */}
                      <p className="opacity-70 line-clamp-3 text-sm flex-grow">
                        {post.summary || post.description || '요약문이 없습니다.'}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* 글이 없을 때 */}
        {paginatedPosts.length === 0 && (
          <div className="text-center py-20">
            <FileTextIcon size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-60">이 섹션에는 아직 글이 없습니다.</p>
          </div>
        )}
      </div>
      )}

      {/* 페이지네이션 */}
      {!isInitialLoading && !isTransitioning && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {/* 이전 페이지 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            style={{ borderColor: 'var(--menu-main)' }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* 페이지 번호 */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // 현재 페이지 주변만 표시
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-all duration-300 ${
                      currentPage === page
                        ? 'text-white shadow-md scale-110'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                    }`}
                    style={
                      currentPage === page
                        ? { backgroundColor: 'var(--menu-main)', borderColor: 'var(--menu-main)' }
                        : { borderColor: 'var(--menu-main)' }
                    }
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return <span key={page} className="px-2 opacity-50">...</span>;
              }
              return null;
            })}
          </div>

          {/* 다음 페이지 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            style={{ borderColor: 'var(--menu-main)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

    </div>
  );
}
