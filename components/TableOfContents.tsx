'use client';

import { useEffect, useState } from 'react';
import { ListIcon, XIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTocEnabled, setIsTocEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // localStorage에서 목차 표시 설정 불러오기
  useEffect(() => {
    setMounted(true);
    const savedTocSetting = localStorage.getItem('showToc');
    if (savedTocSetting !== null) {
      setIsTocEnabled(savedTocSetting === 'true');
    }
  }, []);

  useEffect(() => {
    // 실제 DOM에서 article 내의 h2, h3, h4 찾기
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = article.querySelectorAll('h2, h3, h4');

    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));
      const id = `heading-${index}`;

      // 실제 DOM에 ID 추가
      heading.id = id;

      return { id, text, level };
    });

    setHeadings(extractedHeadings);

    // 스크롤 감지 및 active heading 업데이트
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = extractedHeadings.length - 1; i >= 0; i--) {
        const element = document.getElementById(extractedHeadings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(extractedHeadings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleToc = () => {
    const newValue = !isTocEnabled;
    setIsTocEnabled(newValue);
    localStorage.setItem('showToc', newValue.toString());
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted || headings.length === 0) return null;

  // 목차가 꺼져있으면 작은 토글 버튼만 표시
  if (!isTocEnabled) {
    return (
      <button
        onClick={toggleToc}
        className="fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: 'var(--menu-main)',
          color: 'var(--menu-main-text)',
        }}
        title="목차 표시"
      >
        <EyeIcon size={20} />
      </button>
    );
  }

  return (
    <>
      {/* 모바일: 토글 버튼 */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 hover:shadow-md"
          style={{
            borderColor: 'var(--menu-main)',
            backgroundColor: isOpen ? 'var(--menu-main)' : 'transparent',
            color: isOpen ? 'var(--menu-main-text)' : 'var(--menu-main)',
          }}
        >
          <ListIcon size={18} />
          <span className="font-medium">목차 {isOpen ? '닫기' : '열기'}</span>
        </button>

        {isOpen && (
          <nav className="mt-4 p-4 rounded-lg border-2" style={{ borderColor: 'var(--menu-main)' }}>
            <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: 'var(--menu-main)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--menu-main)' }}>목차</span>
              <button
                onClick={toggleToc}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="목차 숨기기"
              >
                <EyeOffIcon size={16} style={{ color: 'var(--menu-main)' }} />
              </button>
            </div>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{
                    marginLeft: `${(heading.level - 2) * 16}px`,
                  }}
                >
                  <button
                    onClick={() => {
                      scrollToHeading(heading.id);
                      setIsOpen(false);
                    }}
                    className={`text-left text-sm transition-all duration-200 hover:opacity-100 ${
                      activeId === heading.id ? 'font-bold opacity-100' : 'opacity-60'
                    }`}
                    style={{
                      color: activeId === heading.id ? 'var(--menu-main)' : 'var(--foreground)',
                    }}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* 데스크톱: 고정 사이드바 */}
      <nav className="hidden lg:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="p-4 rounded-lg border-2" style={{ borderColor: 'var(--menu-main)', backgroundColor: 'var(--background)' }}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: 'var(--menu-main)' }}>
            <div className="flex items-center gap-2">
              <ListIcon size={18} style={{ color: 'var(--menu-main)' }} />
              <h3 className="font-bold" style={{ color: 'var(--menu-main)' }}>목차</h3>
            </div>
            <button
              onClick={toggleToc}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="목차 숨기기"
            >
              <EyeOffIcon size={16} style={{ color: 'var(--menu-main)' }} />
            </button>
          </div>

          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{
                  marginLeft: `${(heading.level - 2) * 12}px`,
                }}
              >
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`text-left text-sm transition-all duration-200 hover:opacity-100 w-full ${
                    activeId === heading.id ? 'font-bold opacity-100' : 'opacity-60'
                  }`}
                  style={{
                    color: activeId === heading.id ? 'var(--menu-main)' : 'var(--foreground)',
                  }}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
