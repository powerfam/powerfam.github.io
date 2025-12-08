// 비속어 필터 테스트 스크립트
// 사용법: node test-profanity-filter.js

const { containsProfanity, detectProfanity, maskProfanity } = require('./lib/profanity-filter.ts');

// 테스트 케이스
const testCases = [
  // 정상적인 문장 (통과해야 함)
  { text: '안녕하세요. 좋은 글 감사합니다.', shouldBlock: false },
  { text: '개발자입니다. 새로운 기능 개선 부탁드립니다.', shouldBlock: false },
  { text: '2024년도에 새싹처럼 성장하길 바랍니다.', shouldBlock: false },
  { text: '시발점이 중요합니다.', shouldBlock: false },
  { text: '미친듯이 달렸습니다.', shouldBlock: false },

  // 비속어 포함 (차단되어야 함)
  { text: '씨발 이게 뭐야', shouldBlock: true },
  { text: '시 발 진짜', shouldBlock: true },
  { text: 'ㅅㅂ 너무하네', shouldBlock: true },
  { text: '개새끼야', shouldBlock: true },
  { text: 'ㄱㅅㄲ', shouldBlock: true },
  { text: '병신아', shouldBlock: true },
  { text: 'ㅂㅅ', shouldBlock: true },
  { text: '존나 좋네', shouldBlock: true },
  { text: 'fuck this', shouldBlock: true },
  { text: 'what the fck', shouldBlock: true },
  { text: '미친놈', shouldBlock: true },
  { text: '좆같네', shouldBlock: true },
  { text: '지랄하네', shouldBlock: true },

  // 우회 표현 (차단되어야 함)
  { text: '시ㅂ발', shouldBlock: true },
  { text: '씨ㅂ', shouldBlock: true },
  { text: '개 새 끼', shouldBlock: true },
  { text: 'ㅅ ㅂ', shouldBlock: true },
];

console.log('=== 비속어 필터 테스트 시작 ===\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = containsProfanity(testCase.text);
  const isCorrect = result === testCase.shouldBlock;

  if (isCorrect) {
    passed++;
    console.log(`✅ 테스트 ${index + 1} 통과: "${testCase.text}"`);
  } else {
    failed++;
    console.log(`❌ 테스트 ${index + 1} 실패: "${testCase.text}"`);
    console.log(`   예상: ${testCase.shouldBlock ? '차단' : '통과'}, 결과: ${result ? '차단' : '통과'}`);
  }

  // 감지된 비속어 표시
  if (result) {
    const detected = detectProfanity(testCase.text);
    console.log(`   감지된 패턴: ${detected.detectedWords.join(', ')}`);
  }
  console.log('');
});

console.log('\n=== 테스트 결과 ===');
console.log(`통과: ${passed}/${testCases.length}`);
console.log(`실패: ${failed}/${testCases.length}`);
console.log(`성공률: ${(passed / testCases.length * 100).toFixed(1)}%`);
