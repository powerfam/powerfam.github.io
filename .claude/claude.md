# Voti Website - Next.js 프로젝트 가이드

**최종 업데이트:** 2025-12-10 (SOTD 기능 완성 및 ReadingProgress 추가)
**프로젝트:** voti-blog-nextjs

---

## 🚨 재부팅 후 확인 필요 (2025-12-10)

### WSL 서버 문제
WSL + Windows 파일 시스템 I/O 문제로 서버 시작이 매우 느림.

**재부팅 후 서버 시작 절차:**
```bash
# 1. 기존 프로세스 정리
pkill -9 -f node
rm -rf .next

# 2. 서버 시작
npm run dev

# 3. 첫 컴파일 완료까지 약 3-5분 대기
# "Ready in XXXs" 메시지 확인 후 테스트
```

**테스트할 페이지:**
- http://localhost:3000 (홈페이지)
- http://localhost:3000/sotd (SOTD 페이지 - ✨ 새로 추가됨)
- http://localhost:3000/articles
- http://localhost:3000/posts/[slug] (ReadingProgress 확인)

---

## 프로젝트 개요

Next.js 14 App Router 기반의 플랫폼입니다. GitHub을 CMS로 활용하며, AI 어시스턴트가 통합되어 있습니다.

### 핵심 특징
- ✅ GitHub 기반 콘텐츠 관리 (Contentlayer + Octokit)
- ✅ NextAuth.js GitHub OAuth 인증
- ✅ Claude/GPT AI 어시스턴트
- ✅ Firebase 실시간 댓글 시스템
- ✅ Framer Motion 애니메이션
- ✅ 완전한 다크모드 지원
- ✅ 모바일 최적화 반응형 디자인
- ✅ SOTD - 스토아 철학 명언 카드 (이미지 생성 & 공유)

---

## 최근 업데이트 (2025-12-10) ✨

### 1. SOTD (Stoic of Today) 페이지 추가 🎨
**파일:** `app/sotd/page.tsx`, `data/stoic-quotes.json`

**새로운 독립 페이지 - 스토아 철학 명언 카드**

#### 1-1. 핵심 기능
- ✅ **랜덤 명언 표시**: 50개 이상의 스토아 철학 명언
- ✅ **이중 언어 지원**: KR/ENG 토글 (아이콘만 표시)
- ✅ **철학자 배경 이미지**:
  - 카드 배경에 철학자 초상화 배치
  - 투명도 조절 (라이트: 10%, 다크: 15%)
  - 위키미디어 이미지 사용 (8명의 철학자)
  - 이미지 preload로 부드러운 전환
- ✅ **아름다운 카드 디자인**:
  - 둥근 모서리 (rounded-2xl)
  - 테두리 및 헤더 바 (menu-main 색상)
  - 반응형 텍스트 크기 및 줄 간격
  - 다크모드 완벽 대응

#### 1-2. 이미지 기능 (공유 & 저장)
- ✅ **다운로드 옵션**:
  - 1:1 비율 (Square) - 일반 SNS
  - 9:16 비율 (Story) - 인스타그램 스토리
  - 드롭다운 메뉴로 사이즈 선택
- ✅ **공유 기능**:
  - Web Share API 지원
  - 이미지 파일과 텍스트 함께 공유
  - 미지원 브라우저는 다운로드 메뉴 표시
- ✅ **이미지 생성 로직**:
  - Canvas API로 고품질 PNG 생성
  - 폰트 preload로 렌더링 안정성 확보
  - 웹 카드와 동일한 디자인 (일관성)
  - 철학자 배경 이미지 포함
  - 워터마크 표시 ("Stoic of Today | Voti Web")

#### 1-3. UI/UX 개선
- ✅ **아이콘 전용 버튼**:
  - 새 명언: RefreshCw 아이콘
  - 복사: Copy/Check 아이콘 (전환 애니메이션)
  - 다운로드: Download 아이콘 + 드롭다운
  - 공유: Send 아이콘
  - 텍스트 제거, title 속성으로 툴팁 제공
- ✅ **애니메이션**:
  - Framer Motion으로 카드 전환 효과
  - 새 명언 버튼 회전 애니메이션
  - 다운로드 메뉴 fade-in/scale 애니메이션
  - 호버 시 버튼 확대 (scale-110)

#### 1-4. 데이터 구조
**파일:** `data/stoic-quotes.json`
```json
{
  "philosophers": {
    "Marcus Aurelius": "이미지URL",
    "Seneca": "이미지URL",
    // ... 8명의 철학자
  },
  "quotes": [
    {
      "id": 1,
      "author": "Marcus Aurelius",
      "authorKr": "마르쿠스 아우렐리우스",
      "text": "영어 명언",
      "textKr": "한국어 명언"
    }
    // ... 50개의 명언
  ]
}
```

### 2. ReadingProgress 컴포넌트 추가 📊
**파일:** `components/ReadingProgress.tsx`

**글 읽기 진행률을 시각화하는 progress bar**

#### 2-1. 주요 기능
- ✅ **스크롤 기반 진행률 계산**:
  - `<article>` 태그 기준으로 진행률 측정
  - 글 시작 전: 0%, 진행 중: 0-100%, 완료: 100%
  - 실시간 업데이트 (스크롤 이벤트)
- ✅ **자동 표시/숨김**:
  - 글 영역 도달 전: 숨김 (opacity-0)
  - 글 읽기 중: 표시 (opacity-100)
  - 부드러운 전환 애니메이션 (duration-300)
- ✅ **고정 위치**: 화면 최상단 (fixed top-0)
- ✅ **테마 색상 적용**:
  - 배경: `var(--background)`
  - 진행 바: `var(--menu-main)`
  - 다크모드 자동 대응

#### 2-2. 성능 최적화
- passive 이벤트 리스너 (스크롤 성능 향상)
- resize 이벤트도 감지 (반응형 대응)
- 부드러운 애니메이션 (transition-all duration-150)

#### 2-3. 사용 위치
- `app/posts/[slug]/page.tsx` - 글 상세 페이지
- 모든 블로그 포스트에서 자동 작동

### 3. 404 페이지 버그 수정 🐛
**커밋:** `3424f2f - SOTD & 404 bug fixed`

- 404 에러 페이지 라우팅 이슈 해결
- 존재하지 않는 경로 접근 시 올바른 fallback 페이지 표시

---

## 이전 업데이트 (2025-12-09)

### 1. Firebase 댓글 시스템 보안 강화 🔒
**파일:** `components/FirebaseComments.tsx`, `lib/comments.ts`, `lib/firebase.ts`, `firestore.rules`

#### 1-1. XSS 방지 (Cross-Site Scripting)
- ✅ **DOMPurify 설치 및 적용**
  - 모든 사용자 입력(댓글 내용, 작성자 이름) 새니타이징
  - HTML 태그 완전 제거 (텍스트만 허용)
  - `<script>alert('XSS')</script>` → 텍스트로 표시

#### 1-2. Rate Limiting (스팸 방지)
- ✅ **30초 제한**: 댓글 연속 작성 방지
- ✅ **Firestore Rules 강화**: `<script>` 패턴 차단
- ✅ **userActivity 컬렉션**: 마지막 댓글 작성 시간 추적
- 효과: "너무 빠르게 댓글을 작성하고 있습니다. N초 후에 다시 시도해주세요."

#### 1-3. 성능 최적화 (비용 절감)
- ✅ **실시간 구독 → SWR 전환**
  - 기존: 모든 방문자가 실시간 리스너 생성 (읽기 비용 높음)
  - 개선: 30초마다 자동 갱신 + 브라우저 캐싱
  - Firestore 읽기 비용 대폭 절감
- ✅ **Firestore 인덱스 정의**
  - `postSlug + createdAt`
  - `postSlug + parentId + createdAt`

#### 1-4. Firebase App Check 구현 (코드 완료)
- ✅ **코드 구현 완료** (`lib/firebase.ts`)
- ✅ **Firestore Rules 업데이트** (`firestore.rules`)
- ⚠️ **설정 필요** (Vercel 도메인 활성화 후)
  - reCAPTCHA v3 사이트 키 발급
  - Firebase Console 설정
  - 무료 플랜: 월 10,000회 검증 무료

**상세 가이드:** `FIREBASE_APP_CHECK_SETUP.md`

### 2. Featured Post 개선
**파일:** `app/articles/page.tsx`

- ✅ **요약문 타이핑 효과**: TextType 컴포넌트로 한 글자씩 타이핑 (loop=false, 유지)
- ✅ **태그 마키 애니메이션**: 주식 거래소 스타일 자동 스크롤
  - 태그가 좌측으로 흐르며 무한 반복
  - 호버 시 애니메이션 일시정지
  - 15초 주기 linear 애니메이션
- ✅ **Latest 라벨 조건부 표시**: 1페이지에서만 표시
- ✅ **Grid Posts 태그 제거**: 하위 3개 글에서 태그 숨김 (Featured만 표시)
- ✅ **스켈레톤 로딩 UI**: 초기 로딩 및 섹션 전환 시 표시

### 3. 읽기 시간 표기 변경
**파일:** `app/posts/[slug]/page.tsx`

- "2분 읽기" → "읽는 시간 : 2분"

---

## 이전 업데이트 (2025-12-08)

### Articles 페이지 개선
**파일:** `app/articles/page.tsx`, `app/articles/tags/page.tsx`

#### 1. Section 메뉴 디자인 변경
- **이전:** 탭 형태 + border-bottom
- **현재:** 다크모드 토글과 동일한 둥근 캡슐 형태
- **스타일:**
  - 각 섹션 버튼이 독립적인 배경색 (`var(--menu-main)`)
  - 활성 버튼: `var(--menu-sub)` + shadow-md
  - 테두리 제거로 깔끔한 UI
  - 모바일: `text-xs`, 데스크톱: `text-sm`

#### 2. Tags 버튼 통합
- **위치:** Section 메뉴와 같은 row에 우측 정렬 (`justify-between`)
- **디자인:** Section 메뉴와 동일한 높이 및 폰트 크기
- **모바일:** `flex-wrap`으로 자동 줄바꿈

#### 3. Tags 페이지 (버블 클라우드)
**파일:** `app/articles/tags/page.tsx`

**개선 사항:**
- ✅ "#" 기호 및 글 개수 제거 (깔끔한 디스플레이)
- ✅ 긴 단어 UI 최적화:
  - `WebkitLineClamp: 2` (최대 2줄)
  - `overflow-hidden` + `text-ellipsis`
  - `maxWidth: '90%'` (원 안 여백 확보)
- ✅ 모바일 최적화:
  - 버블 크기: 40px ~ 100px (모바일), 60px ~ 160px (데스크톱)
  - 버블 간격: radius 35 (모바일), 60 (데스크톱)
  - 컨테이너 높이: 500px (모바일), 800px (데스크톱)
- ✅ 애니메이션 개선:
  - delay: `index * 0.02`
  - duration: `0.6초`
  - 모든 버블에 일관된 애니메이션 적용

**Zoom 기능:**
- **UI:** 우측 하단 고정 슬라이더
- **컴포넌트:** shadcn Slider (`@radix-ui/react-slider`)
- **범위:** 0.5배 ~ 2배
- **디자인:**
  - 반투명 브라운 배경 (`rgba(130, 102, 68, 0.9)`)
  - ZoomIn/ZoomOut 아이콘
  - 프로젝트 컬러 스킴 적용

---

## 기술 스택

### 코어
- **Next.js:** 14.2.33 (App Router)
- **React:** 18
- **TypeScript:** 5.9.3

### 스타일링
- **Tailwind CSS:** 3.4.1
- **Framer Motion:** 12.23.25
- **Radix UI:** Slider, Toggle 등
- **Lucide React:** 아이콘

### 콘텐츠 관리
- **Contentlayer:** 0.3.4 (MDX → JSON)
- **remark-gfm:** GitHub Flavored Markdown
- **rehype-raw:** HTML in Markdown

### 백엔드
- **NextAuth.js:** 4.24.13 (GitHub OAuth)
- **Firebase:** 11.0.2 (Firestore 댓글)
- **Octokit:** GitHub API 클라이언트

### AI
- **Anthropic SDK:** Claude API
- **OpenAI SDK:** GPT API

### 기타
- **Canvas API:** SOTD 이미지 생성
- **Web Share API:** SOTD 공유 기능
- **Lucide React:** 0.468.0 (아이콘)

---

## 디렉토리 구조

```
voti-blog-nextjs/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/[...nextauth]/ # NextAuth
│   │   ├── posts/              # 글 CRUD
│   │   ├── pages/              # 페이지 관리
│   │   └── ai-assistant/       # AI 챗봇
│   ├── articles/               # Articles 페이지
│   │   ├── page.tsx            # Section별 글 목록
│   │   └── tags/
│   │       └── page.tsx        # 태그 버블 클라우드
│   ├── sotd/                   # ✨ SOTD 페이지
│   │   └── page.tsx            # Stoic of Today
│   ├── posts/[slug]/           # 글 상세
│   ├── admin/                  # 관리자 대시보드
│   ├── about/                  # About 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈
│   ├── providers.tsx           # Context
│   └── globals.css             # 전역 CSS
├── components/
│   ├── ui/                     # shadcn 컴포넌트
│   │   ├── slider.tsx          # Radix Slider
│   │   ├── toggle.tsx
│   │   ├── calendar.tsx
│   │   └── progress.tsx
│   ├── Header.tsx              # 네비게이션
│   ├── AIAssistant.tsx         # AI 챗봇
│   ├── FirebaseComments.tsx    # 댓글
│   ├── GlobalProgress.tsx      # 로딩 바
│   ├── ReadingProgress.tsx     # ✨ 글 읽기 진행률
│   └── RippleEffect.tsx        # 클릭 효과
├── data/                       # ✨ 정적 데이터
│   └── stoic-quotes.json       # SOTD 명언 데이터
├── lib/
│   ├── utils.ts                # cn() 유틸
│   └── firebase.ts             # Firebase 초기화
├── posts/                      # 마크다운 파일
├── public/
│   ├── images/                 # 업로드 이미지
│   └── cursors/                # 커스텀 커서
├── .claude/                    # Claude Code 설정
│   └── claude.md               # 이 파일
├── contentlayer.config.ts
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 코딩 스타일 가이드

### CSS 변수 시스템

**항상 CSS 변수 사용 (하드코딩 금지):**

```typescript
// ✅ 올바른 방법
style={{ backgroundColor: 'var(--menu-main)', color: 'var(--menu-main-text)' }}

// ❌ 잘못된 방법
style={{ backgroundColor: '#826644', color: '#FAF9F5' }}
```

**CSS 변수 목록:**
```css
/* 라이트 모드 */
--background: #FAF9F5;        /* 아이보리 배경 */
--foreground: #3B3C36;        /* 어두운 회색 텍스트 */
--menu-main: #826644;         /* 브라운 (주요 메뉴) */
--menu-sub: #D99058;          /* 오렌지 (서브 메뉴) */
--menu-main-text: #FAF9F5;   /* 메뉴 텍스트 */
--menu-sub-text: #3B3C36;    /* 서브 메뉴 텍스트 */

/* 다크 모드 */
.dark {
  --background: #3B3C36;
  --foreground: #e5e5e5;
  --menu-main: #D99058;       /* 라이트와 반대 */
  --menu-sub: #826644;
  --menu-main-text: #FAF9F5;
  --menu-sub-text: #FAF9F5;
}
```

### 반응형 디자인

**모바일 우선 접근:**
```typescript
// ✅ 올바른 방법
className="text-xs sm:text-sm md:text-base"
className="px-3 sm:px-4 md:px-6"
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// ❌ 데스크톱 우선 (지양)
className="text-base sm:text-sm"
```

**Breakpoints:**
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px

### 레이아웃 통일

**모든 페이지는 `max-w-4xl mx-auto` 컨테이너 사용:**
```typescript
<div className="max-w-4xl mx-auto px-4">
  {/* 페이지 콘텐츠 */}
</div>
```

### 애니메이션

**Framer Motion 사용:**
```typescript
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* 콘텐츠 */}
</motion.div>
```

**CSS 애니메이션 (간단한 경우):**
```typescript
className="transition-all duration-300 hover:opacity-80"
```

---

## 주요 컴포넌트

### Header.tsx
- 네비게이션 (About, 테스트, Articles, SOTD, Admin)
- 다크모드 토글 (View Transitions API)
- 모바일 햄버거 메뉴
- 세션 기반 동적 메뉴

### SOTD Page (app/sotd/page.tsx) ✨
**스토아 철학 명언 카드 페이지**

- **랜덤 명언**: 새로고침 버튼으로 랜덤 명언 표시
- **언어 전환**: KR/ENG 토글 (아이콘만)
- **철학자 배경**: 투명도 조절된 초상화 배경
- **복사 기능**: 명언 + 저자를 클립보드에 복사
- **이미지 다운로드**:
  - 1:1 비율 (일반 SNS)
  - 9:16 비율 (인스타그램 스토리)
- **공유 기능**: Web Share API (모바일 최적화)
- **애니메이션**: Framer Motion 카드 전환
- **데이터**: `data/stoic-quotes.json` (50개 명언, 8명 철학자)

### Articles Page (app/articles/page.tsx)
- **Section 탭:** Section 1, 2, 3 필터링
- **Tags 버튼:** `/articles/tags`로 이동
- **Featured Post:** 최신 글 대형 카드
- **Grid Posts:** 3열 그리드 (나머지 글)
- **페이지네이션:** 4개씩 (Featured 1 + Grid 3)

### Tags Page (app/articles/tags/page.tsx)
- **버블 클라우드:** 태그를 원형 버블로 시각화
- **크기:** 태그별 글 개수에 비례
- **색상:** 해시 기반 일관된 컬러 (다크모드 대응)
- **Zoom:** 우측 하단 슬라이더 (0.5x ~ 2x)
- **모바일 최적화:** 버블 크기 및 간격 조정

### GlobalProgress.tsx
- 페이지 전환 시 자동 표시
- 수동 제어 API:
  ```typescript
  import { globalLoading } from '@/components/GlobalProgress';
  globalLoading.start();
  globalLoading.complete();
  ```

### ReadingProgress.tsx ✨
**글 읽기 진행률 표시 바**

- 화면 최상단 고정 (fixed top-0)
- `<article>` 태그 기준 진행률 측정
- 스크롤 시 실시간 업데이트
- 자동 표시/숨김 (opacity transition)
- 테마 색상 적용 (menu-main)
- Passive 이벤트로 성능 최적화
- 사용: 모든 블로그 포스트 페이지

### AIAssistant.tsx
- 플로팅 챗봇 (우측 하단)
- Claude 3.5 Sonnet / GPT-4o 선택
- 이미지 업로드 (비전 모델)

---

## API 엔드포인트

### 인증
- `GET/POST /api/auth/[...nextauth]` - GitHub OAuth

### 포스트
- `POST /api/posts/create` - 글 작성 (GitHub 커밋)
- `PUT /api/posts/update` - 글 수정
- `DELETE /api/posts/delete` - 글 삭제
- `GET /api/posts/get` - 글 조회
- `GET /api/posts/list` - 글 목록
- `POST /api/posts/upload-image` - 이미지 업로드

### 페이지 관리
- `GET /api/pages/get?page={name}` - 페이지 조회
- `POST /api/pages/update` - 페이지 업데이트

### AI
- `POST /api/ai-assistant` - AI 챗봇

---

## Contentlayer 스키마

**파일:** `contentlayer.config.ts`

```typescript
fields: {
  title: string,           // 필수
  date: date,              // 필수
  description: string,     // 선택
  summary: string,         // 선택 (요약문)
  tags: list<string>,      // 선택 (태그 배열)
  section: string          // 선택 (section1/2/3, 기본값: section1)
}
```

**마크다운 파일 예시:**
```markdown
---
title: "포스트 제목"
date: "2025-12-08"
description: "포스트 설명"
summary: "짧은 요약문"
tags: ["Next.js", "React", "TypeScript"]
section: "section1"
---

# 포스트 내용

마크다운으로 작성...
```

---

## 개발 가이드라인

### 새로운 기능 추가 시

1. **CSS 변수 사용 필수**
   - 하드코딩된 색상 금지
   - 다크모드 자동 대응

2. **모바일 우선 반응형**
   - 모바일에서 먼저 테스트
   - Tailwind breakpoints 활용

3. **레이아웃 통일**
   - `max-w-4xl mx-auto` 컨테이너
   - 일관된 padding/margin

4. **애니메이션**
   - 부드러운 전환 (`transition-all duration-300`)
   - Framer Motion 활용

5. **접근성**
   - Radix UI 프리미티브 사용
   - aria-label 추가

### 파일 수정 시 주의사항

- **globals.css:** CSS 변수 수정 시 라이트/다크 모드 모두 확인
- **Header.tsx:** 메뉴 추가 시 모바일 메뉴도 함께 업데이트
- **contentlayer.config.ts:** 스키마 변경 시 기존 마크다운 파일 호환성 확인

### 금지 사항

- ❌ 하드코딩된 색상 사용
- ❌ 인라인 스타일로 복잡한 로직 작성
- ❌ CSS 변수 없이 테마 색상 사용
- ❌ 모바일 테스트 없이 배포
- ❌ 레이아웃 컨테이너 크기 불일치

---

## 배포 설정

### Vercel
- **브랜치:** `main`
- **자동 배포:** GitHub 푸시 시
- **환경 변수:** `.env.local` (GitHub, NextAuth, Firebase, AI API 키)

### 빌드 프로세스
1. Contentlayer: 마크다운 → JSON
2. Next.js: 정적 페이지 생성
3. Vercel: 자동 배포

---

## 참고 문서

- **전체 스키마:** `project_schema_20251210.md` (최신)
- **이전 스키마:** `project_schema_20251208.md`
- **Next.js 설정:** `next.config.mjs`
- **Tailwind 설정:** `tailwind.config.ts`
- **Contentlayer 설정:** `contentlayer.config.ts`
- **SOTD 데이터:** `data/stoic-quotes.json`

---

## 🚀 Vercel 배포 후 필수 작업

### Firebase App Check 활성화 (보안 필수)
**소요 시간:** 5분
**비용:** 무료 (월 10,000회 검증)
**가이드:** `FIREBASE_APP_CHECK_SETUP.md`

#### 1️⃣ reCAPTCHA v3 사이트 키 발급
```
1. https://www.google.com/recaptcha/admin/create 접속
2. 라벨: voti-blog
3. 유형: reCAPTCHA v3 선택
4. 도메인:
   - localhost
   - your-vercel-domain.vercel.app
   - yourdomain.com (커스텀 도메인 있으면)
5. 사이트 키 복사
```

#### 2️⃣ .env.local 업데이트
```bash
# 주석 해제하고 발급받은 키 입력
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=발급받은_사이트_키
```

#### 3️⃣ Firebase Console 설정
```
1. Firebase Console → voti-blog 프로젝트
2. Build → App Check
3. "시작하기" 클릭
4. Provider: reCAPTCHA v3
5. 사이트 키 입력
6. 저장
```

#### 4️⃣ Firestore Rules 배포
```bash
firebase login
firebase deploy --only firestore:rules
```

#### 5️⃣ Firestore 인덱스 배포
```bash
firebase deploy --only firestore:indexes
```

#### 6️⃣ Vercel 환경 변수 추가
```
Vercel Dashboard → Settings → Environment Variables
- NEXT_PUBLIC_RECAPTCHA_SITE_KEY 추가
- Redeploy
```

**⚠️ 중요:** App Check 활성화 전까지는 API 남용 위험이 있습니다.

---

## 향후 개선 사항

### 기능
- [ ] 검색 기능 (Algolia/Fuse.js)
- [ ] RSS 피드 생성

### 성능
- [ ] 번들 사이즈 최적화 추가 개선

### UX/UI
- [ ] 코드 블록 복사 버튼

### 보안
- [ ] ~~Firebase App Check 구현~~ ✅ 코드 완료 (설정만 남음)

## 완료된 기능

### 기능
- [✅] 태그별 필터링 페이지 (태그 버블 클라우드)
- [✅] 목차 (TOC) 자동 생성 (TableOfContents 컴포넌트)
- [✅] 읽기 시간 표시 (포스트 상세 페이지)
- [✅] Firebase 댓글 시스템 (익명 + 소셜 로그인)
- [✅] **SOTD 페이지** - 스토아 철학 명언 카드 (2025-12-10)
- [✅] **ReadingProgress** - 글 읽기 진행률 표시 (2025-12-10)

### 성능
- [✅] ISR (Incremental Static Regeneration) - revalidate: 60초
- [✅] 이미지 lazy loading (Next.js Image 컴포넌트)
- [✅] 동적 임포트로 번들 크기 최적화 (FirebaseComments)
- [✅] SWR 캐싱 (댓글 시스템, 30초 자동 갱신)
- [✅] Firestore 복합 인덱스 정의
- [✅] Passive 이벤트 리스너 (ReadingProgress)

### UX/UI
- [✅] 다크모드 전환 애니메이션 (View Transitions API)
- [✅] Featured Post 타이핑 효과
- [✅] 태그 마키(marquee) 애니메이션
- [✅] 스켈레톤 로딩 UI (Articles 페이지 초기 로딩 및 섹션 전환)
- [✅] **SOTD 명언 카드** - 이미지 다운로드 & 공유 기능 (2025-12-10)
- [✅] **철학자 배경 이미지** - 투명도 조절 배경 (2025-12-10)

### 보안
- [✅] XSS 방지 (DOMPurify)
- [✅] Rate Limiting (30초 제한)
- [✅] Firestore Security Rules (작성자 검증)
- [✅] Firebase App Check 코드 구현 (설정 대기 중)

---

**문서 버전:** 1.3
**최종 업데이트:** 2025-12-10 (SOTD 페이지 & ReadingProgress 추가)
**작성:** Claude Code AI
**프로젝트 상태:** 활발히 개발 중

이 파일은 Claude Code가 프로젝트를 이해하고 일관된 코드를 생성하는 데 사용됩니다.
매 작업 전에 이 가이드라인을 참고하세요.

---

## 📌 빠른 참조

### 최신 기능 (2025-12-10)
- [✅] **SOTD 페이지**: `/sotd` - 스토아 철학 명언 카드
  - 이미지 다운로드 (1:1, 9:16)
  - 공유 기능 (Web Share API)
  - 철학자 배경 이미지
- [✅] **ReadingProgress**: 글 읽기 진행률 표시 바
- [✅] **404 버그 수정**: 페이지 라우팅 이슈 해결

### 보안 체크리스트
- [✅] XSS 방지 적용됨
- [✅] Rate Limiting 활성화
- [✅] Firestore Rules 강화됨
- [⚠️] App Check 코드 완료 (Vercel 배포 후 설정 필요)

### 배포 전 확인사항
1. `.env.local` 환경 변수 확인
2. Firebase Security Rules 배포
3. Firestore 인덱스 배포
4. Vercel 환경 변수 설정
5. App Check 활성화 (배포 후)

### 주요 페이지 경로
- `/` - 홈페이지
- `/articles` - 블로그 글 목록 (Section별)
- `/articles/tags` - 태그 버블 클라우드
- `/sotd` - **스토아 철학 명언 카드** ✨
- `/posts/[slug]` - 글 상세 (ReadingProgress 표시)
- `/admin` - 관리자 대시보드
- `/about` - About 페이지
