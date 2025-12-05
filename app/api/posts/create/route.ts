import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Octokit } from '@octokit/rest';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, summary, tags, content, date } = await req.json();

    // YAML에서 안전하게 사용하기 위해 따옴표 이스케이프
    const escapeYaml = (str: string) => str.replace(/"/g, '\\"');

    // 날짜 처리: 사용자가 선택한 날짜 사용, 없으면 오늘 날짜
    const postDate = date ? new Date(date).toISOString() : new Date().toISOString();

    // 마크다운 frontmatter 생성
    const frontmatter = [
      '---',
      `title: "${escapeYaml(title)}"`,
      `date: "${postDate}"`,
      description ? `description: "${escapeYaml(description)}"` : '',
      summary ? `summary: "${escapeYaml(summary)}"` : '',
      tags ? `tags: [${tags.split(',').map((t: string) => `"${escapeYaml(t.trim())}"`).join(', ')}]` : '',
      '---',
      '',
      content
    ].filter(Boolean).join('\n');

    // slug 생성 (한글 포함, URL 안전한 문자로 변환)
    const slug = title
      .trim()
      .replace(/\s+/g, '-')      // 공백을 하이픈으로
      .replace(/[\/\\?%*:|"<>]/g, '') // 파일명에 사용 불가한 문자 제거
      .replace(/-+/g, '-')       // 연속 하이픈 정리
      .replace(/^-+|-+$/g, '')   // 앞뒤 하이픈 제거
      || 'post';                 // 빈 문자열 방지

    const timestamp = Date.now();
    const finalSlug = `${slug}-${timestamp}`;

    const octokit = new Octokit({
      auth: session.user.accessToken,
    });

    const response = await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `posts/${finalSlug}.md`,
      message: `Add post: ${title}`,
      content: Buffer.from(frontmatter).toString('base64'),
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}