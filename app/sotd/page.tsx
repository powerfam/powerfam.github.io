'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCwIcon, CopyIcon, DownloadIcon, CheckIcon, SendIcon, SquareIcon, RectangleVerticalIcon } from 'lucide-react';
import stoicQuotes from '@/data/stoic-quotes.json';

interface Quote {
  id: number;
  author: string;
  authorKr: string;
  text: string;
  textKr: string;
}

type ImageSize = 'square' | 'story';

export default function StoicOfTodayPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isKorean, setIsKorean] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [philosopherImage, setPhilosopherImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);

  // 철학자 이미지 가져오기
  const getPhilosopherImage = (author: string): string => {
    const philosophers = stoicQuotes.philosophers as Record<string, string>;
    return philosophers[author] || '';
  };

  // 랜덤 명언 가져오기
  const getRandomQuote = useCallback(() => {
    setIsRefreshing(true);
    setImageLoaded(false);
    const randomIndex = Math.floor(Math.random() * stoicQuotes.quotes.length);

    setTimeout(() => {
      const newQuote = stoicQuotes.quotes[randomIndex];
      setQuote(newQuote);
      const imgUrl = getPhilosopherImage(newQuote.author);
      setPhilosopherImage(imgUrl);

      // 이미지 미리 로드
      if (imgUrl) {
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageLoaded(false);
        img.src = imgUrl;
      }

      setIsRefreshing(false);
    }, 300);
  }, []);

  // 초기 로드
  useEffect(() => {
    getRandomQuote();
  }, [getRandomQuote]);

  // 복사 기능
  const handleCopy = async () => {
    if (!quote) return;

    const textToCopy = isKorean
      ? `"${quote.textKr}"\n\n- ${quote.authorKr}`
      : `"${quote.text}"\n\n- ${quote.author}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 둥근 사각형 그리기 헬퍼 함수
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

  // 폰트 로드 보장 함수
  const ensureFontLoaded = async (): Promise<void> => {
    // 숨겨진 요소로 폰트 트리거
    const testEl = document.createElement('div');
    testEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      font-family: "Noto Serif KR", serif;
    `;
    testEl.innerHTML = `
      <span style="font-weight: 400">테스트 한글 폰트</span>
      <span style="font-weight: 500">테스트 한글 폰트</span>
      <span style="font-weight: 600">테스트 한글 폰트</span>
      <span style="font-weight: 700">테스트 한글 폰트</span>
    `;
    document.body.appendChild(testEl);

    // 폰트 로드 대기
    try {
      await document.fonts.load('400 48px "Noto Serif KR"');
      await document.fonts.load('600 48px "Noto Serif KR"');
      await document.fonts.load('700 48px "Noto Serif KR"');
      await document.fonts.ready;
    } catch {
      // 무시
    }

    // 테스트 요소 제거
    document.body.removeChild(testEl);
  };

  // 이미지 생성 함수 (웹 카드와 동일한 스타일)
  const generateImage = async (size: ImageSize): Promise<string> => {
    if (!quote) return '';

    // 폰트 로드 보장
    await ensureFontLoaded();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 사이즈 설정
    canvas.width = 1080;
    canvas.height = size === 'square' ? 1080 : 1920;

    const isDark = document.documentElement.classList.contains('dark');
    const padding = 50;
    const borderRadius = 32;
    const headerHeight = 70;

    // 전체 배경 (여백 영역)
    ctx.fillStyle = isDark ? '#2a2a26' : '#f0efe8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 카드 영역 클리핑 (둥근 모서리)
    ctx.save();
    roundRect(ctx, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, borderRadius);
    ctx.clip();

    // 카드 배경색
    ctx.fillStyle = isDark ? '#3B3C36' : '#FAF9F5';
    ctx.fillRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);

    // 철학자 이미지 배경 (있으면)
    if (philosopherImage) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.globalAlpha = isDark ? 0.15 : 0.10;
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) * 0.2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            ctx.globalAlpha = 1;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = philosopherImage;
        });
      } catch {
        // 이미지 로드 실패 시 무시
      }
    }

    // 헤더 바 배경
    ctx.fillStyle = isDark ? '#D99058' : '#826644';
    ctx.fillRect(padding, padding, canvas.width - padding * 2, headerHeight);

    // 헤더 텍스트
    ctx.fillStyle = '#FAF9F5';
    ctx.font = 'bold 28px "Noto Serif KR", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Stoic of Today', padding + 30, padding + headerHeight / 2);

    ctx.restore();

    // 테두리 (둥근 모서리)
    ctx.strokeStyle = isDark ? '#D99058' : '#826644';
    ctx.lineWidth = 4;
    roundRect(ctx, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, borderRadius);
    ctx.stroke();

    // 텍스트 영역 계산
    const contentTop = padding + headerHeight + 60;
    const contentBottom = canvas.height - padding - 80;
    const contentHeight = contentBottom - contentTop;

    // 텍스트 설정
    const quoteText = isKorean ? quote.textKr : quote.text;
    const authorText = isKorean ? quote.authorKr : quote.author;

    // 명언 텍스트 (단어 단위 줄바꿈 - word-break: keep-all 효과)
    const maxWidth = canvas.width - padding * 2 - 120;
    const fontSize = size === 'story' ? 52 : 46;
    const lineHeight = size === 'story' ? 85 : 75;
    const lines: string[] = [];

    ctx.font = isKorean
      ? `bold ${fontSize}px "Noto Serif KR", serif`
      : `bold ${fontSize}px Georgia, serif`;

    // 단어 단위로 줄바꿈 (한국어/영어 모두)
    const words = quoteText.split(' ');
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

    // 명언 그리기 (중앙 정렬)
    const totalTextHeight = lines.length * lineHeight;
    const authorSpacing = 50;
    const authorFontSize = size === 'story' ? 38 : 34;
    const totalHeight = totalTextHeight + authorSpacing + authorFontSize;
    const startY = contentTop + (contentHeight - totalHeight) / 2;

    ctx.fillStyle = isDark ? '#e5e5e5' : '#3B3C36';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lines.forEach((line, index) => {
      const prefix = index === 0 ? '"' : '';
      const suffix = index === lines.length - 1 ? '"' : '';
      ctx.fillText(`${prefix}${line}${suffix}`, canvas.width / 2, startY + index * lineHeight);
    });

    // 저자 그리기
    ctx.font = isKorean
      ? `${authorFontSize}px "Noto Serif KR", serif`
      : `${authorFontSize}px Georgia, serif`;
    ctx.fillStyle = isDark ? '#D99058' : '#826644';
    ctx.fillText(`— ${authorText}`, canvas.width / 2, startY + totalTextHeight + authorSpacing);

    // 워터마크 (하단)
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = isDark ? 'rgba(217, 144, 88, 0.6)' : 'rgba(130, 102, 68, 0.6)';
    ctx.fillText('Stoic of Today | Voti Web', canvas.width / 2, canvas.height - padding - 25);

    return canvas.toDataURL('image/png');
  };

  // 다운로드 기능
  const handleDownload = async (size: ImageSize) => {
    setShowDownloadMenu(false);
    const dataUrl = await generateImage(size);
    if (!dataUrl || !quote) return;

    const link = document.createElement('a');
    link.download = `stoic-quote-${quote.id}-${size}.png`;
    link.href = dataUrl;
    link.click();
  };

  // 공유 기능
  const handleShare = async () => {
    if (!quote) return;

    const dataUrl = await generateImage('square');
    if (!dataUrl) return;

    // Data URL을 Blob으로 변환
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `stoic-quote-${quote.id}.png`, { type: 'image/png' });

    // Web Share API 지원 확인
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Stoic of Today',
          text: isKorean ? quote.textKr : quote.text,
        });
      } catch {
        // 사용자가 공유 취소하면 에러 발생 (무시)
      }
    } else {
      // Web Share API 미지원 시 다운로드 메뉴 표시
      setShowDownloadMenu(true);
    }
  };

  if (!quote) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 rounded mx-auto mb-4" style={{ backgroundColor: 'var(--menu-main)', opacity: 0.3 }} />
          <div className="h-4 w-32 rounded mx-auto" style={{ backgroundColor: 'var(--menu-sub)', opacity: 0.3 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 명언 카드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 overflow-hidden shadow-lg relative"
          style={{
            borderColor: 'var(--menu-main)',
            backgroundColor: 'var(--background)'
          }}
        >
          {/* 철학자 배경 이미지 */}
          {philosopherImage && imageLoaded && (
            <div
              className="absolute inset-0 bg-cover opacity-10 dark:opacity-15 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${philosopherImage})`,
                backgroundPosition: 'center 20%'  // 얼굴이 보이도록 상단 중심
              }}
            />
          )}

          {/* 카드 헤더 */}
          <div
            className="px-4 sm:px-6 py-3 border-b relative z-10 flex items-center justify-between"
            style={{
              borderColor: 'var(--menu-main)',
              backgroundColor: 'var(--menu-main)'
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--menu-main-text)' }}
            >
              Stoic of Today
            </p>

            {/* 언어 토글 - 다크모드 토글과 동일한 사이즈 */}
            <button
              onClick={() => setIsKorean(!isKorean)}
              className="relative w-[50px] h-[28px] md:w-[60px] md:h-[32px] rounded-full transition-colors duration-300"
              style={{
                backgroundColor: 'var(--menu-sub)'
              }}
              aria-label="언어 전환"
            >
              <div
                className={`absolute top-0.5 md:top-1 w-[22px] h-[22px] md:w-[24px] md:h-[24px] rounded-full shadow-md transition-all duration-300 flex items-center justify-center
                  ${isKorean ? 'left-0.5 md:left-1' : 'left-[26px] md:left-[32px]'}
                `}
                style={{ backgroundColor: 'var(--menu-main-text)' }}
              >
                <span className="text-[10px] md:text-xs font-bold" style={{ color: 'var(--menu-main)' }}>
                  {isKorean ? 'KR' : 'EN'}
                </span>
              </div>
            </button>
          </div>

          {/* 카드 본문 */}
          <div className="p-8 md:p-12 relative z-10">
            {/* 명언 */}
            <blockquote
              className="text-xl md:text-2xl lg:text-3xl font-medium mb-8 text-center"
              style={{
                lineHeight: isKorean ? '1.8' : '1.6',
                wordBreak: isKorean ? 'keep-all' : 'normal',
                overflowWrap: 'break-word',
                textWrap: 'balance'
              }}
            >
              <span style={{ color: 'var(--menu-main)' }}>&quot;</span>
              {isKorean ? quote.textKr : quote.text}
              <span style={{ color: 'var(--menu-main)' }}>&quot;</span>
            </blockquote>

            {/* 저자 */}
            <p
              className="text-lg md:text-xl text-center font-medium"
              style={{ color: 'var(--menu-sub)' }}
            >
              — {isKorean ? quote.authorKr : quote.author}
            </p>
          </div>

          {/* 카드 액션 버튼 */}
          <div
            className="px-4 py-4 border-t flex items-center justify-center gap-2 relative z-10"
            style={{ borderColor: 'var(--menu-main)' }}
          >
            {/* 새 명언 버튼 */}
            <button
              onClick={getRandomQuote}
              disabled={isRefreshing}
              className="p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--menu-main)',
                color: 'var(--menu-main-text)'
              }}
              title="새 명언"
            >
              <RefreshCwIcon
                size={18}
                className={isRefreshing ? 'animate-spin' : ''}
              />
            </button>

            {/* 복사 버튼 */}
            <button
              onClick={handleCopy}
              className="p-2.5 sm:p-3 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: 'var(--menu-sub)',
                color: 'var(--menu-sub-text)'
              }}
              title="복사"
            >
              {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
            </button>

            {/* 다운로드 버튼 (드롭다운 메뉴) */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 border-2"
                style={{
                  borderColor: 'var(--menu-main)',
                  color: 'var(--menu-main)'
                }}
                title="이미지 저장"
              >
                <DownloadIcon size={18} />
              </button>

              {/* 다운로드 옵션 메뉴 */}
              <AnimatePresence>
                {showDownloadMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-xl shadow-lg border-2 overflow-hidden min-w-[140px]"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--menu-main)'
                    }}
                  >
                    <button
                      onClick={() => handleDownload('square')}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:opacity-80 transition-all border-b"
                      style={{ borderColor: 'var(--menu-main)' }}
                    >
                      <SquareIcon size={18} style={{ color: 'var(--menu-main)' }} />
                      <span className="text-sm font-medium">1:1</span>
                    </button>
                    <button
                      onClick={() => handleDownload('story')}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:opacity-80 transition-all"
                    >
                      <RectangleVerticalIcon size={18} style={{ color: 'var(--menu-sub)' }} />
                      <span className="text-sm font-medium">9:16</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 공유 버튼 */}
            <button
              onClick={handleShare}
              className="p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 border-2"
              style={{
                borderColor: 'var(--menu-sub)',
                color: 'var(--menu-sub)'
              }}
              title="공유"
            >
              <SendIcon size={18} />
            </button>
          </div>

          {/* 다운로드 메뉴 외부 클릭 시 닫기 */}
          {showDownloadMenu && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setShowDownloadMenu(false)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 설명 */}
      <div className="mt-12 text-center text-sm opacity-60">
        <p>매일 새로운 스토아 철학 명언으로 하루를 시작하세요.</p>
      </div>
    </div>
  );
}
