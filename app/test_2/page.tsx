'use client';

import Link from 'next/link';
import Image from 'next/image';
import { allPosts } from 'contentlayer/generated';
import { compareDesc, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, FileTextIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// 마크다운 본문에서 첫 번째 이미지 URL 추출
function extractFirstImage(markdown: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : null;
}

const POSTS_PER_PAGE = 6;

export default function Test2() {
  const [currentPage, setCurrentPage] = useState(1);

  const allPostsSorted = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(allPostsSorted.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPostsSorted.slice(startIndex, endIndex);

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
      {allPostsSorted.length === 0 && (
        <div className="text-center py-20">
          <FileTextIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg opacity-60">작성된 글이 없습니다.</p>
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
              // 현재 페이지 주변만 표시 (모바일 대응)
              if (
                page === 1 || // 첫 페이지
                page === totalPages || // 마지막 페이지
                (page >= currentPage - 1 && page <= currentPage + 1) // 현재 페이지 주변
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
      {allPostsSorted.length > 0 && (
        <p className="text-center text-sm opacity-60 mt-4">
          전체 {allPostsSorted.length}개의 글 중 {startIndex + 1}-{Math.min(endIndex, allPostsSorted.length)}번째 글
        </p>
      )}
    </div>
  );
}