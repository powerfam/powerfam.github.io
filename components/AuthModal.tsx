'use client';

import { useState } from 'react';
import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { X, User as UserIcon, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, anonymousName?: string, anonymousPassword?: string) => void;
}

// Google 아이콘 SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// GitHub 아이콘 SVG
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'select' | 'anonymous'>('select');
  const [anonymousName, setAnonymousName] = useState('');
  const [anonymousPassword, setAnonymousPassword] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetAndClose = () => {
    setAuthMode('select');
    setAnonymousName('');
    setAnonymousPassword('');
    setError('');
    setLoading(null);
    onClose();
  };

  // 익명 로그인 처리
  const handleAnonymousSignIn = async () => {
    if (!anonymousName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!anonymousPassword.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    if (anonymousPassword.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    setLoading('anonymous');
    setError('');

    try {
      const result = await signInAnonymously(auth);
      onAuthSuccess(result.user, anonymousName, anonymousPassword);
      resetAndClose();
    } catch (err: any) {
      setError('익명 로그인에 실패했습니다.');
    } finally {
      setLoading(null);
    }
  };

  // Google 로그인 처리
  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
      resetAndClose();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setError('이 도메인에서는 Google 로그인이 허용되지 않습니다.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('');
      } else {
        setError('Google 로그인에 실패했습니다.');
      }
    } finally {
      setLoading(null);
    }
  };

  // GitHub 로그인 처리
  const handleGithubSignIn = async () => {
    setLoading('github');
    setError('');

    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
      resetAndClose();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setError('이 도메인에서는 GitHub 로그인이 허용되지 않습니다.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('');
      } else {
        setError('GitHub 로그인에 실패했습니다.');
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && resetAndClose()}
    >
      <div
        className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={resetAndClose}
            className="absolute right-4 top-4 p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: 'var(--foreground)' }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{ backgroundColor: 'var(--menu-main)' }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {authMode === 'select' ? '댓글 작성하기' : '익명으로 작성'}
              </h2>
              <p className="mt-1 text-sm opacity-60" style={{ color: 'var(--foreground)' }}>
                {authMode === 'select'
                  ? '로그인 방법을 선택해주세요'
                  : '닉네임과 비밀번호를 입력해주세요'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {authMode === 'select' ? (
            <div className="space-y-3">
              {/* 소셜 로그인 버튼들 */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading !== null}
                className="w-full h-11 px-4 rounded-lg border transition-all flex items-center justify-center gap-3 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--foreground)',
                  borderOpacity: 0.2,
                  backgroundColor: 'var(--background)',
                }}
              >
                {loading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--foreground)' }} />
                ) : (
                  <>
                    <GoogleIcon />
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      Google로 계속하기
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleGithubSignIn}
                disabled={loading !== null}
                className="w-full h-11 px-4 rounded-lg border transition-all flex items-center justify-center gap-3 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--foreground)',
                  borderOpacity: 0.2,
                  backgroundColor: 'var(--background)',
                }}
              >
                {loading === 'github' ? (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--foreground)' }} />
                ) : (
                  <>
                    <GithubIcon />
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      GitHub로 계속하기
                    </span>
                  </>
                )}
              </button>

              {/* 구분선 */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--foreground)', opacity: 0.15 }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className="px-3"
                    style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', opacity: 0.5 }}
                  >
                    또는
                  </span>
                </div>
              </div>

              {/* 익명 로그인 버튼 */}
              <button
                onClick={() => setAuthMode('anonymous')}
                disabled={loading !== null}
                className="w-full h-11 px-4 rounded-lg transition-all flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--menu-main)',
                  color: 'var(--menu-main-text)',
                }}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">익명으로 작성하기</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 뒤로가기 버튼 */}
              <button
                onClick={() => {
                  setAuthMode('select');
                  setError('');
                }}
                className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
                style={{ color: 'var(--menu-main)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>다른 방법으로 로그인</span>
              </button>

              {/* 입력 폼 */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={anonymousName}
                    onChange={(e) => setAnonymousName(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    className="w-full h-11 px-4 rounded-lg border-2 transition-colors focus:outline-none"
                    style={{
                      borderColor: 'var(--menu-main)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px var(--menu-main)33'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={anonymousPassword}
                    onChange={(e) => setAnonymousPassword(e.target.value)}
                    placeholder="최소 4자 이상 (수정/삭제 시 필요)"
                    className="w-full h-11 px-4 rounded-lg border-2 transition-colors focus:outline-none"
                    style={{
                      borderColor: 'var(--menu-main)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px var(--menu-main)33'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnonymousSignIn()}
                  />
                  <p className="mt-1.5 text-xs opacity-50" style={{ color: 'var(--foreground)' }}>
                    댓글 수정/삭제 시 이 비밀번호가 필요합니다
                  </p>
                </div>
              </div>

              {/* 확인 버튼 */}
              <button
                onClick={handleAnonymousSignIn}
                disabled={loading !== null}
                className="w-full h-11 px-4 rounded-lg transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{
                  backgroundColor: 'var(--menu-main)',
                  color: 'var(--menu-main-text)',
                }}
              >
                {loading === 'anonymous' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="font-medium">댓글 작성하기</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
