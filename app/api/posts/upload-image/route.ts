import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

export async function POST(request: NextRequest) {
  console.log('🚀 Upload API called');
  
  const session = await getServerSession();
  if (!session) {
    console.error('❌ Unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('✅ File received:', file.name, file.size, 'bytes');

    // 파일명 생성 (한글 지원)
    const timestamp = Date.now();
    // 파일명에서 사용 불가한 문자만 제거 (한글은 유지)
    const safeName = file.name
      .replace(/[\/\\?%*:|"<>]/g, '-')  // 파일시스템에서 금지된 문자만 제거
      .replace(/-+/g, '-');              // 연속 하이픈 정리
    const fileName = `${timestamp}-${safeName}`;
    const filePath = `public/images/${fileName}`;

    console.log('📂 Upload path:', filePath);

    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString('base64');

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    console.log('🔑 Token exists:', !!process.env.GITHUB_TOKEN);
    console.log('📍 Owner:', GITHUB_OWNER, 'Repo:', GITHUB_REPO);

    // GitHub에 이미지 업로드
    const result = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Upload image: ${fileName}`,
      content: base64Content,
    });

    console.log('✅ Upload success!');

    // GitHub Raw URL 생성
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      markdown: `![이미지 설명](${imageUrl})`
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error.message);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 });
  }
}