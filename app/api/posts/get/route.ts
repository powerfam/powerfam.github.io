import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }

  const filePath = `posts/${slug}.md`;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
    });

    if (Array.isArray(data) || !('content' in data)) {
      throw new Error('Invalid file');
    }

    // Base64 디코딩
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    // Frontmatter 파싱
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return NextResponse.json({
        title: '',
        description: '',
        summary: '',
        tags: [],
        content: content,
      });
    }

    const frontmatter = match[1];
    const body = match[2];

    // Frontmatter 파싱
    const title = frontmatter.match(/title:\s*(.+)/)?.[1] || '';
    const description = frontmatter.match(/description:\s*(.+)/)?.[1] || '';
    const summary = frontmatter.match(/summary:\s*(.+)/)?.[1] || '';
    const tagsMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n?)*)/);
    const tags = tagsMatch
      ? tagsMatch[1]
          .split('\n')
          .map((line) => line.replace(/^\s*-\s*/, '').trim())
          .filter(Boolean)
      : [];

    return NextResponse.json({
      title,
      description,
      summary,
      tags,
      content: body.trim(),
    });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Failed to get post' }, { status: 500 });
  }
}