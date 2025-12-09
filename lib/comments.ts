// 댓글 관련 타입 정의 및 Firestore 함수들
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  getDocs,
  limit,
  getCountFromServer,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// 댓글 타입 정의
export interface Comment {
  id: string;
  postSlug: string; // 게시글 슬러그
  content: string; // 댓글 내용
  authorId: string; // 작성자 ID (익명의 경우 임시 ID)
  authorName: string; // 작성자 이름
  authorEmail?: string; // 작성자 이메일 (익명의 경우 없음)
  authorPhoto?: string; // 작성자 프로필 사진 URL
  password?: string; // 익명 댓글의 경우 비밀번호 (해시된 값)
  parentId?: string; // 대댓글인 경우 부모 댓글 ID
  reactions: {
    like: number;
    love: number;
    laugh: number;
    wow: number;
  };
  reactedUsers: {
    [userId: string]: 'like' | 'love' | 'laugh' | 'wow';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean; // 삭제된 댓글 여부
  isEdited: boolean; // 수정된 댓글 여부
}

// 새 댓글 추가
export async function addComment(
  postSlug: string,
  content: string,
  authorId: string,
  authorName: string,
  authorEmail?: string,
  authorPhoto?: string,
  password?: string,
  parentId?: string
): Promise<string> {
  // Firestore는 undefined 값을 허용하지 않으므로 undefined 필드 제외
  const commentData: Record<string, any> = {
    postSlug,
    content,
    authorId,
    authorName,
    reactions: {
      like: 0,
      love: 0,
      laugh: 0,
      wow: 0,
    },
    reactedUsers: {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isDeleted: false,
    isEdited: false,
  };

  // 선택적 필드는 값이 있을 때만 추가
  if (authorEmail) commentData.authorEmail = authorEmail;
  if (authorPhoto) commentData.authorPhoto = authorPhoto;
  if (password) commentData.password = password;
  if (parentId) commentData.parentId = parentId;

  const docRef = await addDoc(collection(db, 'comments'), commentData);
  return docRef.id;
}

// 댓글 수정
export async function updateComment(
  commentId: string,
  content: string
): Promise<void> {
  const commentRef = doc(db, 'comments', commentId);
  await updateDoc(commentRef, {
    content,
    updatedAt: Timestamp.now(),
    isEdited: true,
  });
}

// 댓글 삭제 (소프트 삭제)
export async function deleteComment(commentId: string): Promise<void> {
  const commentRef = doc(db, 'comments', commentId);
  await updateDoc(commentRef, {
    content: '삭제된 댓글입니다.',
    isDeleted: true,
    updatedAt: Timestamp.now(),
  });
}

// 댓글 리액션 추가/변경
export async function toggleReaction(
  commentId: string,
  userId: string,
  reactionType: 'like' | 'love' | 'laugh' | 'wow'
): Promise<void> {
  const commentRef = doc(db, 'comments', commentId);

  // 현재 리액션 상태 확인 필요 (클라이언트에서 처리)
  // 여기서는 단순히 리액션 증가/감소만 처리
  await updateDoc(commentRef, {
    [`reactions.${reactionType}`]: increment(1),
    [`reactedUsers.${userId}`]: reactionType,
  });
}

// 댓글 리액션 제거
export async function removeReaction(
  commentId: string,
  userId: string,
  reactionType: 'like' | 'love' | 'laugh' | 'wow'
): Promise<void> {
  const commentRef = doc(db, 'comments', commentId);

  await updateDoc(commentRef, {
    [`reactions.${reactionType}`]: increment(-1),
    [`reactedUsers.${userId}`]: null,
  });
}

// 특정 게시글의 댓글 가져오기 (일회성, SWR용)
export async function getComments(
  postSlug: string,
  limitCount?: number
): Promise<Comment[]> {
  const constraints: any[] = [
    where('postSlug', '==', postSlug),
    orderBy('createdAt', 'asc'), // 오래된 순으로 정렬 (부모-자식 관계 유지)
  ];

  // limitCount가 지정된 경우에만 limit 추가
  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  const q = query(collection(db, 'comments'), ...constraints);
  const snapshot = await getDocs(q);

  const comments: Comment[] = [];
  snapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() } as Comment);
  });

  return comments;
}

// 특정 게시글의 댓글 실시간 구독 (페이지네이션 지원) - 레거시
export function subscribeToComments(
  postSlug: string,
  callback: (comments: Comment[]) => void,
  limitCount?: number
): () => void {
  const constraints: any[] = [
    where('postSlug', '==', postSlug),
    orderBy('createdAt', 'asc'), // 오래된 순으로 정렬 (부모-자식 관계 유지)
  ];

  // limitCount가 지정된 경우에만 limit 추가
  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  const q = query(collection(db, 'comments'), ...constraints);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const comments: Comment[] = [];
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() } as Comment);
    });
    callback(comments);
  });

  return unsubscribe;
}

// 특정 게시글의 댓글 총 개수 가져오기 (읽기 1회만 사용)
export async function getCommentCount(postSlug: string): Promise<number> {
  const q = query(
    collection(db, 'comments'),
    where('postSlug', '==', postSlug)
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

// 비밀번호 해싱 (간단한 구현 - 프로덕션에서는 bcrypt 등 사용)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 비밀번호 검증
export async function verifyPassword(
  commentId: string,
  password: string
): Promise<boolean> {
  const commentRef = doc(db, 'comments', commentId);
  const commentSnapshot = await getDocs(query(collection(db, 'comments'), where('__name__', '==', commentId)));

  if (commentSnapshot.empty) return false;

  const comment = commentSnapshot.docs[0].data() as Comment;
  const hashedPassword = await hashPassword(password);

  return comment.password === hashedPassword;
}

// Rate Limiting: 마지막 댓글 작성 시간 확인
export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  const activityRef = doc(db, 'userActivity', userId);
  const activityDoc = await getDoc(activityRef);

  if (!activityDoc.exists()) {
    return { allowed: true };
  }

  const lastCommentTime = activityDoc.data().lastCommentTime as Timestamp;
  const now = Timestamp.now();
  const diffSeconds = now.seconds - lastCommentTime.seconds;
  const RATE_LIMIT_SECONDS = 30; // 30초 제한

  if (diffSeconds < RATE_LIMIT_SECONDS) {
    return {
      allowed: false,
      remainingSeconds: RATE_LIMIT_SECONDS - diffSeconds
    };
  }

  return { allowed: true };
}

// Rate Limiting: 댓글 작성 시간 업데이트
export async function updateCommentTime(userId: string): Promise<void> {
  const activityRef = doc(db, 'userActivity', userId);
  await setDoc(activityRef, {
    lastCommentTime: Timestamp.now(),
  }, { merge: true });
}
