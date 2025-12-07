'use client';

import { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Comment,
  addComment,
  updateComment,
  deleteComment,
  toggleReaction,
  removeReaction,
  subscribeToComments,
  hashPassword,
} from '@/lib/comments';
import AuthModal from './AuthModal';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface FirebaseCommentsProps {
  postSlug: string;
}

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  anonymousData: { name: string; password: string } | null;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onReact: (commentId: string, reaction: 'like' | 'love' | 'laugh' | 'wow') => void;
  level?: number;
}

// 개별 댓글 아이템 컴포넌트
function CommentItem({
  comment,
  currentUser,
  anonymousData,
  onReply,
  onEdit,
  onDelete,
  onReact,
  level = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReactions, setShowReactions] = useState(false);

  const isAuthor = currentUser?.uid === comment.authorId;
  const userReaction = currentUser?.uid ? comment.reactedUsers[currentUser.uid] : null;

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      await onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleReaction = (reaction: 'like' | 'love' | 'laugh' | 'wow') => {
    onReact(comment.id, reaction);
    setShowReactions(false);
  };

  return (
    <div
      className={`border-l-2 ${level > 0 ? 'ml-8 mt-3' : 'mt-4'}`}
      style={{ borderColor: 'var(--menu-sub)' }}
    >
      <div className="pl-4">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2 mb-2">
          {comment.authorPhoto ? (
            <img
              src={comment.authorPhoto}
              alt={comment.authorName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: 'var(--menu-main)' }}
            >
              {comment.authorName[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              {comment.authorName}
              {comment.isEdited && (
                <span className="ml-2 text-xs opacity-60">(수정됨)</span>
              )}
            </div>
            <div className="text-xs opacity-60">
              {formatDistanceToNow(comment.createdAt.toDate(), {
                addSuffix: true,
                locale: ko,
              })}
            </div>
          </div>
        </div>

        {/* 댓글 내용 */}
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 rounded-md border-2 resize-none"
              style={{
                borderColor: 'var(--menu-main)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 rounded-md text-sm"
                style={{ backgroundColor: 'var(--menu-main)', color: 'white' }}
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-md text-sm border-2"
                style={{ borderColor: 'var(--menu-main)' }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p
            className="mb-2 whitespace-pre-wrap"
            style={{ color: 'var(--foreground)' }}
          >
            {comment.content}
          </p>
        )}

        {/* 리액션 표시 */}
        {(comment.reactions.like > 0 ||
          comment.reactions.love > 0 ||
          comment.reactions.laugh > 0 ||
          comment.reactions.wow > 0) && (
          <div className="flex gap-2 mb-2 text-sm">
            {comment.reactions.like > 0 && (
              <span className={userReaction === 'like' ? 'font-bold' : ''}>
                👍 {comment.reactions.like}
              </span>
            )}
            {comment.reactions.love > 0 && (
              <span className={userReaction === 'love' ? 'font-bold' : ''}>
                ❤️ {comment.reactions.love}
              </span>
            )}
            {comment.reactions.laugh > 0 && (
              <span className={userReaction === 'laugh' ? 'font-bold' : ''}>
                😂 {comment.reactions.laugh}
              </span>
            )}
            {comment.reactions.wow > 0 && (
              <span className={userReaction === 'wow' ? 'font-bold' : ''}>
                😮 {comment.reactions.wow}
              </span>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        {!isEditing && (
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => onReply(comment.id)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              답글
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                리액션
              </button>
              {showReactions && (
                <div className="absolute top-6 left-0 bg-white dark:bg-gray-800 border-2 rounded-md p-2 flex gap-2 shadow-lg z-10"
                  style={{ borderColor: 'var(--menu-main)' }}
                >
                  <button onClick={() => handleReaction('like')} className="hover:scale-125 transition-transform">
                    👍
                  </button>
                  <button onClick={() => handleReaction('love')} className="hover:scale-125 transition-transform">
                    ❤️
                  </button>
                  <button onClick={() => handleReaction('laugh')} className="hover:scale-125 transition-transform">
                    😂
                  </button>
                  <button onClick={() => handleReaction('wow')} className="hover:scale-125 transition-transform">
                    😮
                  </button>
                </div>
              )}
            </div>

            {isAuthor && !comment.isDeleted && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="opacity-60 hover:opacity-100 transition-opacity text-red-500"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FirebaseComments({ postSlug }: FirebaseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [anonymousData, setAnonymousData] = useState<{ name: string; password: string } | null>(
    null
  );
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Firebase Auth 상태 구독
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // 댓글 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToComments(postSlug, (newComments) => {
      setComments(newComments);
    });

    return () => unsubscribe();
  }, [postSlug]);

  // 인증 성공 핸들러
  const handleAuthSuccess = (user: User, name?: string, password?: string) => {
    setCurrentUser(user);
    if (name && password) {
      setAnonymousData({ name, password });
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAnonymousData(null);
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    try {
      const authorName =
        anonymousData?.name ||
        currentUser.displayName ||
        currentUser.email?.split('@')[0] ||
        '익명';
      const authorEmail = anonymousData ? undefined : currentUser.email || undefined;
      const authorPhoto = anonymousData ? undefined : currentUser.photoURL || undefined;
      const hashedPassword = anonymousData
        ? await hashPassword(anonymousData.password)
        : undefined;

      await addComment(
        postSlug,
        newComment,
        currentUser.uid,
        authorName,
        authorEmail,
        authorPhoto,
        hashedPassword,
        replyTo || undefined
      );

      setNewComment('');
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 리액션 토글
  const handleReaction = async (
    commentId: string,
    reaction: 'like' | 'love' | 'laugh' | 'wow'
  ) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      const currentReaction = comment.reactedUsers[currentUser.uid];

      if (currentReaction === reaction) {
        // 같은 리액션 클릭 시 제거
        await removeReaction(commentId, currentUser.uid, reaction);
      } else if (currentReaction) {
        // 다른 리액션이 있으면 먼저 제거하고 새로운 리액션 추가
        await removeReaction(commentId, currentUser.uid, currentReaction);
        await toggleReaction(commentId, currentUser.uid, reaction);
      } else {
        // 리액션 추가
        await toggleReaction(commentId, currentUser.uid, reaction);
      }
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  // 댓글을 계층 구조로 정리
  const organizeComments = (comments: Comment[]): Comment[] => {
    const topLevel = comments.filter((c) => !c.parentId);
    const replies = comments.filter((c) => c.parentId);

    const organized: Comment[] = [];

    topLevel.forEach((comment) => {
      organized.push(comment);
      const commentReplies = replies.filter((r) => r.parentId === comment.id);
      organized.push(...commentReplies);
    });

    return organized;
  };

  const organizedComments = organizeComments(comments);

  return (
    <div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 로그인 상태 표시 및 로그아웃 버튼 */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm" style={{ color: 'var(--foreground)' }}>
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>
                {anonymousData
                  ? `${anonymousData.name}(으)로 로그인됨`
                  : `${currentUser.displayName || currentUser.email}(으)로 로그인됨`}
              </span>
            </div>
          ) : (
            <span className="opacity-60">로그인하여 댓글을 작성하세요</span>
          )}
        </div>
        {currentUser ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1 text-sm rounded-md border-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{ borderColor: 'var(--menu-main)', color: 'var(--foreground)' }}
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-1 text-sm rounded-md transition-colors"
            style={{ backgroundColor: 'var(--menu-main)', color: 'white' }}
          >
            로그인
          </button>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <div className="mb-6">
        {replyTo && (
          <div className="mb-2 text-sm flex items-center gap-2">
            <span style={{ color: 'var(--menu-main)' }}>
              답글 작성 중...
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-red-500 hover:underline"
            >
              취소
            </button>
          </div>
        )}

        {/* 로그인 안 된 상태에서 클릭하면 로그인 모달 */}
        <div
          className="relative"
          onClick={() => {
            if (!currentUser) {
              setShowAuthModal(true);
            }
          }}
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              currentUser
                ? replyTo
                  ? '답글을 작성하세요...'
                  : '댓글을 작성하세요...'
                : '클릭하여 로그인하고 댓글을 작성하세요...'
            }
            className={`w-full px-4 py-3 rounded-md border-2 resize-none ${
              !currentUser ? 'cursor-pointer' : ''
            }`}
            style={{
              borderColor: 'var(--menu-main)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
            rows={4}
            readOnly={!currentUser}
          />
          {!currentUser && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-md cursor-pointer">
              <span
                className="px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: 'var(--menu-main)', color: 'white' }}
              >
                클릭하여 로그인
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmitComment}
            disabled={!currentUser || !newComment.trim() || loading}
            className="px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--menu-main)',
              color: 'white',
            }}
          >
            {loading ? '작성 중...' : replyTo ? '답글 작성' : '댓글 작성'}
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div>
        <div className="mb-4 font-semibold" style={{ color: 'var(--menu-main)' }}>
          댓글 {comments.length}개
        </div>

        {organizedComments.length === 0 ? (
          <div className="text-center py-12 opacity-60">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </div>
        ) : (
          <div className="space-y-2">
            {organizedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                anonymousData={anonymousData}
                onReply={setReplyTo}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onReact={handleReaction}
                level={comment.parentId ? 1 : 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
