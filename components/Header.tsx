'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 기본 메뉴
  const baseNavItems = [
    { href: '/about', label: 'About' },
    { href: '/test', label: '테스트' },
    { href: '/test_2', label: '글목록' },
  ];

  // 로그인한 경우 Admin 메뉴 추가
  const navItems = session
    ? [...baseNavItems, { href: '/admin', label: 'Admin' }]
    : baseNavItems;

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* 로고 */}
        <Link 
          href="/" 
          className="text-xl md:text-2xl font-bold"
          style={{ color: 'var(--menu-main)' }}
        >
          Voti Web
        </Link>
        
        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-4">
          <div 
            className="flex items-center gap-1 p-1 rounded-full"
            style={{ backgroundColor: 'var(--menu-main)' }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive ? 'shadow-md' : 'hover:opacity-80'}
                  `}
                  style={{ 
                    backgroundColor: isActive ? 'var(--menu-sub)' : 'transparent',
                    color: isActive ? 'var(--menu-sub-text)' : 'var(--menu-main-text)'
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* 다크모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="relative w-[60px] h-[32px] rounded-full transition-colors duration-300"
            style={{ 
              backgroundColor: isDark ? '#826644' : '#D99058'
            }}
            aria-label="다크모드 토글"
          >
            <div
              className={`absolute top-1 w-[24px] h-[24px] rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center
                ${isDark ? 'left-[32px]' : 'left-1'}
              `}
            >
              <span className="text-sm">
                {isDark ? '🌙' : '☀️'}
              </span>
            </div>
          </button>
        </div>

        {/* 모바일 메뉴 버튼 + 다크모드 */}
        <div className="flex md:hidden items-center gap-2">
          {/* 모바일 다크모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="relative w-[50px] h-[28px] rounded-full transition-colors duration-300"
            style={{ 
              backgroundColor: isDark ? '#826644' : '#D99058'
            }}
            aria-label="다크모드 토글"
          >
            <div
              className={`absolute top-0.5 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center
                ${isDark ? 'left-[26px]' : 'left-0.5'}
              `}
            >
              <span className="text-xs">
                {isDark ? '🌙' : '☀️'}
              </span>
            </div>
          </button>

          {/* 햄버거 메뉴 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span 
                className={`block h-0.5 w-full rounded transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                style={{ 
                  backgroundColor: 'var(--menu-main)'
                }}
              />
              <span 
                className={`block h-0.5 w-full rounded transition-all ${isMenuOpen ? 'opacity-0' : ''}`}
                style={{ 
                  backgroundColor: 'var(--menu-main)'
                }}
              />
              <span 
                className={`block h-0.5 w-full rounded transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                style={{ 
                  backgroundColor: 'var(--menu-main)'
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* 모바일 드롭다운 메뉴 */}
      {/* 모바일 드롭다운 메뉴 */}
      <div 
        className={`md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-2 space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            
            return (
              <div
                key={item.href}
                className="transition-all duration-300"
                style={{
                  transitionDelay: isMenuOpen ? `${index * 300}ms` : '300ms',
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ 
                    backgroundColor: isActive ? 'var(--menu-sub)' : 'transparent',
                    color: isActive ? 'var(--menu-sub-text)' : 'var(--foreground)'
                  }}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}