// 비속어 필터링 라이브러리

// 한글 초성 추출 함수
function getChosung(text: string): string {
  const CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    if (char >= 0xAC00 && char <= 0xD7A3) {
      const chosungIndex = Math.floor((char - 0xAC00) / 588);
      result += CHOSUNG_LIST[chosungIndex];
    } else if (CHOSUNG_LIST.includes(text[i])) {
      result += text[i];
    } else {
      result += text[i];
    }
  }

  return result;
}

// 텍스트 정규화 (띄어쓰기, 특수문자 제거)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^가-힣a-z0-9ㄱ-ㅎㅏ-ㅣ]/g, '') // 특수문자, 공백 제거
    .replace(/(.)\1+/g, '$1'); // 반복 문자 제거 (ㅋㅋㅋ -> ㅋ, 시ㅣㅣㅣ발 -> 시발)
}

// 비속어 사전 (패턴 기반)
const profanityPatterns = [
  // 한국어 비속어 패턴들
  // 성적 비속어
  '씨발', '시발', '시bal', '시ㅂ', 'ㅅㅂ', 'ㅆㅂ', 'tlqkf', '씨ㅂ', '씨bal',
  '개새', '개새끼', 'ㄱㅅㄲ', '개색', '개색기', '개색끼',
  '병신', '븅신', 'ㅂㅅ', 'ㅂ신', '병ㅅ', 'qudtls',
  '좆', '좃', 'ㅈ같', '존나', '존ㄴ', 'whs', 'whdxo', '쫓',
  '지랄', 'ㅈㄹ', 'wlf', 'wlfkf',
  '닥쳐', '닥ㅊ', 'ek',
  '엿먹', '엿ㅁ',
  '꺼져', 'ㄲㅈ', 'Rja',
  '느금', 'ㄴㄱㅁ', '늬금',
  '미친', '미ㅊ', 'ㅁㅊ', 'altcl',
  '또라이', '똘아이', 'ㄸㄹㅇ',
  '년', 'ㄴ', 'sla',
  '놈', 'nom',
  '새끼', 'ㅅㄲ', 'Tl',
  '호로', '후로', '호로새', '후로새', '후로자', '호로자',
  '개같', '개ㄱ', 'Ro',
  '썅', '쌍', 'ㅆㅇ',
  '야동', 'ㅇㄷ',
  '야사', 'ㅇㅅ',
  '보지', 'ㅂㅈ', 'qhwl',
  '자지', 'ㅈㅈ', 'wkwl',
  '고추', 'ㄱㅊ',
  '섹스', 'ㅅㅅ', 'tprtm',
  '애미', 'ㅇㅁ', 'oiel',
  '애비', 'ㅇㅂ', 'oiql',
  '지랄', 'ㅈㄹ',
  '엠창', 'ㅁㅊ',
  '엠병', 'ㅁㅂ',
  '니애미', 'ㄴㅇㅁ',
  '개자식', 'ㄱㅈㅅ',
  '미친놈', 'ㅁㅊㄴ',
  '미친년', 'ㅁㅊㄴ',
  '또라이', 'ㄸㄹㅇ',

  // 영어 비속어 (일부)
  'fuck', 'fuk', 'fck', 'fxck', 'f u c k', 'fu ck',
  'shit', 'sht', 'sh1t', 's h i t',
  'bitch', 'btch', 'b1tch', 'bi tch',
  'ass', 'azz', 'a s s',
  'damn', 'dmn', 'd a m n',
  'dick', 'dck', 'd1ck',
  'pussy', 'psy',
  'cock', 'cok',
  'bastard', 'bstrd',
  'whore', 'whor',
  'slut', 'slt',
  'cunt', 'cnt',

  // 혐오 표현
  '한남', 'ㅎㄴ',
  '한녀', 'ㅎㄴ',
  '김치녀', 'ㄱㅊㄴ',
  '김여사', 'ㄱㅇㅅ',
  '맘충', 'ㅁㅊ',
  '틀딱', 'ㅌㄸ',
  '급식', 'ㄱㅅ',
  '문재앙',
  '박근혜',
  '이명박',
  '노무현',

  // 정치적 비하 (일부)
  '수꼴', 'ㅅㄲ',
  '좌빨', 'ㅈㅃ',
  '종북', 'ㅈㅂ',
  '일베', 'ㅇㅂ',
  '메갈', 'ㅁㄱ',
  '워마드', 'ㅇㅁㄷ',
];

// 초성 패턴
const chosungPatterns = [
  'ㅅㅂ', 'ㅆㅂ', 'ㄱㅅㄲ', 'ㅂㅅ', 'ㅈㄹ', 'ㅈㄴ', 'ㅁㅊ', 'ㄲㅈ', 'ㄴㄱㅁ', 'ㅅㄲ', 'ㅂㅈ', 'ㅈㅈ', 'ㅇㅁ', 'ㅇㅂ', 'ㄱㅊ', 'ㅎㄴ', 'ㄱㅊㄴ', 'ㅁㅊ', 'ㅌㄸ', 'ㄱㅅ', 'ㅅㄲ', 'ㅈㅃ', 'ㅈㅂ', 'ㅇㅂ', 'ㅁㄱ', 'ㅇㅁㄷ'
];

// 화이트리스트 (오탐 방지)
const whitelist = [
  '사발', '시발점', '개발', '개선', '새싹', '새집', '미친듯이', '존경',
  '씨앗', '씨름', '시바견', '개나리', '개구리', '년도', '년간', '년차',
  '놈팡', '새콤', '개최', '개강', '개편', '개통', '개관',
];

/**
 * 비속어 감지 함수
 * @param text 검사할 텍스트
 * @returns 비속어가 있으면 true, 없으면 false
 */
export function containsProfanity(text: string): boolean {
  if (!text || text.trim().length === 0) return false;

  // 화이트리스트 체크
  for (const word of whitelist) {
    if (text.includes(word)) {
      // 화이트리스트에 있는 단어가 포함되어 있으면
      // 해당 단어 부분을 제외하고 검사
      const cleanText = text.replace(new RegExp(word, 'g'), '');
      if (cleanText.trim().length === 0) return false;
    }
  }

  const normalized = normalizeText(text);
  const chosung = getChosung(text);

  // 1. 일반 패턴 매칭
  for (const pattern of profanityPatterns) {
    const normalizedPattern = normalizeText(pattern);
    if (normalized.includes(normalizedPattern)) {
      return true;
    }
  }

  // 2. 초성 패턴 매칭
  for (const pattern of chosungPatterns) {
    if (chosung.includes(pattern)) {
      return true;
    }
  }

  // 3. 띄어쓰기/특수문자로 우회한 경우
  const spacedText = text.replace(/\s+/g, '');
  const spacedNormalized = normalizeText(spacedText);
  for (const pattern of profanityPatterns) {
    const normalizedPattern = normalizeText(pattern);
    if (spacedNormalized.includes(normalizedPattern)) {
      return true;
    }
  }

  // 4. 반복 문자 체크 (ㅋㅋㅋ는 허용, 비속어 반복은 차단)
  const repeatedCheck = text.replace(/(.)\1{2,}/g, '$1');
  const repeatedNormalized = normalizeText(repeatedCheck);
  for (const pattern of profanityPatterns) {
    const normalizedPattern = normalizeText(pattern);
    if (repeatedNormalized.includes(normalizedPattern)) {
      return true;
    }
  }

  return false;
}

/**
 * 비속어를 마스킹하는 함수
 * @param text 원본 텍스트
 * @returns 비속어가 ***로 마스킹된 텍스트
 */
export function maskProfanity(text: string): string {
  let masked = text;

  for (const pattern of profanityPatterns) {
    const regex = new RegExp(pattern, 'gi');
    masked = masked.replace(regex, (match) => '*'.repeat(match.length));
  }

  return masked;
}

/**
 * 비속어 감지 결과와 함께 상세 정보 반환
 * @param text 검사할 텍스트
 * @returns { hasProfanity: boolean, detectedWords: string[] }
 */
export function detectProfanity(text: string): { hasProfanity: boolean; detectedWords: string[] } {
  const detectedWords: string[] = [];
  const normalized = normalizeText(text);

  for (const pattern of profanityPatterns) {
    const normalizedPattern = normalizeText(pattern);
    if (normalized.includes(normalizedPattern)) {
      detectedWords.push(pattern);
    }
  }

  return {
    hasProfanity: detectedWords.length > 0,
    detectedWords: Array.from(new Set(detectedWords)), // 중복 제거
  };
}
