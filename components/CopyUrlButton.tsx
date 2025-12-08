'use client';

import { useState } from 'react';
import { LinkIcon, CheckIcon } from 'lucide-react';

interface CopyUrlButtonProps {
  className?: string;
}

export default function CopyUrlButton({ className = '' }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
        copied
          ? 'border-green-500 text-green-600 dark:text-green-400'
          : 'hover:opacity-70'
      } ${className}`}
      style={{
        borderColor: copied ? undefined : 'var(--menu-main)',
        color: copied ? undefined : 'var(--menu-main)'
      }}
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          <span className="text-sm font-medium">복사됨!</span>
        </>
      ) : (
        <>
          <LinkIcon className="h-4 w-4" />
          <span className="text-sm font-medium">URL 복사</span>
        </>
      )}
    </button>
  );
}
