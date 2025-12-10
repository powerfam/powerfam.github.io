'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const articleRect = article.getBoundingClientRect();
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // 글 읽기 시작점 (article 상단이 화면에 들어올 때)
      const startPoint = articleTop - windowHeight;
      // 글 읽기 완료점 (article 하단이 화면에 보일 때)
      const endPoint = articleTop + articleHeight - windowHeight;

      // 진행률 계산
      if (scrollTop <= startPoint) {
        setProgress(0);
        setIsVisible(false);
      } else if (scrollTop >= endPoint) {
        setProgress(100);
        setIsVisible(true);
      } else {
        const currentProgress = ((scrollTop - startPoint) / (endPoint - startPoint)) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
        setIsVisible(true);
      }
    };

    // 초기 계산
    calculateProgress();

    // 스크롤 이벤트
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-1 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: 'var(--menu-main)',
        }}
      />
    </div>
  );
}
