'use client';

import { useEffect, useRef, useState } from 'react';

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // 다크모드 감지 (CSS 변수 기반)
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setMounted(true);

    // 다크모드 감지 함수
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    };

    detectTheme();

    // 테마 변경 감지
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://giscus.app/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';

    // Giscus 설정
    scriptElem.setAttribute('data-repo', process.env.NEXT_PUBLIC_GISCUS_REPO || 'username/repo');
    scriptElem.setAttribute('data-repo-id', process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '');
    scriptElem.setAttribute('data-category', process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'General');
    scriptElem.setAttribute('data-category-id', process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '');
    scriptElem.setAttribute('data-mapping', 'pathname');
    scriptElem.setAttribute('data-strict', '0');
    scriptElem.setAttribute('data-reactions-enabled', '1');
    scriptElem.setAttribute('data-emit-metadata', '0');
    scriptElem.setAttribute('data-input-position', 'bottom');
    // 사이트 테마와 조화로운 Giscus 테마 사용
    // light_high_contrast: 라이트 모드에서 더 높은 대비로 텍스트 가독성 향상
    scriptElem.setAttribute('data-theme', theme === 'dark' ? 'transparent_dark' : 'light_high_contrast');
    scriptElem.setAttribute('data-lang', 'ko');

    ref.current.appendChild(scriptElem);
  }, [mounted, theme]);

  // 테마 변경 시 Giscus 테마도 변경
  useEffect(() => {
    if (!mounted) return;

    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) return;

    const giscusTheme = theme === 'dark' ? 'transparent_dark' : 'light_high_contrast';
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app'
    );
  }, [theme, mounted]);

  return (
    <div
      ref={ref}
      className="giscus-wrapper"
      style={{
        // Giscus 컨테이너 스타일
        opacity: 0.95,
      }}
    />
  );
}
