'use client';

import MarkdownAssistant from '@/components/MarkdownAssistant';
import AIAssistant from '@/components/AIAssistant';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Trash2Icon, PlusIcon, FileTextIcon, EditIcon, ImageIcon, LinkIcon } from 'lucide-react';


// 에디터 도구바 컴포넌트
function EditorToolbar({ onInsert }: { onInsert: (text: string) => void }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageSizeMenu, setShowImageSizeMenu] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/posts/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onInsert('\n' + data.markdown + '\n');
        alert('이미지가 삽입되었습니다!');
      } else {
        alert('이미지 업로드 실패');
      }
    } catch (error) {
      alert('이미지 업로드 중 오류 발생');
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl) {
      const markdown = linkText 
        ? `[${linkText}](${linkUrl})` 
        : `[링크](${linkUrl})`;
      onInsert(markdown);
      setLinkText('');
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const insertImageWithSize = (size: 'small' | 'medium' | 'large' | 'full') => {
    if (!imageUrl) {
      alert('이미지 URL을 입력해주세요');
      return;
    }

    const widths = {
      small: '200',
      medium: '500',
      large: '800',
      full: '100%'
    };

    const markdown = size === 'full'
      ? `<img src="${imageUrl}" alt="이미지" style="width: 100%;" />`
      : `<img src="${imageUrl}" alt="이미지" width="${widths[size]}" />`;

    onInsert('\n' + markdown + '\n');
    setImageUrl('');
    setShowImageSizeMenu(false);
  };

  return (
    <div className="mb-2 p-3 border rounded-t flex gap-2 items-center bg-gray-50 dark:bg-gray-800 flex-wrap">
      {/* 이미지 업로드 버튼 */}
      <label className="px-3 py-1.5 rounded border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5">
        <ImageIcon size={16} />
        <span className="text-sm">이미지</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {/* 이미지 크기 조절 버튼 */}
      <button
        type="button"
        onClick={() => setShowImageSizeMenu(!showImageSizeMenu)}
        className="px-3 py-1.5 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 relative"
      >
        <ImageIcon size={16} />
        <span className="text-sm">크기</span>
      </button>

      {/* 링크 삽입 버튼 */}
      <button
        type="button"
        onClick={() => setShowLinkDialog(!showLinkDialog)}
        className="px-3 py-1.5 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
      >
        <LinkIcon size={16} />
        <span className="text-sm">링크</span>
      </button>

      {/* 이미지 크기 메뉴 */}
      {showImageSizeMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">이미지 크기 조절</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">이미지 URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => insertImageWithSize('small')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🖼️ 작게 (200px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('medium')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🖼️ 중간 (500px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('large')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🖼️ 크게 (800px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('full')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🖼️ 전체
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImageSizeMenu(false);
                  setImageUrl('');
                }}
                className="w-full py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 링크 입력 다이얼로그 */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">링크 삽입</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">링크 텍스트 (선택)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="예: 여기를 클릭"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLinkInsert}
                  className="flex-1 py-2 rounded text-white"
                  style={{ backgroundColor: 'var(--menu-main)' }}
                >
                  삽입
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkText('');
                    setLinkUrl('');
                  }}
                  className="flex-1 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Post {
  slug: string;
  title: string;
  date: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState({
    title: '',
    description: '',
    summary: '',
    tags: '',
    content: '',
    date: new Date().toISOString().split('T')[0], // 기본값: 오늘
  });
  const [currentEditorContent, setCurrentEditorContent] = useState({
    title: '',
    content: '',
  });

  // 기존 글 목록 가져오기
  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/list');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('글 목록 로드 실패:', error);
    }
  };

  // 글 상세 내용 가져오기 (수정용)
  const fetchPostContent = async (slug: string) => {
    try {
      const res = await fetch(`/api/posts/get?slug=${slug}`);
      const data = await res.json();
      setEditContent({
        title: data.title || '',
        description: data.description || '',
        summary: data.summary || '',
        tags: data.tags ? data.tags.join(', ') : '',
        content: data.content || '',
        date: data.date || new Date().toISOString().split('T')[0],
      });
      setEditingPost(slug);
      setShowEditor(true);
    } catch (error) {
      alert('글을 불러오는데 실패했습니다');
    }
  };

  // 글 작성
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      summary: formData.get('summary'),
      tags: formData.get('tags'),
      content: formData.get('content'),
      date: formData.get('date'),
    };

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('글이 작성되었습니다!');
        // 페이지 새로고침으로 contentlayer가 새 글을 인식하도록 함
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`글 작성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('글 작성 에러:', error);
      alert('에러 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 글 수정
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      slug: editingPost,
      title: formData.get('title'),
      description: formData.get('description'),
      summary: formData.get('summary'),
      tags: formData.get('tags'),
      content: formData.get('content'),
      date: formData.get('date'),
    };

    try {
      const res = await fetch('/api/posts/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('글이 수정되었습니다!');
        // 페이지 새로고침으로 contentlayer가 변경사항을 인식하도록 함
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`글 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('글 수정 에러:', error);
      alert('에러 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 글 삭제
  const handleDelete = async (slug: string) => {
    if (!confirm('정말 이 글을 삭제하시겠습니까?')) return;

    setDeleteLoading(slug);
    try {
      const res = await fetch('/api/posts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        alert('글이 삭제되었습니다!');
        fetchPosts();
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      alert('에러 발생');
    } finally {
      setDeleteLoading(null);
    }
  };

  // 새 글 작성 모드로 전환
  const startNewPost = () => {
    setEditingPost(null);
    setEditContent({ title: '', description: '', summary: '', tags: '', content: '', date: new Date().toISOString().split('T')[0] });
    setShowEditor(true);
  };

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">로딩 중...</p>
      </div>
    );
  }

  // 로그인 안 됨
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--menu-main)' }}>
          관리자 페이지
        </h1>
        <p className="text-lg opacity-70">로그인이 필요합니다</p>
        <button
          onClick={() => signIn('github')}
          className="px-8 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: 'var(--menu-main)' }}
        >
          GitHub으로 로그인
        </button>
      </div>
    );
  }

  // 로그인 됨
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--menu-main)' }}>
            관리자 페이지
          </h1>
          <p className="opacity-60">환영합니다, {session.user?.name}님</p>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded-lg text-sm opacity-60 hover:opacity-100"
        >
          로그아웃
        </button>
      </div>

      {/* 새 글 작성 버튼 */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (showEditor) {
              setShowEditor(false);
              setEditingPost(null);
            } else {
              startNewPost();
            }
          }}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          style={{
            backgroundColor: showEditor ? 'var(--menu-sub)' : 'var(--menu-main)',
            color: 'white',
          }}
        >
          {showEditor ? (
            <>
              <FileTextIcon size={20} />
              글 목록 보기
            </>
          ) : (
            <>
              <PlusIcon size={20} />
              새 글 작성
            </>
          )}
        </button>
      </div>

      {/* 에디터 */}
      {showEditor && (
        <div className="mb-12 p-6 rounded-lg border" style={{ borderColor: 'var(--menu-main)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--menu-main)' }}>
            {editingPost ? '글 수정' : '새 글 작성'}
          </h2>
          <form onSubmit={editingPost ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">제목</label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={editContent.title}
                  onChange={(e) => setCurrentEditorContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  style={{ borderColor: 'var(--menu-main)' }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">작성일</label>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={editContent.date}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  style={{ borderColor: 'var(--menu-main)' }}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">설명 (선택)</label>
              <input
                name="description"
                type="text"
                defaultValue={editContent.description}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">요약문 (선택)</label>
              <textarea
                name="summary"
                rows={3}
                placeholder="글 목록에 표시될 요약문을 작성해주세요 (2-3줄 권장)"
                defaultValue={editContent.summary}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                style={{ borderColor: 'var(--menu-main)' }}
              />
              <p className="text-xs opacity-60 mt-1">
                💡 팁: 글의 핵심 내용을 간결하게 요약해주세요
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">태그 (쉼표로 구분)</label>
              <input
                name="tags"
                type="text"
                placeholder="예: 일상, 생각, 기록"
                defaultValue={editContent.tags}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">본문 (마크다운)</label>
              
              {/* 에디터 도구 버튼들 */}
              <EditorToolbar onInsert={(text) => {
                const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const currentValue = textarea.value;
                  const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
                  textarea.value = newValue;
                  textarea.focus();
                  textarea.selectionStart = textarea.selectionEnd = start + text.length;
                }
              }} />

              <textarea
                name="content"
                required
                rows={15}
                defaultValue={editContent.content}
                onChange={(e) => setCurrentEditorContent(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 rounded border font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                style={{ borderColor: 'var(--menu-main)' }}
                placeholder="# 제목&#10;&#10;본문 내용을 작성하세요..."
                onPaste={async (e) => {
                  // 클립보드에서 이미지 감지
                  const items = e.clipboardData?.items;
                  if (!items) return;

                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      e.preventDefault();
                      const file = items[i].getAsFile();
                      if (file) {
                        const textarea = e.currentTarget;
                        const originalPlaceholder = textarea.placeholder;
                        textarea.placeholder = '이미지 업로드 중...';
                        textarea.disabled = true;

                        const formData = new FormData();
                        formData.append('image', file);

                        try {
                          const res = await fetch('/api/posts/upload-image', {
                            method: 'POST',
                            body: formData,
                          });

                          if (res.ok) {
                            const data = await res.json();
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const currentValue = textarea.value;
                            const newValue = currentValue.substring(0, start) + '\n' + data.markdown + '\n' + currentValue.substring(end);
                            textarea.value = newValue;
                            alert('이미지가 삽입되었습니다!');
                          } else {
                            alert('이미지 업로드 실패');
                          }
                        } catch (error) {
                          alert('이미지 업로드 중 오류 발생');
                        } finally {
                          textarea.disabled = false;
                          textarea.placeholder = originalPlaceholder;
                          textarea.focus();
                        }
                      }
                    }
                  }
                }}
              />
              
              <p className="text-xs opacity-60 mt-2">
                💡 팁: 스크린샷을 복사(Ctrl+C) 후 에디터에 붙여넣기(Ctrl+V)하면 자동 업로드됩니다
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-lg font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: 'var(--menu-main)' }}
              >
                {isSubmitting ? '처리 중...' : editingPost ? '글 수정하기' : '글 작성하기'}
              </button>
              {editingPost && (
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingPost(null);
                    setEditContent({ title: '', description: '', summary: '', tags: '', content: '', date: new Date().toISOString().split('T')[0] });
                  }}
                  className="px-6 py-3 rounded-lg font-medium border"
                  style={{ borderColor: 'var(--menu-main)' }}
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* 글 목록 */}
      {!showEditor && (
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--menu-main)' }}>
            글 목록 ({posts.length}개)
          </h2>
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-center py-12 opacity-60">작성된 글이 없습니다</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex justify-between items-center p-4 rounded-lg border hover:shadow-md transition-shadow"
                  style={{ borderColor: 'var(--menu-main)' }}
                >
                  <div>
                    <h3 className="font-medium text-lg">{post.title}</h3>
                    <p className="text-sm opacity-60">{post.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchPostContent(post.slug)}
                      className="px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 flex items-center gap-2"
                      style={{ color: 'var(--menu-main)' }}
                    >
                      <EditIcon size={18} />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      disabled={deleteLoading === post.slug}
                      className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Trash2Icon size={18} />
                      {deleteLoading === post.slug ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* 마크다운 어시스턴트 추가 */}
      <MarkdownAssistant />

      {/* AI 글쓰기 어시스턴트 추가 */}
      <AIAssistant
        currentTitle={currentEditorContent.title}
        currentContent={currentEditorContent.content}
      />
    </div>
  );
}