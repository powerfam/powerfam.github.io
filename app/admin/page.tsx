'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Trash2Icon, PlusIcon, FileTextIcon, EditIcon, ImageIcon, LinkIcon, CalendarIcon, TableIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

// 동적 임포트로 번들 크기 최적화 (AI 컴포넌트는 무거우므로)
const MarkdownAssistant = dynamic(() => import('@/components/MarkdownAssistant'), {
  loading: () => <div className="text-sm opacity-60">AI 어시스턴트 로딩 중...</div>,
  ssr: false,
});

const AIAssistant = dynamic(() => import('@/components/AIAssistant'), {
  loading: () => <div className="text-sm opacity-60">AI 어시스턴트 로딩 중...</div>,
  ssr: false,
});


// 에디터 도구바 컴포넌트
function EditorToolbar({ onInsert }: { onInsert: (text: string) => void }) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageSizeMenu, setShowImageSizeMenu] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 표 관련 상태
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableData, setTableData] = useState<string[][]>([]);

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

  // 표 다이얼로그 열기
  const openTableDialog = () => {
    // 초기 빈 테이블 데이터 생성
    const initialData = Array(tableRows).fill(null).map(() => Array(tableCols).fill(''));
    setTableData(initialData);
    setShowTableDialog(true);
  };

  // 행/열 수 변경 시 테이블 데이터 재생성
  const updateTableSize = (newRows: number, newCols: number) => {
    const newData = Array(newRows).fill(null).map((_, rowIdx) =>
      Array(newCols).fill(null).map((_, colIdx) =>
        tableData[rowIdx]?.[colIdx] || ''
      )
    );
    setTableRows(newRows);
    setTableCols(newCols);
    setTableData(newData);
  };

  // 셀 데이터 업데이트
  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newData = [...tableData];
    newData[rowIdx] = [...newData[rowIdx]];
    newData[rowIdx][colIdx] = value;
    setTableData(newData);
  };

  // 마크다운 표 생성 (가운데 정렬)
  const generateMarkdownTable = () => {
    if (tableData.length === 0 || tableData[0].length === 0) return;

    const rows = tableData;
    const cols = tableCols;

    // 헤더 행 (첫 번째 행)
    const headerRow = '| ' + rows[0].map(cell => cell || '제목').join(' | ') + ' |';

    // 구분선 (가운데 정렬: :---:)
    const separatorRow = '| ' + Array(cols).fill(':---:').join(' | ') + ' |';

    // 데이터 행들
    const dataRows = rows.slice(1).map(row =>
      '| ' + row.map(cell => cell || '').join(' | ') + ' |'
    );

    const markdown = [headerRow, separatorRow, ...dataRows].join('\n');
    onInsert('\n' + markdown + '\n');

    // 초기화
    setShowTableDialog(false);
    setTableRows(3);
    setTableCols(3);
    setTableData([]);
  };

  const insertImageWithSize = (size: 'small' | 'thumbnail' | 'medium' | 'large' | 'full') => {
    if (!imageUrl) {
      alert('이미지 URL을 입력해주세요');
      return;
    }

    // 순수 마크다운 형식 (이미지 + 캡션)
    const markdown = `![이미지](${imageUrl})
*여기에 사진 캡션 작성 @voti*`;

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

      {/* 표 삽입 버튼 */}
      <button
        type="button"
        onClick={openTableDialog}
        className="px-3 py-1.5 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
      >
        <TableIcon size={16} />
        <span className="text-sm">표</span>
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
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  🖼️ 작게 (200px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('thumbnail')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  🖼️ 썸네일 (400px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('medium')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  🖼️ 중간 (500px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('large')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  🖼️ 크게 (800px)
                </button>
                <button
                  type="button"
                  onClick={() => insertImageWithSize('full')}
                  className="py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm col-span-2"
                >
                  🖼️ 전체 너비
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

      {/* 표 삽입 다이얼로그 */}
      {showTableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--menu-main)' }}>
                표 삽입
              </h3>

              {/* 행/열 수 설정 */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">행:</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={tableRows}
                    onChange={(e) => updateTableSize(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)), tableCols)}
                    className="w-16 px-2 py-1 border rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    style={{ borderColor: 'var(--menu-main)' }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">열:</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={tableCols}
                    onChange={(e) => updateTableSize(tableRows, Math.max(2, Math.min(6, parseInt(e.target.value) || 2)))}
                    className="w-16 px-2 py-1 border rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    style={{ borderColor: 'var(--menu-main)' }}
                  />
                </div>
              </div>

              {/* 표 입력 그리드 */}
              <div className="mb-4 overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {tableData.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, colIdx) => (
                          <td key={colIdx} className="p-1">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                              placeholder={rowIdx === 0 ? `헤더 ${colIdx + 1}` : ''}
                              className={`w-full px-2 py-2 border rounded text-center text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                                rowIdx === 0 ? 'font-bold' : ''
                              }`}
                              style={{
                                borderColor: 'var(--menu-main)',
                                backgroundColor: rowIdx === 0 ? 'rgba(130, 102, 68, 0.1)' : undefined
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs opacity-60 mb-4">
                * 첫 번째 행은 헤더로 사용됩니다. 모든 셀은 가운데 정렬됩니다.
              </p>

              {/* 버튼 */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generateMarkdownTable}
                  className="flex-1 py-2 rounded text-white font-medium"
                  style={{ backgroundColor: 'var(--menu-main)' }}
                >
                  표 삽입
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTableDialog(false);
                    setTableRows(3);
                    setTableCols(3);
                    setTableData([]);
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

type TabType = 'write' | 'list' | 'about' | 'test';

interface AboutContent {
  title: string;
  intro: string;
  topics: string[];
  outro: string;
}

interface TestContent {
  title: string;
  description: string;
  mainColorDesc: string;
  subColorDesc: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState({
    title: '',
    description: '',
    summary: '',
    tags: '',
    content: '',
    date: new Date().toISOString().split('T')[0], // 기본값: 오늘
    section: 'section1', // 기본값: section1
  });
  const [currentEditorContent, setCurrentEditorContent] = useState({
    title: '',
    content: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // 달력 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCalendar && !target.closest('.calendar-container')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: 'About',
    intro: '',
    topics: ['', '', ''],
    outro: ''
  });
  const [testContent, setTestContent] = useState<TestContent>({
    title: '테스트 페이지',
    description: '',
    mainColorDesc: '',
    subColorDesc: ''
  });

  // 기존 글 목록 가져오기
  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session]);

  // About 페이지 내용 불러오기
  useEffect(() => {
    if (session && activeTab === 'about') {
      fetchAboutContent();
    }
  }, [session, activeTab]);

  // 테스트 페이지 내용 불러오기
  useEffect(() => {
    if (session && activeTab === 'test') {
      fetchTestContent();
    }
  }, [session, activeTab]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/list');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('글 목록 로드 실패:', error);
    }
  };

  const fetchAboutContent = async () => {
    try {
      const res = await fetch('/api/pages/get?page=about');
      const data = await res.json();
      setAboutContent(data);
    } catch (error) {
      console.error('About 내용 로드 실패:', error);
    }
  };

  const fetchTestContent = async () => {
    try {
      const res = await fetch('/api/pages/get?page=test');
      const data = await res.json();
      setTestContent(data);
    } catch (error) {
      console.error('테스트 내용 로드 실패:', error);
    }
  };

  // 글 상세 내용 가져오기 (수정용)
  const fetchPostContent = async (slug: string) => {
    try {
      const res = await fetch(`/api/posts/get?slug=${slug}`);
      const data = await res.json();
      const postDate = data.date || new Date().toISOString().split('T')[0];
      setEditContent({
        title: data.title || '',
        description: data.description || '',
        summary: data.summary || '',
        tags: data.tags ? data.tags.join(', ') : '',
        content: data.content || '',
        date: postDate,
        section: data.section || 'section1',
      });
      setSelectedDate(new Date(postDate));
      setEditingPost(slug);
      setActiveTab('write');
    } catch (error) {
      alert('글을 불러오는데 실패했습니다');
    }
  };

  // 글 작성
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const section = formData.get('section') as string;

    // 섹션 검증
    if (!section || section === '') {
      alert('섹션을 선택하세요');
      return;
    }

    setIsSubmitting(true);

    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      summary: formData.get('summary'),
      tags: formData.get('tags'),
      content: formData.get('content'),
      date: formData.get('date'),
      section: section,
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

    const formData = new FormData(e.currentTarget);
    const section = formData.get('section') as string;

    // 섹션 검증
    if (!section || section === '') {
      alert('섹션을 선택하세요');
      return;
    }

    setIsSubmitting(true);

    const data = {
      slug: editingPost,
      title: formData.get('title'),
      description: formData.get('description'),
      summary: formData.get('summary'),
      tags: formData.get('tags'),
      content: formData.get('content'),
      date: formData.get('date'),
      section: section,
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
    setEditContent({ title: '', description: '', summary: '', tags: '', content: '', date: new Date().toISOString().split('T')[0], section: 'section1' });
    setActiveTab('write');
  };

  // About 페이지 업데이트
  const handleUpdateAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/pages/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'about', content: aboutContent }),
      });
      if (res.ok) {
        alert('About 페이지가 업데이트되었습니다!');
      } else {
        alert('업데이트 실패');
      }
    } catch (error) {
      alert('에러 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 테스트 페이지 업데이트
  const handleUpdateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/pages/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'test', content: testContent }),
      });
      if (res.ok) {
        alert('테스트 페이지가 업데이트되었습니다!');
      } else {
        alert('업데이트 실패');
      }
    } catch (error) {
      alert('에러 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 진행률 상태
  const [loadingProgress, setLoadingProgress] = useState(13);

  // 로딩 애니메이션
  useEffect(() => {
    if (status === 'loading') {
      const timer1 = setTimeout(() => setLoadingProgress(45), 300);
      const timer2 = setTimeout(() => setLoadingProgress(75), 600);
      const timer3 = setTimeout(() => setLoadingProgress(90), 900);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [status]);

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--menu-main)' }}>
          관리자 페이지
        </h1>
        <Progress value={loadingProgress} className="w-[60%] max-w-md" />
        <p className="text-sm opacity-60">로딩 중...</p>
      </div>
    );
  }

  // 로그인 핸들러
  const handleLogin = () => {
    setIsLoggingIn(true);
    // signIn은 페이지를 리다이렉트하므로 await 사용하지 않음
    // 모바일에서 리다이렉트가 제대로 동작하도록 함
    signIn('github', {
      callbackUrl: '/admin',
      redirect: true,
    });
  };

  // 로그인 안 됨
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--menu-main)' }}>
          관리자 페이지
        </h1>
        <p className="text-lg opacity-70">로그인이 필요합니다</p>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="px-8 py-3 rounded-lg font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--menu-main)' }}
        >
          {isLoggingIn ? '로그인 중...' : 'GitHub으로 로그인'}
        </button>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs opacity-50 mt-4">
            환경변수 확인: GITHUB_ID={process.env.NEXT_PUBLIC_GITHUB_ID ? '설정됨' : '미설정'}
          </p>
        )}
      </div>
    );
  }

  // 로그인 됨
  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--menu-main)' }}>
            관리자 페이지
          </h1>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
            Admin
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded-lg text-sm opacity-60 hover:opacity-100"
        >
          로그아웃
        </button>
      </div>

      <p className="mb-6 opacity-60">환영합니다, {session.user?.name}님</p>

      {/* 탭 네비게이션 */}
      <div className="mb-8">
        <div
          className="flex gap-2 p-1.5 rounded-lg inline-flex"
          style={{ backgroundColor: 'var(--menu-main)' }}
        >
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list' ? 'shadow-md' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'list' ? 'var(--menu-sub)' : 'transparent',
              color: activeTab === 'list' ? 'var(--menu-sub-text)' : 'var(--menu-main-text)',
            }}
          >
            글 목록
          </button>
          <button
            onClick={startNewPost}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'write' ? 'shadow-md' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'write' ? 'var(--menu-sub)' : 'transparent',
              color: activeTab === 'write' ? 'var(--menu-sub-text)' : 'var(--menu-main-text)',
            }}
          >
            새 글 작성
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'about' ? 'shadow-md' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'about' ? 'var(--menu-sub)' : 'transparent',
              color: activeTab === 'about' ? 'var(--menu-sub-text)' : 'var(--menu-main-text)',
            }}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'test' ? 'shadow-md' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeTab === 'test' ? 'var(--menu-sub)' : 'transparent',
              color: activeTab === 'test' ? 'var(--menu-sub-text)' : 'var(--menu-main-text)',
            }}
          >
            테스트
          </button>
        </div>
      </div>

      {/* 글 작성/수정 탭 */}
      {activeTab === 'write' && (
        <div className="mb-12 p-6 rounded-lg border" style={{ borderColor: 'var(--menu-main)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--menu-main)' }}>
            {editingPost ? '글 수정' : '새 글 작성'}
          </h2>
          <form onSubmit={editingPost ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="relative calendar-container">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 flex items-center justify-between"
                    style={{ borderColor: 'var(--menu-main)' }}
                  >
                    <span>{selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '날짜 선택'}</span>
                    <CalendarIcon size={16} />
                  </button>

                  {showCalendar && (
                    <div className="absolute top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg border-2 p-4 shadow-xl calendar-popup"
                      style={{ borderColor: 'var(--menu-main)' }}
                    >
                      <style jsx>{`
                        .calendar-popup :global([aria-selected="true"]) {
                          background-color: var(--menu-main) !important;
                          color: white !important;
                        }
                      `}</style>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setShowCalendar(false);
                        }}
                        className="rounded-lg"
                      />
                    </div>
                  )}

                  <input
                    name="date"
                    type="hidden"
                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  섹션 <span className="text-red-500">*</span>
                </label>
                <select
                  name="section"
                  required
                  defaultValue={editContent.section}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  style={{ borderColor: 'var(--menu-main)' }}
                >
                  <option value="">섹션 선택</option>
                  <option value="section1">Section 1</option>
                  <option value="section2">Section 2</option>
                  <option value="section3">Section 3</option>
                </select>
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
                    setActiveTab('list');
                    setEditingPost(null);
                    setEditContent({ title: '', description: '', summary: '', tags: '', content: '', date: new Date().toISOString().split('T')[0], section: 'section1' });
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

      {/* 글 목록 탭 */}
      {activeTab === 'list' && (
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

      {/* About 탭 */}
      {activeTab === 'about' && (
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--menu-main)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--menu-main)' }}>
            About 페이지 편집
          </h2>
          <form onSubmit={handleUpdateAbout} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">제목</label>
              <input
                type="text"
                value={aboutContent.title}
                onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">첫 번째 문단</label>
              <textarea
                value={aboutContent.intro}
                onChange={(e) => setAboutContent({ ...aboutContent, intro: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">주요 주제 (3개)</label>
              {aboutContent.topics.map((topic, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    const newTopics = [...aboutContent.topics];
                    newTopics[idx] = e.target.value;
                    setAboutContent({ ...aboutContent, topics: newTopics });
                  }}
                  placeholder={`주제 ${idx + 1}`}
                  className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
                  style={{ borderColor: 'var(--menu-main)' }}
                />
              ))}
            </div>

            <div>
              <label className="block mb-2 font-medium">마지막 문단</label>
              <textarea
                value={aboutContent.outro}
                onChange={(e) => setAboutContent({ ...aboutContent, outro: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--menu-main)' }}
            >
              {isSubmitting ? '저장 중...' : 'About 페이지 저장'}
            </button>
          </form>
        </div>
      )}

      {/* 테스트 탭 */}
      {activeTab === 'test' && (
        <div className="p-6 rounded-lg border" style={{ borderColor: 'var(--menu-main)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--menu-main)' }}>
            테스트 페이지 편집
          </h2>
          <form onSubmit={handleUpdateTest} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">제목</label>
              <input
                type="text"
                value={testContent.title}
                onChange={(e) => setTestContent({ ...testContent, title: e.target.value })}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">색상 테스트 설명</label>
              <textarea
                value={testContent.description}
                onChange={(e) => setTestContent({ ...testContent, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">메인 색상 설명</label>
              <input
                type="text"
                value={testContent.mainColorDesc}
                onChange={(e) => setTestContent({ ...testContent, mainColorDesc: e.target.value })}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">서브 색상 설명</label>
              <input
                type="text"
                value={testContent.subColorDesc}
                onChange={(e) => setTestContent({ ...testContent, subColorDesc: e.target.value })}
                className="w-full px-4 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--menu-main)' }}
            >
              {isSubmitting ? '저장 중...' : '테스트 페이지 저장'}
            </button>
          </form>
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