import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug, title, description, summary, tags, content, date } = await request.json();
  const filePath = `posts/${slug}.md`;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // 기존 파일 정보 가져오기 (SHA 필요)
    const { data: fileData } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
    });

    if (Array.isArray(fileData) || !('sha' in fileData)) {
      throw new Error('Invalid file');
    }

    // tags 배열 형식으로 변환
    const tagsArray = tags
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    // 날짜 처리: YYYY-MM-DD 형식으로 (따옴표 없음)
    const postDate = date || new Date().toISOString().split('T')[0];

    // frontmatter 생성 (first-post.md 형식에 맞춤)
    const frontmatterLines = [
      '---',
      `title: ${title}`,
      `date: ${postDate}`,
      description ? `description: ${description}` : '',
      tagsArray.length > 0 ? 'tags:' : '',
      ...tagsArray.map((tag: string) => `  - ${tag}`),
      '---',
    ].filter(Boolean);

    const markdown = `${frontmatterLines.join('\n')}

${content}`;

    // 파일 업데이트
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Update post: ${title}`,
      content: Buffer.from(markdown).toString('base64'),
      sha: fileData.sha,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}