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

    // 마크다운 frontmatter 생성
    const frontmatter = [
      '---',
      `title: "${title}"`,
      `date: "${new Date().toISOString()}"`,
      description ? `description: "${description}"` : '',
      summary ? `summary: "${summary}"` : '',
      tags ? `tags: [${tags.split(',').map((t: string) => `"${t.trim()}"`).join(', ')}]` : '',
      '---',
      '',
      content
    ].filter(Boolean).join('\n');

    // slug 생성 (제목을 URL 친화적으로 변환)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();

    const octokit = new Octokit({
      auth: session.user.accessToken,
    });

    const response = await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `posts/${slug}.md`,
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