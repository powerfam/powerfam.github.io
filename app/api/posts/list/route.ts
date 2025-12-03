import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

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

    const posts = data
      .filter((file: any) => file.name.endsWith('.md'))
      .map((file: any) => ({
        slug: file.name.replace('.md', ''),
        title: file.name.replace('.md', '').replace(/-/g, ' '),
        date: 'N/A',
      }));

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}