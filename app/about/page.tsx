'use client';

import { useState, useEffect } from 'react';
import { Linkedin, Instagram, Mail } from 'lucide-react';

interface AboutContent {
  title: string;
  intro: string;
  topics: string[];
  outro: string;
}

// 소셜 링크 설정 (필요에 따라 수정)
const socialLinks = {
  linkedin: 'https://linkedin.com/in/your-profile',
  instagram: 'https://instagram.com/your-profile',
  email: 'your-email@example.com',
};

export default function About() {
  const [content, setContent] = useState<AboutContent>({
    title: 'About',
    intro: 'this is the test "ABOUT" page.',
    topics: ['type1', 'type2', 'type13'],
    outro: 'test sentence'
  });

  useEffect(() => {
    // 페이지 내용 불러오기
    fetch('/api/pages/get?page=about')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load content:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full text-left">
      {/* 페이지 타이틀 */}
      <h1
        className="text-4xl md:text-5xl font-bold mb-8"
        style={{ color: 'var(--menu-main)' }}
      >
        {content.title}
      </h1>

      {/* 본문 내용 */}
      <div className="space-y-6 text-base md:text-lg leading-relaxed">
        <p>{content.intro}</p>

        {/* 주요 주제 박스 */}
        <div
          className="p-6 rounded-lg border-l-4 my-8"
          style={{
            backgroundColor: 'rgba(130, 102, 68, 0.05)',
            borderColor: 'var(--menu-main)',
          }}
        >
          <p className="font-medium mb-3" style={{ color: 'var(--menu-main)' }}>
            주요 주제
          </p>
          <ul className="space-y-2">
            {content.topics.map((topic, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: 'var(--menu-main)' }}>•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <p>{content.outro}</p>

        {/* 소셜 링크 버튼 */}
        <div className="pt-8 mt-8 border-t" style={{ borderColor: 'var(--menu-main)' }}>
          <p className="font-medium mb-4" style={{ color: 'var(--menu-main)' }}>
            Contact
          </p>
          <div className="flex flex-wrap gap-3">
            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md"
              style={{
                borderColor: 'var(--menu-main)',
                color: 'var(--menu-main)',
              }}
            >
              <Linkedin className="h-5 w-5" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>

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
    </div>
  );
}
