'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export default function GlobalProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 로딩 시작
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);

    // 빠르게 30%까지
    setTimeout(() => setProgress(30), 50);
    // 점점 느려지며 70%까지
    setTimeout(() => setProgress(50), 200);
    setTimeout(() => setProgress(70), 500);
    // 90%에서 대기 (완료될 때까지)
    setTimeout(() => setProgress(90), 1000);
  }, []);

  // 로딩 완료
  const completeLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  // 경로 변경 감지 - 완료 처리
  useEffect(() => {
    if (isLoading) {
      completeLoading();
    }
  }, [pathname, searchParams]);

  // 링크 클릭 감지
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        const href = link.getAttribute('href');
        // 내부 링크이고 현재 페이지와 다른 경우에만 로딩 표시
        if (href && href.startsWith('/') && href !== pathname) {
          startLoading();
        }
      }
    };

    // 폼 제출 감지
    const handleSubmit = () => {
      startLoading();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [pathname, startLoading]);

  // 전역 로딩 이벤트 리스너 (fetch 등에서 사용 가능)
  useEffect(() => {
    const handleStartLoading = () => startLoading();
    const handleCompleteLoading = () => completeLoading();

    window.addEventListener('globalLoadingStart', handleStartLoading);
    window.addEventListener('globalLoadingComplete', handleCompleteLoading);

    return () => {
      window.removeEventListener('globalLoadingStart', handleStartLoading);
      window.removeEventListener('globalLoadingComplete', handleCompleteLoading);
    };
  }, [startLoading, completeLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  );
}

// 전역에서 로딩 상태를 제어할 수 있는 헬퍼 함수
export const globalLoading = {
  start: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('globalLoadingStart'));
    }
  },
  complete: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('globalLoadingComplete'));
    }
  },
};
