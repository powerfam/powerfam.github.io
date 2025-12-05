# 로컬 개발 가이드

비용 절감과 효율적인 개발을 위한 로컬 환경 활용 가이드입니다.

---

## 💰 왜 로컬 개발이 중요한가?

### 비용 비교

```
Vercel 프로덕션 배포:
- 매번 Git push → 자동 빌드
- 빌드 시간: 1-3분/회
- 오타 수정 10회 = 20-30분 소모

로컬 개발:
- 무제한 수정 가능
- 즉시 확인 (Hot Reload)
- 완성 후 1회 배포 = 2-3분만 소모

→ 10배 효율 향상! 🚀
```

### 개발 효율성

| 작업 | 프로덕션 배포 | 로컬 개발 |
|------|-------------|----------|
| 글 작성 후 확인 | 2-3분 대기 | 즉시 (1초) |
| 오타 수정 | 2-3분 대기 | 즉시 |
| 이미지 업로드 테스트 | 2-3분 대기 | 즉시 |
| UI 수정 확인 | 2-3분 대기 | 즉시 |
| **총 작업 시간** | **30-60분** | **5-10분** |

---

## 🚀 로컬 개발 환경 설정

### 1. 환경 준비

```bash
# 프로젝트 디렉토리로 이동
cd voti-blog-nextjs

# 의존성 설치 (최초 1회)
npm install

# 환경변수 설정
# .env.local 파일이 있는지 확인
ls -la .env.local
```

### 2. 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev

# 출력 예시:
# ▲ Next.js 14.2.33
# - Local:        http://localhost:3000
# - ready in 2.3s
```

### 3. 브라우저에서 접속

```
http://localhost:3000
```

---

## ✍️ 글 작성 워크플로우

### ❌ 비효율적인 방법

```
1. Vercel 배포된 사이트에서 로그인
2. Admin 페이지에서 글 작성
3. 저장 → Git push → 빌드 (2분)
4. 오타 발견
5. 다시 수정 → Git push → 빌드 (2분)
6. 이미지 추가 → Git push → 빌드 (2분)

총 소요: 6분 빌드 시간 + 대기
```

### ✅ 효율적인 방법

```
1. 로컬 개발 서버 실행 (npm run dev)
2. http://localhost:3000/admin 접속
3. GitHub OAuth 로그인
4. 글 작성, 수정, 이미지 추가 (즉시 확인)
5. 완성될 때까지 수정 (무제한)
6. 완벽하게 완성 후 → 1회 Git push
7. Vercel 자동 배포 (2분)

총 소요: 2분 빌드 시간만!
```

---

## 🔧 로컬에서 사용 가능한 모든 기능

### ✅ 완전히 작동하는 기능들

1. **글 작성/수정/삭제**
   - 마크다운 에디터
   - 이미지 업로드 (GitHub에 실제 업로드됨)
   - 날짜 선택
   - Tags, Description 등

2. **AI 어시스턴트**
   - Claude/GPT 모델 선택
   - 이미지 Vision 분석
   - 실시간 대화

3. **About/테스트 페이지 편집**
   - 동적 콘텐츠 수정
   - JSON 저장

4. **미리보기**
   - 글 목록 페이지
   - 개별 글 상세 페이지
   - 다크모드 전환
   - 반응형 디자인 확인

### ⚠️ 로컬 개발 시 주의사항

1. **환경변수 필수**
   ```bash
   # .env.local 파일에 모든 키 설정 필요
   GITHUB_TOKEN=...
   ANTHROPIC_API_KEY=...
   OPENAI_API_KEY=...
   등등
   ```

2. **GitHub API는 실제로 호출됨**
   - 글 작성 시 실제 GitHub에 commit됨
   - 이미지 업로드 시 실제 GitHub에 저장됨
   - 테스트용 글은 나중에 삭제 가능

3. **Hot Reload 제한**
   - UI 코드 수정 시: 즉시 반영
   - API Route 수정 시: 서버 재시작 필요

---

## 📝 추천 개발 루틴

### 일일 작업 흐름

```bash
# 아침: 개발 서버 시작
npm run dev

# 하루 종일:
- 글 작성/수정 (로컬)
- About 페이지 수정 (로컬)
- UI 조정 (로컬)
- 이미지 최적화 후 업로드 (로컬)

# 모든 작업 완료 후:
- 최종 확인
- 한 번에 Git commit & push

# 저녁: 개발 서버 종료
Ctrl + C
```

### 주간 작업 계획

```
월-금: 로컬에서 글 작성/수정
      - 매일 2-3개 글 작성
      - 수정 무제한
      - 빌드 시간: 0분

금요일: 주간 배포
      - 완성된 글 한 번에 push
      - 빌드 시간: 2-3분

월간 빌드 시간: 약 10-15분 (초절약!)
```

---

## 🎯 베스트 프랙티스

### 1. 브랜치 전략 (선택사항)

```bash
# 개발 브랜치 생성
git checkout -b draft

# 로컬에서 작업
# 글 작성, 수정, 커밋 (여러 번)

# 완성 후 main에 병합
git checkout main
git merge draft
git push origin main

# Vercel은 main 브랜치만 배포
→ 1회 빌드만 발생!
```

### 2. 작업 전 체크리스트

```
□ npm run dev 실행 확인
□ http://localhost:3000 접속 가능
□ Admin 로그인 성공
□ .env.local 환경변수 확인
```

### 3. 배포 전 체크리스트

```
□ 로컬에서 모든 기능 테스트 완료
□ 오타, 문법 오류 없음
□ 이미지 최적화 완료 (TinyPNG)
□ 다크모드에서도 확인
□ 모바일 반응형 확인
```

---

## 🐛 로컬 개발 트러블슈팅

### 문제 1: 포트 3000 이미 사용 중

```bash
# 에러: Port 3000 is already in use

# 해결:
# 1) 기존 프로세스 종료
killall node

# 2) 다른 포트 사용
npm run dev -- -p 3001
```

### 문제 2: 환경변수 로드 안 됨

```bash
# .env.local 파일 확인
cat .env.local

# 서버 재시작
# Ctrl + C
npm run dev
```

### 문제 3: 변경사항 반영 안 됨

```bash
# .next 폴더 삭제 후 재시작
rm -rf .next
npm run dev
```

### 문제 4: GitHub OAuth 에러

```
로컬: http://localhost:3000
Vercel: https://yourdomain.com

.env.local에서:
NEXTAUTH_URL=http://localhost:3000

Vercel 환경변수에서:
NEXTAUTH_URL=https://yourdomain.com

GitHub OAuth 설정에서:
Callback URL:
- http://localhost:3000/api/auth/callback/github
- https://yourdomain.com/api/auth/callback/github
```

---

## 📊 비용 절감 효과

### 시나리오 비교

#### 방법 A: 매번 배포
```
하루 작업:
- 글 작성 3개
- 각 글당 평균 5회 수정
- 총 15회 배포

월간:
- 450회 배포
- 빌드 시간: 900분 (15시간)
- 무료 플랜 100시간 중 15% 사용
```

#### 방법 B: 로컬 개발 (권장)
```
하루 작업:
- 글 작성 3개 (로컬)
- 수정 무제한 (로컬)
- 완성 후 1회 배포

월간:
- 30회 배포
- 빌드 시간: 60분 (1시간)
- 무료 플랜 100시간 중 1% 사용

→ 15배 효율 향상! 🎉
```

---

## 🎓 학습 팁

### 로컬 개발의 추가 이점

1. **빠른 피드백**
   - 코드 수정 → 즉시 확인
   - 디버깅 용이

2. **실험 가능**
   - 새로운 기능 테스트
   - 망가뜨려도 괜찮음
   - Git에 commit 안 하면 되니까

3. **오프라인 작업**
   - 인터넷 연결 없이도 개발 가능
   - (AI 어시스턴트, GitHub 연동 제외)

4. **성능 최적화**
   - 실시간으로 성능 측정
   - 크롬 개발자 도구 활용

---

## 🚀 고급 기능

### VSCode 통합

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "npm",
      "script": "dev",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

### 자동 재시작 (nodemon)

```bash
# package.json
{
  "scripts": {
    "dev": "next dev",
    "dev:watch": "nodemon --watch .env.local --exec 'npm run dev'"
  }
}

# .env.local 변경 시 자동 재시작
npm run dev:watch
```

---

## ✅ 결론

**로컬 개발 = 시간 절약 + 비용 절약 + 생산성 향상**

```
개발 완성도 ↑ → 배포 횟수 ↓ → 빌드 시간 ↓ → 비용 ↓

동시에:
작업 속도 ↑ → 생산성 ↑ → 퀄리티 ↑
```

### 핵심 요약

1. **로컬에서 개발** → 즉시 피드백
2. **충분히 테스트** → 완성도 높이기
3. **한 번에 배포** → 빌드 시간 절약

**이것이 프로 개발자의 워크플로우!** 🎯

---

**다음 작업 시작 전에:**
```bash
npm run dev
```

**Happy Local Development! 🚀**
