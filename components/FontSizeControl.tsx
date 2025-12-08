'use client';

import { useEffect, useState, useRef } from 'react';
import { TypeIcon, PlusIcon, MinusIcon } from 'lucide-react';

export default function FontSizeControl() {
  const [fontSize, setFontSize] = useState(16); // 기본 16px
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // localStorage에서 폰트 크기 불러오기
    const savedFontSize = localStorage.getItem('articleFontSize');
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      applyFontSize(size);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 시 버튼 표시
      setIsVisible(true);

      // 기존 타임아웃 클리어
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 3초 후 버튼 숨김
      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const applyFontSize = (size: number) => {
    const article = document.querySelector('article');
    if (article) {
      article.style.fontSize = `${size}px`;
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) { // 최대 24px
      const newSize = fontSize + 2;
      setFontSize(newSize);
      applyFontSize(newSize);
      localStorage.setItem('articleFontSize', newSize.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) { // 최소 12px
      const newSize = fontSize - 2;
      setFontSize(newSize);
      applyFontSize(newSize);
      localStorage.setItem('articleFontSize', newSize.toString());
    }
  };

  const resetFontSize = () => {
    const defaultSize = 16;
    setFontSize(defaultSize);
    applyFontSize(defaultSize);
    localStorage.setItem('articleFontSize', defaultSize.toString());
  };

  return (
    <div
      className={`fixed bottom-24 right-8 z-40 flex flex-col gap-2 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* 폰트 사이즈 컨트롤 */}
      <div
        className="flex flex-col gap-1 p-2 rounded-lg shadow-xl border-2"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--menu-main)',
        }}
      >
        {/* 아이콘 표시 */}
        <div
          className="flex items-center justify-center py-1"
          style={{ color: 'var(--menu-main)' }}
        >
          <TypeIcon size={16} />
        </div>

        {/* 증가 버튼 */}
        <button
          onClick={increaseFontSize}
          disabled={fontSize >= 24}
          className="flex items-center justify-center p-2 rounded-md transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: 'var(--menu-main)',
            color: 'var(--menu-main-text)',
          }}
          title="폰트 크기 증가"
        >
          <PlusIcon size={16} />
        </button>

        {/* 기본값 버튼 */}
        <button
          onClick={resetFontSize}
          className="flex items-center justify-center px-2 py-1.5 text-xs font-bold rounded-md transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'var(--menu-sub)',
            color: 'var(--menu-sub-text)',
          }}
          title="기본 크기로 리셋"
        >
          기본
        </button>

        {/* 감소 버튼 */}
        <button
          onClick={decreaseFontSize}
          disabled={fontSize <= 12}
          className="flex items-center justify-center p-2 rounded-md transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: 'var(--menu-main)',
            color: 'var(--menu-main-text)',
          }}
          title="폰트 크기 감소"
        >
          <MinusIcon size={16} />
        </button>
      </div>
    </div>
  );
}
