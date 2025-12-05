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

    // Frontmatter 파싱 (따옴표 있든 없든 모두 지원)
    const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
    const title = titleMatch ? titleMatch[1].replace(/^"|"$/g, '') : '';

    const descMatch = frontmatter.match(/description:\s*["']?(.+?)["']?\s*$/m);
    const description = descMatch ? descMatch[1].replace(/^"|"$/g, '') : '';

    const summaryMatch = frontmatter.match(/summary:\s*["']?(.+?)["']?\s*$/m);
    const summary = summaryMatch ? summaryMatch[1].replace(/^"|"$/g, '') : '';

    const dateMatch = frontmatter.match(/date:\s*["']?(.+?)["']?\s*$/m);
    const date = dateMatch ? dateMatch[1].split('T')[0] : new Date().toISOString().split('T')[0];

    // tags 파싱 (배열 형식과 대괄호 형식 모두 지원)
    let tags: string[] = [];
    const tagsArrayMatch = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n?)*)/);
    if (tagsArrayMatch) {
      // 배열 형식: tags:\n  - tag1\n  - tag2
      tags = tagsArrayMatch[1]
        .split('\n')
        .map((line) => line.replace(/^\s*-\s*/, '').trim())
        .filter(Boolean);
    } else {
      // 대괄호 형식: tags: [tag1, tag2]
      const tagsBracketMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      if (tagsBracketMatch) {
        tags = tagsBracketMatch[1]
          .split(',')
          .map(t => t.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
      }
    }

    return NextResponse.json({
      title,
      description,
      summary,
      tags,
      date,
      content: body.trim(),
    });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Failed to get post' }, { status: 500 });
  }
}