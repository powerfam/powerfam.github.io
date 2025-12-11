# Firebase App Check 설정 가이드

Firebase App Check가 코드에 구현되었습니다. 아래 단계를 따라 활성화하세요.

---

## 📋 무료 플랜 제한사항

- ✅ **월 10,000회 검증 무료**
- ✅ reCAPTCHA v3 사용 가능
- ⚠️ 초과 시: $1/1,000 검증

개인 블로그라면 충분합니다!

---

## 🔧 1단계: Google reCAPTCHA v3 사이트 키 발급

### 1-1. reCAPTCHA 콘솔 접속
https://www.google.com/recaptcha/admin/create

### 1-2. 새 사이트 등록
```
라벨: voti-blog (원하는 이름)
reCAPTCHA 유형: reCAPTCHA v3 선택 ⭐
도메인:
  - localhost (로컬 테스트용)
  - yourdomain.com (프로덕션 도메인)
  - vercel.app (Vercel 배포 시)
```

### 1-3. 사이트 키 복사
생성 후 나오는 **사이트 키**(Site Key)를 복사하세요.
(비밀 키는 나중에 App check 세팅에 필요)

### 1-4. .env.local에 추가
```bash
# .env.local 파일 열기
# 아래 줄 주석 해제하고 키 입력 
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le"
```

**예시:**
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le"
```

---

## 🔥 2단계: Firebase Console에서 App Check 활성화

### 2-1. Firebase Console 접속
https://console.firebase.google.com/

### 2-2. 프로젝트 선택
`voti-blog` 프로젝트 클릭

### 2-3. App Check 설정
```
1. 좌측 메뉴 → Build → App Check 클릭
2. "Get started" 또는 "시작하기" 클릭
3. 웹 앱 선택 (이미 등록된 앱)
4. Provider 선택: reCAPTCHA v3
5. 1단계에서 복사한 비밀 키 입력
6. "Save" 또는 "저장" 클릭
```

### 2-4. Enforcement 설정 (선택)
```
Firestore:
  - Enforcement: Enabled (권장)
  - 또는 "Monitor mode" (개발 중이면 이걸로 시작)
```

**Monitor mode란?**
- App Check 없이도 접근 허용
- 로그만 기록 (위반 사항 확인 가능)
- 개발 완료 후 Enabled로 변경

---

## 🚀 3단계: Firestore Rules 배포

### 3-1. Firebase CLI 설치 (없으면)
```bash
npm install -g firebase-tools
```

### 3-2. Firebase 로그인
```bash
firebase login
```

### 3-3. Firebase 프로젝트 초기화 (처음이면)
```bash
firebase init firestore
# 기존 rules 파일 사용? Yes
```

### 3-4. Rules 배포
```bash
firebase deploy --only firestore:rules
```

**성공 메시지:**
```
✔ Deploy complete!
Firestore Rules deployed successfully
```

---

## ✅ 4단계: 테스트

### 4-1. 개발 서버 재시작
```bash
npm run dev
```

### 4-2. 브라우저 콘솔 확인
```
✅ Firebase App Check 활성화됨
```

이 메시지가 보이면 성공!

### 4-3. 댓글 작성 테스트
1. 블로그 글로 이동
2. 댓글 작성
3. Firebase Console → Firestore → 댓글 데이터 확인

### 4-4. App Check 로그 확인
```
Firebase Console → App Check → Metrics
- 검증 요청 횟수 확인
- 실패 건수 확인
```

---

## 🛡️ 5단계: 프로덕션 강제 (선택)

개발 환경에서는 App Check가 없어도 동작하도록 설정되어 있습니다.
프로덕션에서 **강제**하려면:

### firestore.rules 수정
```javascript
// 현재 (개발 환경 허용)
function isAppCheckValid() {
  return request.app.appCheck == null || request.app.appCheck == true;
}

// 프로덕션 강제 (App Check 필수)
function isAppCheckValid() {
  return request.app.appCheck == true;  // null 허용 제거
}
```

수정 후 다시 배포:
```bash
firebase deploy --only firestore:rules
```

---

## 🔍 문제 해결

### "App Check 초기화 실패" 에러
```
⚠️ App Check 초기화 실패 (이미 초기화되었거나 환경 변수 누락)
```

**원인:**
- `.env.local`에 `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` 없음
- 환경 변수 이름 오타

**해결:**
1. `.env.local` 파일 확인
2. 개발 서버 재시작 (`npm run dev`)

---

### reCAPTCHA 배지가 보임
페이지 우측 하단에 reCAPTCHA 배지가 표시됩니다.

**숨기려면 (선택):**
```css
/* app/globals.css */
.grecaptcha-badge {
  visibility: hidden;
}
```

단, Google 정책상 "This site is protected by reCAPTCHA" 문구를 어딘가에 표시해야 합니다.

**예시 (Footer에 추가):**
```html
<p class="text-xs opacity-60">
  This site is protected by reCAPTCHA and the Google
  <a href="https://policies.google.com/privacy">Privacy Policy</a> and
  <a href="https://policies.google.com/terms">Terms of Service</a> apply.
</p>
```

---

### 댓글 작성이 안 됨
**증상:** 댓글 작성 시 "권한 없음" 에러

**원인:**
- Firebase Console에서 Enforcement를 "Enabled"로 했는데
- `.env.local`에 reCAPTCHA 키가 없음

**해결:**
1. Monitor mode로 변경 (테스트용)
2. 또는 reCAPTCHA 키 제대로 설정

---

## 📊 비용 예상

**무료 플랜 (Spark):**
- App Check: 월 10,000회 무료
- 초과 시: $1/1,000 검증

**예상 사용량:**
```
일일 방문자 100명 × 평균 댓글 조회 3회 = 300회/일
월 사용량: 300 × 30 = 9,000회 ✅ 무료 범위
```

**1만회 초과 시:**
```
월 20,000회 사용 시
→ 10,000회 무료 + 10,000회 유료
→ 비용: $10
```

---

## 🎯 정리

### 꼭 해야 할 것
- [✅] 1단계: reCAPTCHA 사이트 키 발급
- [✅] 2단계: .env.local에 키 추가
- [✅] 3단계: Firebase Console에서 App Check 활성화
- [✅] 4단계: Firestore Rules 배포
- [✅] 5단계: 테스트

### 선택 사항
- [ ] Enforcement를 Monitor → Enabled로 변경
- [ ] 프로덕션에서 App Check 강제
- [ ] reCAPTCHA 배지 숨기기

---

## 📞 도움이 필요하면

Firebase App Check 공식 문서:
https://firebase.google.com/docs/app-check

reCAPTCHA v3 문서:
https://developers.google.com/recaptcha/docs/v3

---

**완료되었습니다!** 🎉

App Check가 활성화되면 봇 공격, API 남용이 자동으로 차단됩니다.
