import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Octokit } from '@octokit/rest';
import { convert } from 'hangul-romanization';

// 한글 제목을 영문 파일명으로 변환하는 함수
function generateSlug(title: string, date: string): string {
  // 한글을 로마자로 변환
  const romanized = convert(title);

  // 파일명에 안전한 형태로 정리
  const slug = romanized
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // 공백을 하이픈으로
    .replace(/[^a-z0-9-]/g, '')     // 영문, 숫자, 하이픈만 허용
    .replace(/-+/g, '-')            // 연속 하이픈 정리
    .replace(/^-+|-+$/g, '')        // 앞뒤 하이픈 제거
    .slice(0, 50)                   // 최대 50자로 제한
    || 'post';                      // 빈 문자열 방지

  // 형식: YYYY-MM-DD-slug
  return `${date}-${slug}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, tags, content, date } = await req.json();

    // 날짜 처리: YYYY-MM-DD 형식으로 (따옴표 없음)
    const postDate = date || new Date().toISOString().split('T')[0];

    // tags 배열 형식으로 변환
    const tagsArray = tags
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    // 마크다운 frontmatter 생성 (first-post.md 형식에 맞춤)
    const frontmatter = [
      '---',
      `title: ${title}`,
      `date: ${postDate}`,
      description ? `description: ${description}` : '',
      tagsArray.length > 0 ? 'tags:' : '',
      ...tagsArray.map((tag: string) => `  - ${tag}`),
      '---',
      '',
      content
    ].filter(Boolean).join('\n');

    // 영문 slug 생성 (날짜-로마자변환 형식)
    const finalSlug = generateSlug(title, postDate);

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
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}