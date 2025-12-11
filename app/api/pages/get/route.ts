import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  if (!page || (page !== 'about' && page !== 'test')) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', `${page}.json`);

    // 파일이 없으면 기본값 반환
    if (!fs.existsSync(filePath)) {
      const defaultContent = page === 'about'
        ? {
            title: 'About',
            intro: 'this is the test "ABOUT" page.',
            topics: ['type1', 'type2', 'type13'],
            outro: 'test sentence'
          }
        : {
            title: '테스트 페이지',
            description: '라이트모드와 다크모드 전환이 잘 되는지 확인하세요.',
            mainColorDesc: '메뉴 기본 색상입니다.',
            subColorDesc: '강조 색상입니다.'
          };
      return NextResponse.json(defaultContent);
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return NextResponse.json(content);
  } catch (error: unknown) {
    console.error('페이지 내용 로드 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
