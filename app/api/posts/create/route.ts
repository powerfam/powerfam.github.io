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

    const { title, description, summary, tags, content } = await req.json();

    // YAML에서 안전하게 사용하기 위해 따옴표 이스케이프
    const escapeYaml = (str: string) => str.replace(/"/g, '\\"');

    // 마크다운 frontmatter 생성
    const frontmatter = [
      '---',
      `title: "${escapeYaml(title)}"`,
      `date: "${new Date().toISOString()}"`,
      description ? `description: "${escapeYaml(description)}"` : '',
      summary ? `summary: "${escapeYaml(summary)}"` : '',
      tags ? `tags: [${tags.split(',').map((t: string) => `"${escapeYaml(t.trim())}"`).join(', ')}]` : '',
      '---',
      '',
      content
    ].filter(Boolean).join('\n');

    // slug 생성 (영문과 숫자만 사용하여 URL 친화적으로 변환)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // 영문, 숫자, 공백, 하이픈만 유지 (한글 제거)
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '') || 'post'; // 빈 문자열 방지

    const timestamp = Date.now();
    const finalSlug = slug ? `${slug}-${timestamp}` : `post-${timestamp}`;

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