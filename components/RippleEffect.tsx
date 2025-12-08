'use client';

import { useEffect } from 'react';

export default function RippleEffect() {
  useEffect(() => {
    const createRipple = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - 5}px`;
      ripple.style.top = `${e.clientY - 5}px`;

      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    document.addEventListener('click', createRipple);

    return () => {
      document.removeEventListener('click', createRipple);
    };
  }, []);

  return null;
}
