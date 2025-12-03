import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await request.json();
  const filePath = `posts/${slug}.md`;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // 파일 SHA 가져오기
    const { data: fileData } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
    });

    if (Array.isArray(fileData) || !('sha' in fileData)) {
      throw new Error('Invalid file');
    }

    // 파일 삭제
    await octokit.repos.deleteFile({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Delete post: ${slug}`,
      sha: fileData.sha,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}