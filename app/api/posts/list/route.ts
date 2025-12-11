import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

// frontmatter에서 필드 추출
function parseFrontmatter(content: string) {
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

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'posts',
    });

    if (!Array.isArray(data)) {
      return NextResponse.json({ posts: [] });
    }

    // 마크다운 파일만 필터링
    const mdFiles = data.filter((file: { name: string }) => file.name.endsWith('.md'));

    // 각 파일의 내용을 가져와서 frontmatter 파싱
    const posts = await Promise.all(
      mdFiles.map(async (file: { name: string }) => {
        try {
          const { data: fileData } = await octokit.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: `posts/${file.name}`,
          });

          if ('content' in fileData) {
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            const { title, date } = parseFrontmatter(content);

            return {
              slug: file.name.replace('.md', ''),
              title: title || file.name.replace('.md', ''),
              date: date ? new Date(date).toLocaleDateString('ko-KR') : 'N/A',
            };
          }
        } catch (error) {
          console.error(`Failed to fetch ${file.name}:`, error);
        }

        return {
          slug: file.name.replace('.md', ''),
          title: file.name.replace('.md', ''),
          date: 'N/A',
        };
      })
    );

    // 날짜 기준 내림차순 정렬
    posts.sort((a, b) => {
      if (a.date === 'N/A') return 1;
      if (b.date === 'N/A') return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}