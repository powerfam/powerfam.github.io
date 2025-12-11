'use client';

import { useState, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, RotateCcw } from 'lucide-react';

interface AIAssistantProps {
  currentContent?: string;
  currentTitle?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  image?: string; // base64 이미지 데이터
}

export default function AIAssistant({ currentContent = '', currentTitle = '' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'claude' | 'openai'>('claude');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !uploadedImage) || isLoading) return;

    const userMessage = message.trim();
    const imageData = uploadedImage;
    setMessage('');
    setUploadedImage(null);
    setIsLoading(true);

    // 사용자 메시지 추가
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage, image: imageData || undefined }]);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          image: imageData,
          model: selectedModel,
          currentContent,
          currentTitle,
          chatHistory: chatHistory.slice(-6), // 최근 3턴(6개 메시지)만 전송
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // AI 응답 추가
        setChatHistory(prev => [
          ...prev,
          { role: 'assistant', content: data.response, model: selectedModel },
        ]);
      } else {
        setChatHistory(prev => [
          ...prev,
          { role: 'assistant', content: `오류: ${data.error}`, model: selectedModel },
        ]);
      }
    } catch {
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: '요청 중 오류가 발생했습니다.', model: selectedModel },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          style={{ backgroundColor: 'var(--menu-main)' }}
          title="AI 글쓰기 어시스턴트"
        >
          <Sparkles className="text-white" size={24} />
        </button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col max-h-[600px]">
          {/* 헤더 */}
          <div
            className="p-4 rounded-t-lg flex justify-between items-center"
            style={{ backgroundColor: 'var(--menu-main)' }}
          >
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={20} />
              <span className="font-bold">AI 글쓰기 어시스턴트</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setChatHistory([])}
                className="text-white hover:bg-white/20 rounded p-1"
                title="대화 초기화"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>


          {/* 대화 영역 */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">글쓰기에 대해 물어보세요!</p>
                <p className="text-xs mt-1 opacity-70">예: &quot;이 문장 어떻게 개선할까요?&quot;</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.role === 'user'
                      ? 'ml-8 bg-blue-50 dark:bg-blue-900/30'
                      : 'mr-8 bg-gray-50 dark:bg-gray-700'
                  } p-3 rounded-lg`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {msg.role === 'assistant' && (
                      <MessageCircle size={14} className="mt-0.5" style={{ color: 'var(--menu-main)' }} />
                    )}
                    <span className="font-medium text-xs" style={{ color: 'var(--menu-main)' }}>
                      {msg.role === 'user'
                        ? '나'
                        : msg.model === 'claude'
                        ? 'Claude 4.5'
                        : 'GPT-4.1'}
                    </span>
                  </div>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="max-w-full rounded-lg mb-2 max-h-48 object-contain"
                    />
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ))
            )}
            {isLoading && (
              <div className="mr-8 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                  <span className="text-sm text-gray-500">답변 생성 중...</span>
                </div>
              </div>
            )}
          </div>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
            {/* 이미지 미리보기 */}
            {uploadedImage && (
              <div className="mb-2 relative inline-block">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-h-24 rounded-lg border dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="질문을 입력하세요..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--menu-main)' } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={isLoading || (!message.trim() && !uploadedImage)}
                className="px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: 'var(--menu-main)' }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>

          {/* 하단바: 모델 선택 + 이미지 업로드 */}
          <div className="px-4 pb-3 pt-2 flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'claude' | 'openai')}
              className="py-1 px-2 rounded text-xs font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': 'var(--menu-main)' } as React.CSSProperties}
            >
              <option value="claude">Claude Sonnet-4.5</option>
              <option value="openai">GPT-5.1</option>
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-1 px-3 rounded text-xs font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
              title="이미지 업로드"
            >
              📷 이미지
            </button>
          </div>
        </div>
      )}
    </>
  );
}
