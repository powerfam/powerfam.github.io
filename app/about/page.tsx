'use client';

import { Instagram, Mail } from 'lucide-react';

// 소셜 링크 설정
const socialLinks = {
  instagram: 'https://www.instagram.com/stoic_daily_life?utm_source=qr',
  email: 'powerfam@naver.com',
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto w-full text-left">
      {/* 페이지 타이틀 */}
      <h1
        className="text-4xl md:text-5xl font-bold mb-12"
        style={{ color: 'var(--menu-main)' }}
      >
        About
      </h1>

      {/* 한국어 섹션 */}
      <div className="space-y-4 text-base md:text-lg leading-relaxed mb-12">
        <p>인생의 정답보다는 오답들을 피해가는 연습을 열심히 하는 사람</p>
        <p>두 살배기 딸을 키우면서, 아빠가 배우고 생각하고 정리한 것을 딸이 성인이 되었을 때 남겨주고 싶어 블로그를 시작</p>
        <p>Voti(보티)는 핀란드어 기원으로 &quot;승리&quot;, &quot;극복하다&quot;라는 뜻을 가지고 있음</p>
      </div>

      {/* 영어 섹션 */}
      <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-70">
        <p>I&apos;m learning to avoid wrong turns rather than chase perfect paths.</p>
        <p>Raising my two-year-old daughter inspired me to write these letters—thoughts, lessons, and quiet realizations I hope she&apos;ll find when she&apos;s grown up.</p>
        <p>Voti comes from Finnish, meaning &quot;victory&quot; or &quot;to overcome.&quot;</p>
      </div>

      {/* 소셜 링크 버튼 */}
      <div className="pt-8 mt-12 border-t" style={{ borderColor: 'var(--menu-main)' }}>
        <p className="font-medium mb-4" style={{ color: 'var(--menu-main)' }}>
          Contact
        </p>
        <div className="flex flex-wrap gap-3">
          {/* Instagram */}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md"
            style={{
              borderColor: 'var(--menu-main)',
              color: 'var(--menu-main)',
            }}
          >
            <Instagram className="h-5 w-5" />
            <span className="text-sm font-medium">Instagram</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${socialLinks.email}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md"
            style={{
              borderColor: 'var(--menu-main)',
              color: 'var(--menu-main)',
            }}
          >
            <Mail className="h-5 w-5" />
            <span className="text-sm font-medium">Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
