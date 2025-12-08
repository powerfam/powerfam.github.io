'use client';

import { useState, useEffect } from 'react';
import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TagIcon, XIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface TagCount {
  tag: string;
  count: number;
  size: number;
}

// 태그 이름으로부터 일관된 색상 생성 (톤앤매너 유지)
function getTagColor(tag: string, isDark: boolean = false) {
  // 간단한 해시 함수
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 브랜드 컬러 기반 색상 팔레트
  const lightColors = [
    { bg: '#826644', text: '#FAF9F5' }, // 메인 브라운
    { bg: '#D99058', text: '#3B3C36' }, // 메인 오렌지
    { bg: '#A67C52', text: '#FAF9F5' }, // 중간 브라운
    { bg: '#C17D4A', text: '#FAF9F5' }, // 진한 오렌지
    { bg: '#8B7355', text: '#FAF9F5' }, // 밝은 브라운
    { bg: '#B8956A', text: '#3B3C36' }, // 베이지 브라운
    { bg: '#CD8B5C', text: '#3B3C36' }, // 밝은 오렌지
  ];

  const darkColors = [
    { bg: '#D99058', text: '#FAF9F5' }, // 메인 오렌지
    { bg: '#826644', text: '#FAF9F5' }, // 메인 브라운
    { bg: '#E5A470', text: '#3B3C36' }, // 밝은 오렌지
    { bg: '#A67C52', text: '#FAF9F5' }, // 중간 브라운
    { bg: '#F0B888', text: '#3B3C36' }, // 연한 오렌지
    { bg: '#B8956A', text: '#FAF9F5' }, // 베이지 브라운
    { bg: '#CD8B5C', text: '#FAF9F5' }, // 밝은 오렌지
  ];

  const colors = isDark ? darkColors : lightColors;
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState(1);

  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // MutationObserver로 다크모드 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // 모든 포스트에서 태그 수집 및 카운팅
    const tagMap = new Map<string, number>();

    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });

    // 태그를 배열로 변환하고 크기 계산
    const tags = Array.from(tagMap.entries()).map(([tag, count]) => {
      // 모바일: 40px ~ 100px, 데스크톱: 60px ~ 160px
      const minSize = isMobile ? 40 : 60;
      const maxSize = isMobile ? 100 : 160;
      const maxCount = Math.max(...Array.from(tagMap.values()));
      const size = minSize + ((count / maxCount) * (maxSize - minSize));

      return { tag, count, size };
    });

    // 크기 순으로 정렬 (큰 것부터)
    tags.sort((a, b) => b.size - a.size);

    setTagCounts(tags);
  }, [isMobile]);

  // 선택된 태그의 글 필터링
  const filteredPosts = selectedTag
    ? allPosts.filter(post => post.tags?.includes(selectedTag))
    : [];

  // 버블 위치 생성 (간격 넓게 배치, 모바일 대응)
  const generateBubblePosition = (index: number, isMobile: boolean = false) => {
    const angle = (index * 137.5) % 360; // 황금각으로 분산
    // 모바일에서는 간격을 좁히고, 데스크톱에서는 넓게
    const radius = Math.sqrt(index + 1) * (isMobile ? 35 : 60);
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;

    return { x, y };
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--menu-main)' }}>
          Tag Cloud
        </h1>
        <p className="text-lg opacity-70">
          {selectedTag
            ? `"${selectedTag}" 태그가 포함된 글 ${filteredPosts.length}개`
            : `총 ${tagCounts.length}개의 태그`}
        </p>
      </div>

      {/* Tag Bubble Cloud */}
      {!selectedTag && (
        <div className="relative min-h-[500px] md:min-h-[800px] flex items-center justify-center mb-12 overflow-hidden">
          {/* Zoom 컨트롤 - 우측 하단 고정 */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 px-4 py-3 rounded-full shadow-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(130, 102, 68, 0.9)' }}>
            <ZoomOut size={18} style={{ color: 'var(--menu-main-text)' }} />
            <Slider
              value={[zoom * 50]}
              onValueChange={(value) => setZoom(value[0] / 50)}
              min={25}
              max={100}
              step={5}
              className="w-24 md:w-32"
            />
            <ZoomIn size={18} style={{ color: 'var(--menu-main-text)' }} />
          </div>

          <div
            className="relative w-full h-[500px] md:h-[800px] transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            {tagCounts.map((item, index) => {
              const pos = generateBubblePosition(index, isMobile);
              const tagColor = getTagColor(item.tag, isDarkMode);

              return (
                <motion.button
                  key={item.tag}
                  onClick={() => setSelectedTag(item.tag)}
                  className="absolute rounded-full flex items-center justify-center font-bold cursor-pointer shadow-lg overflow-hidden"
                  style={{
                    width: item.size,
                    height: item.size,
                    left: '50%',
                    top: '50%',
                    backgroundColor: tagColor.bg,
                    color: tagColor.text,
                  }}
                  initial={{
                    x: pos.x - item.size / 2,
                    y: pos.y - item.size / 2,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: pos.x - item.size / 2,
                    y: pos.y - item.size / 2,
                    scale: 1,
                    opacity: 1,
                  }}
                  whileHover={{
                    scale: isMobile ? 1.1 : 1.15,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    zIndex: 10,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.02,
                    duration: 0.6,
                  }}
                >
                  <div className="text-center px-2 py-1 flex items-center justify-center w-full h-full">
                    <div
                      className="font-bold break-words overflow-hidden text-ellipsis"
                      style={{
                        fontSize: `${Math.max(isMobile ? 10 : 13, item.size / 6)}px`,
                        lineHeight: '1.2',
                        wordBreak: 'keep-all',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        maxWidth: '90%',
                      }}
                    >
                      {item.tag}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* 선택된 태그 정보 및 닫기 버튼 */}
      <AnimatePresence>
        {selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ borderColor: 'var(--menu-main)' }}>
              <div className="flex items-center gap-3">
                <motion.div
                  className="px-4 py-2 rounded-full font-bold"
                  style={{
                    backgroundColor: 'var(--menu-main)',
                    color: 'var(--menu-main-text)',
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  #{selectedTag}
                </motion.div>
                <TagIcon size={20} />
              </div>
              <button
                onClick={() => setSelectedTag(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                style={{ borderColor: 'var(--menu-main)' }}
              >
                <XIcon size={18} />
                <span>닫기</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 선택된 태그의 글 목록 */}
      <AnimatePresence>
        {selectedTag && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={post.url} className="group block h-full">
                  <article
                    className="h-full rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      backgroundColor: 'rgba(130, 102, 68, 0.03)',
                      borderColor: 'var(--menu-main)',
                    }}
                  >
                    {/* 날짜 */}
                    <div className="text-sm opacity-60 mb-3">
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
                    <p className="opacity-70 mb-4 line-clamp-3 text-sm">
                      {post.summary || post.description || '요약문이 없습니다.'}
                    </p>

                    {/* 태그 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-3 border-t" style={{ borderColor: 'rgba(130, 102, 68, 0.2)' }}>
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                              tag === selectedTag ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              backgroundColor: tag === selectedTag ? 'var(--menu-main)' : 'var(--menu-sub)',
                              color: tag === selectedTag ? 'var(--menu-main-text)' : 'var(--menu-sub-text)',
                              ringColor: tag === selectedTag ? 'var(--menu-main)' : undefined,
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 글이 없을 때 */}
      {selectedTag && filteredPosts.length === 0 && (
        <div className="text-center py-20 opacity-60">
          <p>이 태그가 포함된 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
