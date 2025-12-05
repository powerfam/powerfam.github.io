'use client';

import { useState, useEffect } from 'react';

interface AboutContent {
  title: string;
  intro: string;
  topics: string[];
  outro: string;
}

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1
        className="text-5xl font-bold mb-8"
        style={{ color: 'var(--menu-main)' }}
      >
        {content.title}
      </h1>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>
          {content.intro}
        </p>

        <div
          className="p-6 rounded-lg border-l-4 my-8"
          style={{
            backgroundColor: 'rgba(130, 102, 68, 0.05)',
            borderColor: 'var(--menu-main)',
          }}
        >
          <p className="font-medium mb-2" style={{ color: 'var(--menu-main)' }}>
            주요 주제
          </p>
          <ul className="space-y-2 ml-4">
            {content.topics.map((topic, idx) => (
              <li key={idx}>• {topic}</li>
            ))}
          </ul>
        </div>

        <p>
          {content.outro}
        </p>
      </div>
    </div>
  );
}