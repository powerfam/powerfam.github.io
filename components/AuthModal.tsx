'use client';

import { useState } from 'react';
import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { hashPassword } from '@/lib/comments';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, anonymousName?: string, anonymousPassword?: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'select' | 'anonymous'>('select');
  const [anonymousName, setAnonymousName] = useState('');
  const [anonymousPassword, setAnonymousPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

    setLoading(true);
    setError('');

    try {
      const result = await signInAnonymously(auth);
      onAuthSuccess(result.user, anonymousName, anonymousPassword);
      onClose();
    } catch (err: any) {
      setError('익명 로그인에 실패했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google 로그인 처리
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError('Google 로그인에 실패했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // GitHub 로그인 처리
  const handleGithubSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError('GitHub 로그인에 실패했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--menu-main)' }}>
            {authMode === 'select' ? '로그인 방법 선택' : '익명으로 댓글 작성'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        {authMode === 'select' ? (
          <div className="space-y-3">
            <button
              onClick={() => setAuthMode('anonymous')}
              disabled={loading}
              className="w-full py-3 px-4 rounded-md border-2 transition-colors flex items-center justify-center gap-2"
              style={{
                borderColor: 'var(--menu-sub)',
                color: 'var(--menu-sub-text)',
                backgroundColor: 'var(--menu-sub)',
              }}
            >
              <span>👤</span>
              <span>익명으로 작성</span>
            </button>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-md border-2 transition-colors flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              style={{ borderColor: 'var(--menu-main)' }}
            >
              <span>🔵</span>
              <span>Google로 로그인</span>
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-md border-2 transition-colors flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              style={{ borderColor: 'var(--menu-main)' }}
            >
              <span>⚫</span>
              <span>GitHub로 로그인</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                이름
              </label>
              <input
                type="text"
                value={anonymousName}
                onChange={(e) => setAnonymousName(e.target.value)}
                placeholder="닉네임을 입력하세요"
                className="w-full px-4 py-2 rounded-md border-2"
                style={{
                  borderColor: 'var(--menu-main)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                비밀번호 (댓글 수정/삭제 시 필요)
              </label>
              <input
                type="password"
                value={anonymousPassword}
                onChange={(e) => setAnonymousPassword(e.target.value)}
                placeholder="최소 4자 이상"
                className="w-full px-4 py-2 rounded-md border-2"
                style={{
                  borderColor: 'var(--menu-main)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAuthMode('select')}
                className="flex-1 py-2 px-4 rounded-md border-2 transition-colors"
                style={{ borderColor: 'var(--menu-main)', color: 'var(--foreground)' }}
              >
                뒤로
              </button>
              <button
                onClick={handleAnonymousSignIn}
                disabled={loading}
                className="flex-1 py-2 px-4 rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--menu-main)',
                  color: 'white',
                }}
              >
                {loading ? '로그인 중...' : '확인'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
