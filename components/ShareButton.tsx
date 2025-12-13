'use client';

import { useState } from 'react';
import { Share2Icon, LinkIcon, ImageIcon, CheckIcon } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface ShareButtonProps {
  title: string;
  summary?: string;
  tags?: string[];
  date: string;
  slug: string;
}

export default function ShareButton({ title, summary, tags, date, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 현재 URL 가져오기
  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/posts/${slug}`;
    }
    return '';
  };

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setDrawerOpen(false);
      }, 1500);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 둥근 사각형 그리기 헬퍼
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // 폰트 로드 보장
  const ensureFontLoaded = async (): Promise<void> => {
    const testEl = document.createElement('div');
    testEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      font-family: "Noto Serif KR", serif;
    `;
    testEl.innerHTML = `
      <span style="font-weight: 400">테스트 한글 폰트</span>
      <span style="font-weight: 700">테스트 한글 폰트</span>
    `;
    document.body.appendChild(testEl);

    try {
      await document.fonts.load('400 48px "Noto Serif KR"');
      await document.fonts.load('700 48px "Noto Serif KR"');
      await document.fonts.ready;
    } catch {
      // 무시
    }

    document.body.removeChild(testEl);
  };

  // 텍스트 줄바꿈 헬퍼
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // 카드 이미지 생성
  const generateCardImage = async (): Promise<string> => {
    await ensureFontLoaded();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 1:1 정사각형 (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    const isDark = document.documentElement.classList.contains('dark');
    const padding = 50;
    const borderRadius = 32;
    const headerHeight = 70;

    // 전체 배경
    ctx.fillStyle = isDark ? '#2a2a26' : '#f0efe8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 카드 영역 클리핑
    ctx.save();
    roundRect(ctx, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, borderRadius);
    ctx.clip();

    // 카드 배경색
    ctx.fillStyle = isDark ? '#3B3C36' : '#FAF9F5';
    ctx.fillRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);

    // 헤더 바
    ctx.fillStyle = isDark ? '#D99058' : '#826644';
    ctx.fillRect(padding, padding, canvas.width - padding * 2, headerHeight);

    // 헤더 텍스트
    ctx.fillStyle = '#FAF9F5';
    ctx.font = 'bold 28px "Noto Serif KR", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Voti Blog', padding + 30, padding + headerHeight / 2);

    // 날짜 (헤더 우측)
    ctx.textAlign = 'right';
    ctx.font = '22px "Noto Serif KR", Georgia, serif';
    ctx.fillText(date, canvas.width - padding - 30, padding + headerHeight / 2);

    ctx.restore();

    // 테두리
    ctx.strokeStyle = isDark ? '#D99058' : '#826644';
    ctx.lineWidth = 4;
    roundRect(ctx, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, borderRadius);
    ctx.stroke();

    // 콘텐츠 영역
    const contentTop = padding + headerHeight + 80;
    const contentBottom = canvas.height - padding - 120;
    const maxWidth = canvas.width - padding * 2 - 120;

    // 제목
    ctx.fillStyle = isDark ? '#e5e5e5' : '#3B3C36';
    ctx.font = 'bold 52px "Noto Serif KR", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const titleLines = wrapText(ctx, title, maxWidth);
    const titleLineHeight = 70;
    let currentY = contentTop;

    titleLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, currentY);
      currentY += titleLineHeight;
    });

    // 요약문 (있으면)
    if (summary) {
      currentY += 40;
      ctx.font = '32px "Noto Serif KR", serif';
      ctx.fillStyle = isDark ? 'rgba(229, 229, 229, 0.7)' : 'rgba(59, 60, 54, 0.7)';

      const summaryLines = wrapText(ctx, summary, maxWidth);
      const summaryLineHeight = 48;

      summaryLines.slice(0, 3).forEach((line, index) => {
        // 마지막 줄이고 더 있으면 ... 추가
        if (index === 2 && summaryLines.length > 3) {
          line = line.slice(0, -3) + '...';
        }
        ctx.fillText(line, canvas.width / 2, currentY);
        currentY += summaryLineHeight;
      });
    }

    // 태그 (있으면)
    if (tags && tags.length > 0) {
      const tagY = contentBottom - 20;
      ctx.font = '24px "Noto Serif KR", serif';
      ctx.fillStyle = isDark ? '#D99058' : '#826644';
      const tagText = tags.slice(0, 4).map(t => `#${t}`).join('  ');
      ctx.fillText(tagText, canvas.width / 2, tagY);
    }

    // 워터마크
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = isDark ? 'rgba(217, 144, 88, 0.6)' : 'rgba(130, 102, 68, 0.6)';
    ctx.fillText('Voti Blog | voti.kr', canvas.width / 2, canvas.height - padding - 25);

    return canvas.toDataURL('image/png');
  };

  // 카드 이미지 공유
  const handleShareCard = async () => {
    setIsGenerating(true);

    try {
      const dataUrl = await generateCardImage();
      if (!dataUrl) {
        setIsGenerating(false);
        return;
      }

      // Data URL → Blob → File
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `voti-blog-${slug}.png`, { type: 'image/png' });

      // Web Share API 지원 확인
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: summary || title,
          url: getUrl(),
        });
        setDrawerOpen(false);
      } else {
        // 미지원 시 다운로드
        const link = document.createElement('a');
        link.download = `voti-blog-${slug}.png`;
        link.href = dataUrl;
        link.click();
        setDrawerOpen(false);
      }
    } catch (err) {
      // 사용자가 공유 취소하면 에러 발생 (무시)
      console.log('공유 취소 또는 실패:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          className="w-10 h-10 rounded-full transition-all hover:scale-110 border-2 flex items-center justify-center"
          style={{
            borderColor: 'var(--menu-main)',
            color: 'var(--menu-main)',
          }}
          title="공유하기"
        >
          <Share2Icon size={20} />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader>
            <DrawerTitle style={{ color: 'var(--foreground)' }}>공유하기</DrawerTitle>
            <DrawerDescription style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              공유 방식을 선택해주세요
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-3">
            {/* 링크 복사 */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
              style={{
                borderColor: 'var(--menu-main)',
                backgroundColor: copied ? 'var(--menu-main)' : 'var(--background)',
                color: copied ? 'var(--menu-main-text)' : 'var(--foreground)',
              }}
            >
              <LinkIcon size={24} style={{ color: copied ? 'var(--menu-main-text)' : 'var(--menu-main)' }} />
              {copied ? <CheckIcon size={24} /> : null}
              <div className="text-left">
                <p className="font-medium" style={{ color: copied ? 'var(--menu-main-text)' : 'var(--foreground)' }}>
                  {copied ? '복사 완료!' : '링크 복사'}
                </p>
                <p className="text-sm" style={{ color: copied ? 'var(--menu-main-text)' : 'var(--foreground)', opacity: 0.7 }}>
                  URL을 클립보드에 복사합니다
                </p>
              </div>
            </button>

            {/* 카드 이미지 공유 */}
            <button
              onClick={handleShareCard}
              disabled={isGenerating}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{
                borderColor: 'var(--menu-sub)',
                backgroundColor: 'var(--background)',
              }}
            >
              <ImageIcon size={24} style={{ color: 'var(--menu-sub)' }} />
              <div className="text-left">
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {isGenerating ? '이미지 생성 중...' : '카드 이미지로 공유'}
                </p>
                <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  글 정보가 담긴 이미지를 공유합니다
                </p>
              </div>
            </button>
          </div>

          <div className="px-4 mt-6">
            <DrawerClose asChild>
              <button
                className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'var(--menu-main)',
                  color: 'var(--menu-main-text)',
                }}
              >
                닫기
              </button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
