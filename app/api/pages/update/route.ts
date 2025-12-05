import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { page, content } = await request.json();

    if (!page || (page !== 'about' && page !== 'test')) {
      return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const contentDir = path.join(process.cwd(), 'content');
    const filePath = path.join(contentDir, `${page}.json`);

    // content 디렉토리가 없으면 생성
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    // 파일에 저장
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('페이지 업데이트 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
