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

    // 마크다운 생성
    const tagsArray = tags
      ? tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const tagsYaml = tagsArray.length > 0 ? `\ntags:\n${tagsArray.map((t: string) => `  - ${t}`).join('\n')}` : '';

    // 날짜 처리: 사용자가 선택한 날짜 사용, 없으면 오늘 날짜
    const postDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const markdown = `---
title: ${title}
date: ${postDate}${description ? `\ndescription: ${description}` : ''}${summary ? `\nsummary: ${summary}` : ''}${tagsYaml}
---

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