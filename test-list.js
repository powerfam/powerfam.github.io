const content = `---
title: "워렌 버핏의 마지막 주주서한이 우리에게 남긴 것"
date: "2025-12-05T00:00:00.000Z"
summary: "2025년 11월, 94세의 워렌 버핏이 남긴 마지막 주주서한. 그가 평생 지켜온 투자 철학과 인생의 지혜를 돌아본다."
---`;

function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return { title: '', date: '' };

  const frontmatter = frontmatterMatch[1];

  // title 추출
  const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1] : '';

  // date 추출
  const dateMatch = frontmatter.match(/^date:\s*["']?(.+?)["']?\s*$/m);
  const date = dateMatch ? dateMatch[1] : '';

  return { title, date };
}

const result = parseFrontmatter(content);
console.log('Title:', result.title);
console.log('Date:', result.date);
console.log('Parsed Date:', new Date(result.date).toLocaleDateString('ko-KR'));
