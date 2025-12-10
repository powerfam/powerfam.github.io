'use client';

import { useEffect } from 'react';

export default function RippleEffect() {
  useEffect(() => {
    const createRipple = (x: number, y: number) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = `${x - 5}px`;
      ripple.style.top = `${y - 5}px`;

      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    const handleClick = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // 첫 번째 터치 포인트 사용
      const touch = e.touches[0];
      if (touch) {
        createRipple(touch.clientX, touch.clientY);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return null;
}
