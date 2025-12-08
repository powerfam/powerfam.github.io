'use client';

import { useState, useEffect } from 'react';
import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';
import Image from 'next/image';
import { compareDesc, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, FileTextIcon, ChevronLeft, ChevronRight } from 'lucide-react';

type Section = 'section1' | 'section2' | 'section3';

interface SectionInfo {
  id: Section;
  title: string;
  description: string;
}

const sections: SectionInfo[] = [
  { id: 'section1', title: 'Section 1', description: 'section1 소개글입니다' },
  { id: 'section2', title: 'Section 2', description: 'section2 소개글입니다' },
  { id: 'section3', title: 'Section 3', description: 'section3 소개글입니다' },
];

// 마크다운 본문에서 첫 번째 이미지 URL 추출
function extractFirstImage(markdown: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : null;
}

const POSTS_PER_PAGE = 6;

export default function ArticlesPage() {
  const [activeSection, setActiveSection] = useState<Section>('section1');
  const [currentPage, setCurrentPage] = useState(1);

  // 섹션별로 글 필터링
  const filteredPosts = allPosts
    .filter(post => (post.section || 'section1') === activeSection)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // 섹션 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection]);

  const currentSectionInfo = sections.find(s => s.id === activeSection);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--menu-main)' }}>
          Articles
        </h1>
      </div>

      {/* 섹션 탭 */}
      <div className="flex gap-4 border-b-2 pb-2" style={{ borderColor: 'var(--menu-main)' }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-6 py-2 rounded-t-lg font-medium transition-all duration-300 ${
              activeSection === section.id
                ? 'shadow-md transform -translate-y-1'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeSection === section.id ? 'var(--menu-main)' : 'transparent',
              color: activeSection === section.id ? 'var(--menu-main-text)' : 'var(--foreground)',
            }}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* 섹션 설명 */}
      <div className="py-4">
        <p className="text-lg opacity-70">
          {currentSectionInfo?.description}
        </p>
      </div>

      {/* 글 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.map((post, index) => {
          const firstImage = extractFirstImage(post.body.raw);

          return (
            <Link
              key={post._id}
              href={post.url}
              className="group animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
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

                  {/* 요약문 */}
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
      {paginatedPosts.length === 0 && (
        <div className="text-center py-20">
          <FileTextIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg opacity-60">이 섹션에는 아직 글이 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {/* 이전 페이지 */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                      currentPage === page
                        ? 'text-white shadow-md'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ borderColor: 'var(--menu-main)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* 페이지 정보 */}
      {filteredPosts.length > 0 && (
        <p className="text-center text-sm opacity-60 mt-4">
          전체 {filteredPosts.length}개의 글 중 {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)}번째 글
        </p>
      )}
    </div>
  );
}
