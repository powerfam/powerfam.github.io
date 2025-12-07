# 프로젝트 스키마 및 구조 문서
**작성일:** 2025-12-07

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [디렉토리 구조](#디렉토리-구조)
4. [주요 기능](#주요-기능)
5. [API 엔드포인트](#api-엔드포인트)
6. [컴포넌트 구성](#컴포넌트-구성)
7. [데이터 모델](#데이터-모델)
8. [스타일링 시스템](#스타일링-시스템)
9. [빌드 및 배포](#빌드-및-배포)

---

## 프로젝트 개요

**voti-blog-nextjs**는 Next.js 14 App Router 기반의 현대적인 블로그 플랫폼입니다. GitHub을 CMS로 활용하며, AI 어시스턴트를 통합하여 콘텐츠 작성을 지원하는 독특한 구조를 가지고 있습니다.

### 핵심 특징
- GitHub 기반 콘텐츠 관리 시스템 (CMS)
- Contentlayer를 활용한 마크다운 처리
- NextAuth.js를 통한 GitHub OAuth 인증
- Claude/GPT AI 어시스턴트 통합
- Framer Motion 기반 애니메이션
- Giscus를 활용한 댓글 시스템
- 반응형 디자인 (모바일/데스크톱)

---

## 기술 스택

### 프레임워크 및 런타임
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.2.33 | 풀스택 React 프레임워크 |
| React | 18 | UI 라이브러리 |
| TypeScript | 5.9.3 | 정적 타입 시스템 |
| Node.js | - | 런타임 환경 |

### 스타일링
| 기술 | 버전 | 용도 |
|------|------|------|
| Tailwind CSS | 3.4.1 | 유틸리티 CSS 프레임워크 |
| @tailwindcss/typography | - | 마크다운 콘텐츠 스타일링 |
| tailwindcss-animate | - | 애니메이션 유틸리티 |
| tailwind-merge | - | 클래스 병합 |
| Noto Serif KR | - | 한글 세리프 폰트 |

### 콘텐츠 관리
| 기술 | 버전 | 용도 |
|------|------|------|
| Contentlayer | 0.3.4 | 마크다운 기반 CMS |
| next-contentlayer | - | Next.js 통합 |
| remark-gfm | - | GitHub Flavored Markdown |
| rehype-raw | - | HTML in Markdown 지원 |

### 인증 및 GitHub 통합
| 기술 | 버전 | 용도 |
|------|------|------|
| NextAuth.js | 4.24.13 | 인증 시스템 |
| @octokit/rest | - | GitHub API 클라이언트 |
| hangul-romanization | - | 한글 로마자 변환 |

### AI 통합
| 기술 | 버전 | 용도 |
|------|------|------|
| @anthropic-ai/sdk | - | Claude AI API |
| OpenAI SDK | - | GPT API |

### 애니메이션 및 UI
| 기술 | 버전 | 용도 |
|------|------|------|
| Framer Motion | 12.23.25 | React 애니메이션 |
| GSAP | 3.13.0 | 고급 애니메이션 |
| Radix UI | - | 접근성 UI 프리미티브 |
| Lucide React | - | 아이콘 라이브러리 |
| date-fns | - | 날짜 포맷팅 |

---

## 디렉토리 구조

```
voti-blog-nextjs/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Route Handlers
│   │   ├── auth/[...nextauth]/   # NextAuth.js 인증
│   │   ├── posts/                # 블로그 포스트 CRUD
│   │   │   ├── create/           # 글 작성
│   │   │   ├── update/           # 글 수정
│   │   │   ├── delete/           # 글 삭제
│   │   │   ├── get/              # 글 조회
│   │   │   ├── list/             # 글 목록
│   │   │   └── upload-image/     # 이미지 업로드
│   │   ├── pages/                # 페이지 콘텐츠 관리
│   │   │   ├── get/              # 페이지 조회
│   │   │   └── update/           # 페이지 업데이트
│   │   └── ai-assistant/         # AI 챗봇 API
│   ├── posts/[slug]/             # 블로그 포스트 상세 페이지
│   ├── admin/                    # 관리자 대시보드
│   ├── about/                    # About 페이지
│   ├── test/                     # 테스트 페이지
│   ├── test_2/                   # 글 목록 페이지
│   ├── fonts/                    # 웹 폰트 파일
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 홈페이지
│   ├── providers.tsx             # Context Providers
│   └── globals.css               # 전역 스타일
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   │   ├── toggle.tsx
│   │   └── toggle-group.tsx
│   ├── Header.tsx                # 네비게이션 헤더
│   ├── TextType.tsx              # 타이핑 애니메이션
│   ├── AIAssistant.tsx           # AI 글쓰기 어시스턴트
│   ├── MarkdownAssistant.tsx     # 마크다운 도움말
│   └── Giscus.tsx                # 댓글 시스템
├── lib/                          # 유틸리티 함수
│   └── utils.ts                  # cn() - 클래스 병합
├── posts/                        # 마크다운 블로그 포스트
├── public/                       # 정적 파일
│   ├── images/                   # 업로드된 이미지
│   ├── movies/                   # 비디오 파일
│   └── cursors/                  # 커스텀 커서
├── types/                        # TypeScript 타입 정의
│   └── next-auth.d.ts            # NextAuth 타입 확장
├── .contentlayer/                # Contentlayer 빌드 파일
│   └── generated/                # JSON 변환 결과
├── contentlayer.config.ts        # Contentlayer 설정
├── next.config.mjs               # Next.js 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # 프로젝트 의존성
└── vercel.json                   # Vercel 배포 설정
```

---

## 주요 기능

### 1. 메인 페이지 (`/`)
**파일:** `app/page.tsx`

**기능:**
- Framer Motion 애니메이션
- 타이핑 효과 (TextType 컴포넌트)
- 배경 비디오 재생
- 모바일/데스크톱 반응형 레이아웃
- 다크모드 자동 전환

### 2. 글 목록 페이지 (`/test_2`)
**파일:** `app/test_2/page.tsx`

**기능:**
- 카드 형태의 그리드 레이아웃
- 썸네일 이미지 자동 추출
- 페이지네이션 (6개씩)
- 태그 표시 및 필터링
- 요약문 (summary) 표시
- 날짜 포맷팅 (date-fns)

### 3. 포스트 상세 페이지 (`/posts/[slug]`)
**파일:** `app/posts/[slug]/page.tsx`

**기능:**
- 동적 라우팅 (generateStaticParams)
- 마크다운 HTML 렌더링
- 좋아요/공유 토글 버튼
- Giscus 댓글 시스템 통합
- 태그 표시
- SEO 메타데이터 자동 생성

### 4. 관리자 페이지 (`/admin`)
**파일:** `app/admin/page.tsx`

**기능:**
- GitHub OAuth 인증 (NextAuth)
- 탭 기반 UI (글 목록/새 글 작성/About/테스트)
- 실시간 마크다운 에디터
- 이미지 업로드 (드래그앤드롭, 클립보드)
- AI 어시스턴트 통합 (Claude/GPT)
- 마크다운 도움말 패널
- 글 작성/수정/삭제 기능
- About 페이지 콘텐츠 편집

**이미지 업로드 기능:**
- 드래그앤드롭 지원
- 클립보드 붙여넣기 (Ctrl+V)
- GitHub에 자동 업로드 (`public/images/`)
- 타임스탬프 기반 파일명 생성
- 마크다운 이미지 문법 자동 삽입

### 5. About 페이지 (`/about`)
**파일:** `app/about/page.tsx`

**기능:**
- API 기반 동적 콘텐츠 로딩
- 관리자 페이지에서 편집 가능
- 마크다운 렌더링

---

## API 엔드포인트

### 인증
| 메서드 | 엔드포인트 | 기능 |
|--------|-----------|------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js 핸들러 (GitHub OAuth) |

### 블로그 포스트
| 메서드 | 엔드포인트 | 기능 |
|--------|-----------|------|
| POST | `/api/posts/create` | 새 글 작성 (GitHub 커밋) |
| PUT | `/api/posts/update` | 기존 글 수정 |
| DELETE | `/api/posts/delete` | 글 삭제 |
| GET | `/api/posts/get` | 특정 글 조회 |
| GET | `/api/posts/list` | 글 목록 조회 |
| POST | `/api/posts/upload-image` | 이미지 GitHub 업로드 |

**파일 작성 로직:**
1. 제목을 한글 로마자로 변환 (`hangul-romanization`)
2. 파일명 생성: `YYYY-MM-DD-{로마자-제목}.md`
3. Frontmatter 생성 (title, date, description, summary, tags)
4. GitHub Octokit API로 `/posts/` 디렉토리에 커밋
5. Contentlayer 자동 빌드 트리거

### 페이지 관리
| 메서드 | 엔드포인트 | 기능 |
|--------|-----------|------|
| GET | `/api/pages/get?page={name}` | 페이지 콘텐츠 조회 |
| POST | `/api/pages/update` | 페이지 콘텐츠 업데이트 |

### AI 어시스턴트
| 메서드 | 엔드포인트 | 기능 |
|--------|-----------|------|
| POST | `/api/ai-assistant` | AI 챗봇 (Claude/GPT) |

**요청 파라미터:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant'
    content: string | { type: 'text' | 'image_url', ... }
  }>,
  model: 'claude-3-5-sonnet-20241022' | 'gpt-4o'
}
```

---

## 컴포넌트 구성

### Header.tsx
**위치:** `components/Header.tsx`

**기능:**
- 반응형 네비게이션 (모바일/데스크톱)
- 다크모드 토글
- 햄버거 메뉴 (모바일)
- 세션 기반 동적 메뉴 (로그인 시 Admin 링크 표시)
- 커스텀 커서 호버 효과

**주요 메뉴:**
- Home (`/`)
- Blog (`/test_2`)
- About (`/about`)
- Admin (`/admin`) - 로그인 시에만 표시

### TextType.tsx
**위치:** `components/TextType.tsx`

**기능:**
- 타이핑 애니메이션 효과
- GSAP 기반 커서 깜빡임
- 다중 텍스트 무한 루프
- 가변 속도 옵션 (`speed`, `delay`)

**Props:**
```typescript
{
  texts: string[]
  speed?: number  // 기본값: 150ms
  delay?: number  // 기본값: 2000ms
}
```

### AIAssistant.tsx
**위치:** `components/AIAssistant.tsx`

**기능:**
- 플로팅 챗봇 UI (우측 하단)
- Claude 3.5 Sonnet / GPT-4o 모델 선택
- 이미지 업로드 지원 (비전 모델)
- 대화 히스토리 관리
- 마크다운 렌더링 (응답 메시지)
- 드래그 가능한 UI

**사용 위치:**
- `/admin` 페이지 (글 작성 지원)

### MarkdownAssistant.tsx
**위치:** `components/MarkdownAssistant.tsx`

**기능:**
- 플로팅 도움말 패널
- 카테고리별 FAQ (기본 문법, 확장 문법, 고급 팁)
- 검색 기능
- 클립보드 복사 버튼
- 접기/펼치기 UI

**지원 문법:**
- 기본: 제목, 강조, 링크, 코드
- 확장: 테이블, 체크박스, 각주
- 고급: 수학 공식, 다이어그램, 접기 영역

### Giscus.tsx
**위치:** `components/Giscus.tsx`

**기능:**
- GitHub Discussions 기반 댓글
- 다크모드 자동 전환
- useEffect 기반 동적 스크립트 로딩

**설정:**
```typescript
{
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID
}
```

---

## 데이터 모델

### Contentlayer 스키마
**파일:** `contentlayer.config.ts`

```typescript
defineDocumentType({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      required: true
    },
    date: {
      type: 'date',
      required: true
    },
    description: {
      type: 'string',
      required: false
    },
    summary: {
      type: 'string',
      required: false
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      required: false
    }
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`
    }
  }
})
```

### 마크다운 파일 예시
```markdown
---
title: "블로그 포스트 제목"
date: "2025-12-07"
description: "포스트 설명"
summary: "짧은 요약문"
tags: ["Next.js", "React", "TypeScript"]
---

# 포스트 내용

마크다운으로 작성된 본문...
```

### GitHub 파일 구조
```
posts/
├── 2025-12-05-weppeiji-gaebal-hwangyeong-seting.md
├── 2025-12-04-dareun-geul.md
└── ...

public/images/
├── 1764915546103-image.png
├── 1764909974192-screenshot.png
└── ...
```

---

## 스타일링 시스템

### CSS 변수 시스템
**파일:** `app/globals.css`

#### 라이트 모드
```css
:root {
  --background: #FAF9F5;        /* 아이보리 */
  --foreground: #3B3C36;        /* 어두운 회색 */
  --menu-main: #826644;         /* 브라운 */
  --menu-sub: #D99058;          /* 오렌지 */
}
```

#### 다크 모드
```css
.dark {
  --background: #3B3C36;        /* 어두운 회색 */
  --foreground: #e5e5e5;        /* 밝은 회색 */
  --menu-main: #D99058;         /* 오렌지 */
  --menu-sub: #826644;          /* 브라운 */
}
```

### Tailwind 설정
**파일:** `tailwind.config.ts`

```typescript
{
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'menu-main': 'var(--menu-main)',
        'menu-sub': 'var(--menu-sub)'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            h1: { fontSize: '1.875rem' },
            h2: { fontSize: '1.5rem' },
            // 모바일 최적화
          }
        }
      }
    }
  }
}
```

### 커스텀 커서
**파일:** `public/cursors/`

```
light_cursor.png    # 라이트 모드 커서
dark_cursor.png     # 다크 모드 커서
```

**적용 방식:**
```css
body {
  cursor: url('/cursors/light_cursor.png'), auto;
}

.dark body {
  cursor: url('/cursors/dark_cursor.png'), auto;
}
```

### 반응형 디자인
- **모바일**: `prose` 클래스 헤딩 사이즈 축소
- **데스크톱**: 전체 너비 레이아웃
- **햄버거 메뉴**: 768px 이하에서 활성화

---

## 빌드 및 배포

### Next.js 설정
**파일:** `next.config.mjs`

```javascript
import { withContentlayer } from 'next-contentlayer'

export default withContentlayer({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      }
    ]
  }
})
```

### Vercel 배포 설정
**파일:** `vercel.json`

```json
{
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": true
  }
}
```

**배포 트리거:**
- `main` 브랜치에 푸시 시 자동 배포

### 환경 변수
**파일:** `.env.local` (예시: `.env.example`)

```env
# GitHub OAuth
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret

# GitHub API
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_TOKEN=your_github_personal_access_token

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Giscus (댓글)
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id

# AI APIs
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 빌드 스크립트
**파일:** `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**빌드 프로세스:**
1. Contentlayer: 마크다운 → JSON 변환
2. Next.js: 정적 페이지 생성
3. Vercel: 자동 배포

---

## 주요 파일 경로 참조

### 설정 파일
- Next.js: `next.config.mjs`
- Tailwind: `tailwind.config.ts`
- Contentlayer: `contentlayer.config.ts`
- TypeScript: `tsconfig.json`
- Vercel: `vercel.json`

### 핵심 페이지
- 메인: `app/page.tsx`
- 관리자: `app/admin/page.tsx`
- 포스트: `app/posts/[slug]/page.tsx`
- 목록: `app/test_2/page.tsx`
- About: `app/about/page.tsx`

### 핵심 컴포넌트
- 헤더: `components/Header.tsx`
- AI 어시스턴트: `components/AIAssistant.tsx`
- 마크다운 도움말: `components/MarkdownAssistant.tsx`
- 타이핑 효과: `components/TextType.tsx`
- 댓글: `components/Giscus.tsx`

### 스타일
- 전역 CSS: `app/globals.css`
- 유틸리티: `lib/utils.ts`

---

## 개발 워크플로우

### 로컬 개발
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버
npm start
```

### 새 글 작성 프로세스
1. `/admin` 페이지 접속 (GitHub 로그인)
2. "새 글 작성" 탭 선택
3. 제목, 설명, 요약, 태그, 본문 입력
4. 이미지 업로드 (드래그앤드롭 또는 붙여넣기)
5. AI 어시스턴트로 콘텐츠 보완 (선택)
6. "작성 완료" 버튼 클릭
7. GitHub에 자동 커밋
8. Contentlayer 자동 빌드
9. `/test_2`에서 새 글 확인

### 기존 글 수정 프로세스
1. `/admin` 페이지 "글 목록" 탭
2. 수정할 글 선택
3. 내용 수정
4. "수정 완료" 버튼 클릭
5. GitHub 파일 업데이트

---

## 향후 개선 가능 영역

### 기능
- [ ] 카테고리 시스템 구현
- [ ] 태그별 필터링 페이지
- [ ] 검색 기능 (Algolia/Fuse.js)
- [ ] RSS 피드 생성
- [ ] 이미지 최적화 (next/image)
- [ ] 글 드래프트 기능

### 성능
- [ ] ISR (Incremental Static Regeneration) 적용
- [ ] 이미지 lazy loading
- [ ] 번들 사이즈 최적화

### UX/UI
- [ ] 읽기 시간 표시
- [ ] 목차 (TOC) 자동 생성
- [ ] 코드 블록 복사 버튼
- [ ] 공유 기능 강화 (SNS 링크)

---

**문서 버전:** 1.0
**최종 수정:** 2025-12-07
**작성자:** Claude Code (AI Assistant)
