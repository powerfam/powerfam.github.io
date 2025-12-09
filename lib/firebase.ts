// Firebase 초기화 및 설정
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase 설정 (환경 변수에서 가져옴)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 앱 초기화 (이미 초기화되어 있으면 재사용)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase 서비스 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);

// App Check 초기화 (브라우저 환경에서만)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true, // 자동 토큰 갱신
    });
    console.log('✅ Firebase App Check 활성화됨');
  } catch (error) {
    console.warn('⚠️ App Check 초기화 실패 (이미 초기화되었거나 환경 변수 누락):', error);
  }
}

export default app;
