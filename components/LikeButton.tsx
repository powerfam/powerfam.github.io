'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

interface LikeButtonProps {
  postSlug: string;
}

export default function LikeButton({ postSlug }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage 키
  const storageKey = `liked_${postSlug}`;

  // 초기 로드
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        // localStorage에서 좋아요 여부 확인
        const hasLiked = localStorage.getItem(storageKey) === 'true';
        setLiked(hasLiked);

        // Firestore에서 좋아요 수 가져오기
        if (db) {
          const likeRef = doc(db, 'likes', postSlug);
          const likeDoc = await getDoc(likeRef);

          if (likeDoc.exists()) {
            setCount(likeDoc.data().count || 0);
          }
        }
      } catch (error) {
        console.error('좋아요 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeData();
  }, [postSlug, storageKey]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!db) return;

    try {
      const likeRef = doc(db, 'likes', postSlug);

      if (liked) {
        // 좋아요 취소
        await setDoc(likeRef, { count: increment(-1) }, { merge: true });
        localStorage.removeItem(storageKey);
        setLiked(false);
        setCount((prev) => Math.max(0, prev - 1));
      } else {
        // 좋아요 추가
        await setDoc(likeRef, { count: increment(1) }, { merge: true });
        localStorage.setItem(storageKey, 'true');
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all hover:scale-105 disabled:opacity-50"
      style={{
        borderColor: 'var(--menu-main)',
        color: liked ? '#ef4444' : 'var(--menu-main)',
        backgroundColor: liked ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
      }}
      title={liked ? '좋아요 취소' : '좋아요'}
    >
      <HeartIcon
        size={20}
        fill={liked ? '#ef4444' : 'none'}
        stroke={liked ? '#ef4444' : 'currentColor'}
      />
      {count > 0 && (
        <span className="text-sm font-medium" style={{ color: liked ? '#ef4444' : 'var(--menu-main)' }}>
          {count}
        </span>
      )}
    </button>
  );
}
