#!/bin/bash

# Vercel 빌드 최적화 스크립트
# posts/, content/, public/images/ 폴더만 변경되었을 때는 빌드 스킵

echo "🔍 변경된 파일 확인 중..."

# 마지막 커밋에서 변경된 파일 목록
CHANGED_FILES=$(git diff --name-only HEAD~1)

echo "변경된 파일:"
echo "$CHANGED_FILES"

# posts/, content/, public/images/ 폴더만 변경되었는지 확인
if echo "$CHANGED_FILES" | grep -qvE '^(posts/|content/|public/images/)'; then
  echo "✅ 코드 변경 감지 - 빌드 진행"
  exit 1
else
  echo "⏭️  콘텐츠만 변경 - 빌드 스킵 (ISR로 자동 업데이트)"
  exit 0
fi
