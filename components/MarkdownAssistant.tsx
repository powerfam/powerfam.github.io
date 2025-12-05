'use client';

import { useState } from 'react';
import { HelpCircleIcon, SearchIcon, XIcon, ChevronDownIcon } from 'lucide-react';

interface FAQ {
  category: string;
  question: string;
  answer: string;
  example: string;
}

const faqs: FAQ[] = [
  // 기본 서식
  {
    category: '기본',
    question: '제목 만들기',
    answer: '# 큰 제목\n## 중간 제목\n### 작은 제목',
    example: '# 제목\n## 부제목\n### 소제목'
  },
  {
    category: '기본',
    question: '굵게/기울임',
    answer: '**굵게** *기울임* ***굵게+기울임***',
    example: '**중요한 내용**입니다.'
  },
  {
    category: '기본',
    question: '취소선',
    answer: '~~취소선~~',
    example: '~~잘못된 내용~~'
  },
  {
    category: '기본',
    question: '인용문',
    answer: '> 인용문 내용',
    example: '> 명언이나 인용할 때 사용'
  },
  
  // 목록
  {
    category: '목록',
    question: '순서 없는 목록',
    answer: '- 항목 1\n- 항목 2\n  - 하위 항목',
    example: '- 첫 번째\n- 두 번째\n  - 세부 항목'
  },
  {
    category: '목록',
    question: '순서 있는 목록',
    answer: '1. 첫 번째\n2. 두 번째\n3. 세 번째',
    example: '1. 준비\n2. 실행\n3. 완료'
  },
  {
    category: '목록',
    question: '체크리스트',
    answer: '- [ ] 할 일\n- [x] 완료',
    example: '- [ ] 작성하기\n- [x] 검토 완료'
  },
  
  // 링크
  {
    category: '링크',
    question: '링크 삽입',
    answer: '[텍스트](URL)',
    example: '[구글](https://google.com)'
  },
  {
    category: '링크',
    question: '이미지 삽입',
    answer: '![설명](이미지URL)',
    example: '![로고](https://example.com/logo.png)'
  },
  {
    category: '링크',
    question: '이메일 링크',
    answer: '[이메일 보내기](mailto:email@example.com)',
    example: '[문의하기](mailto:support@example.com)'
  },
  
  // 이미지 크기
  {
    category: '이미지',
    question: '이미지 작게',
    answer: '<img src="URL" alt="설명" width="200" />',
    example: '<img src="logo.png" alt="로고" width="200" />'
  },
  {
    category: '이미지',
    question: '이미지 중간',
    answer: '<img src="URL" alt="설명" width="500" />',
    example: '<img src="chart.png" alt="차트" width="500" />'
  },
  {
    category: '이미지',
    question: '이미지 크게',
    answer: '<img src="URL" alt="설명" width="800" />',
    example: '<img src="screenshot.png" alt="화면" width="800" />'
  },
  {
    category: '이미지',
    question: '이미지 가운데 정렬',
    answer: '<div style="text-align: center;">\n  <img src="URL" alt="설명" width="500" />\n</div>',
    example: '<div style="text-align: center;">\n  <img src="image.png" alt="그림" width="500" />\n</div>'
  },
  
  // 코드
  {
    category: '코드',
    question: '인라인 코드',
    answer: '`코드`',
    example: '변수 `name`을 사용합니다.'
  },
  {
    category: '코드',
    question: '코드 블록',
    answer: '```\n코드 내용\n```',
    example: '```javascript\nconst hello = "world";\n```'
  },
  
  // 구분선
  {
    category: '레이아웃',
    question: '구분선',
    answer: '---',
    example: '---'
  },
  {
    category: '레이아웃',
    question: '줄바꿈',
    answer: '엔터 2번 누르기',
    example: '첫 문장\n\n두 번째 문장'
  },
  
  // 표
  {
    category: '표',
    question: '표 만들기',
    answer: '| 제목1 | 제목2 |\n|------|------|\n| 내용1 | 내용2 |',
    example: '| 이름 | 나이 |\n|------|------|\n| 홍길동 | 30 |'
  },
  
  // 고급
  {
    category: '고급',
    question: '주석 (안 보이는 메모)',
    answer: '<!-- 주석 내용 -->',
    example: '<!-- 나중에 수정 필요 -->'
  },
  {
    category: '고급',
    question: '색상 텍스트',
    answer: '<span style="color: red;">빨간 글씨</span>',
    example: '<span style="color: #D99058;">강조</span>'
  },
  {
    category: '고급',
    question: '중앙 정렬 텍스트',
    answer: '<div style="text-align: center;">내용</div>',
    example: '<div style="text-align: center;">제목</div>'
  },
];

export default function MarkdownAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = ['전체', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        style={{ backgroundColor: 'var(--menu-main)' }}
        aria-label="마크다운 도움말"
      >
        {isOpen ? (
          <XIcon size={24} style={{ color: 'var(--menu-main-text)' }} />
        ) : (
          <HelpCircleIcon size={24} style={{ color: 'var(--menu-main-text)' }} />
        )}
      </button>

      {/* 어시스턴트 패널 */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-96 max-h-[600px] rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col"
          style={{ backgroundColor: 'var(--background)', border: '2px solid var(--menu-main)' }}
        >
          {/* 헤더 */}
          <div className="p-4 border-b" style={{ backgroundColor: 'var(--menu-main)', color: 'var(--menu-main-text)' }}>
            <h3 className="text-lg font-bold">📝 Markdown Assistant</h3>
            <p className="text-xs opacity-80 mt-1">원하는 서식을 검색해보세요</p>
          </div>

          {/* 검색 */}
          <div className="p-3 border-b">
            <div className="relative">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                placeholder="예: 제목, 이미지, 링크..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--menu-main)' }}
              />
            </div>
          </div>

          {/* 카테고리 */}
          <div className="px-3 py-2 border-b">
            <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                    style={{
                    backgroundColor: selectedCategory === cat ? 'var(--menu-sub)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--menu-sub-text)' : 'var(--foreground)',
                    border: selectedCategory === cat ? 'none' : '1px solid var(--menu-main)'
                    }}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>

          {/* FAQ 목록 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {filteredFaqs.length === 0 ? (
              <p className="text-center py-8 opacity-60 text-sm">검색 결과가 없습니다</p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: 'var(--menu-main)' }}
                >
                  <summary className="px-3 py-2 cursor-pointer hover:bg-opacity-50 font-medium text-sm flex items-center justify-between"
                    style={{ backgroundColor: 'rgba(130, 102, 68, 0.1)' }}
                  >
                    <span>{faq.question}</span>
                    <ChevronDownIcon size={16} />
                  </summary>
                  <div className="p-3 space-y-2">
                    <div>
                      <p className="text-xs opacity-60 mb-1">사용법:</p>
                      <pre 
                        className="text-xs p-2 rounded overflow-x-auto cursor-pointer hover:bg-opacity-70"
                        style={{ backgroundColor: 'rgba(130, 102, 68, 0.1)' }}
                        onClick={() => copyToClipboard(faq.answer)}
                      >
                        <code>{faq.answer}</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs opacity-60 mb-1">예시:</p>
                      <pre 
                        className="text-xs p-2 rounded overflow-x-auto"
                        style={{ backgroundColor: 'rgba(217, 144, 88, 0.1)' }}
                      >
                        <code>{faq.example}</code>
                      </pre>
                    </div>
                    <button
                      onClick={() => copyToClipboard(faq.answer)}
                      className="w-full py-1.5 rounded text-xs font-medium"
                      style={{ backgroundColor: 'var(--menu-sub)', color: 'var(--menu-sub-text)' }}
                    >
                      복사하기
                    </button>
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}