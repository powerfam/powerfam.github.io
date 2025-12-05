import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, image, model, currentContent = '', currentTitle = '', chatHistory = [] } = await request.json();

    if (!message && !image) {
      return NextResponse.json({ error: 'Message or image required' }, { status: 400 });
    }

    const systemPrompt = `당신은 블로그 글쓰기 전문 어시스턴트입니다. 사용자가 더 나은 글을 쓸 수 있도록 도와줍니다.

주요 역할: 글쓰기 아이디어 제공, 문장 개선, 맞춤법 교정, 글 구조 조언

${currentTitle || currentContent ? `
현재 작성 중인 글:
제목: ${currentTitle || '(없음)'}
내용: ${currentContent ? currentContent.substring(0, 1000) : '(없음)'}
` : ''}

응답 규칙:
- 간결하고 실용적으로 (2-4문장)
- 구체적인 예시 포함
- 친근한 톤`;

    let response = '';

    if (model === 'claude') {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      // 채팅 히스토리 변환
      const historyMessages = chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 현재 메시지 구성 (텍스트 + 이미지)
      const currentMessageContent: any[] = [];

      if (image) {
        // base64 이미지 데이터에서 헤더와 데이터 분리
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mediaType = matches[1];
          const base64Data = matches[2];

          currentMessageContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data,
            },
          });
        }
      }

      if (message) {
        currentMessageContent.push({
          type: 'text',
          text: message,
        });
      }

      const messages = [
        ...historyMessages,
        {
          role: 'user',
          content: currentMessageContent.length === 1 && currentMessageContent[0].type === 'text'
            ? currentMessageContent[0].text
            : currentMessageContent,
        },
      ];

      const completion = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages as any,
      });

      response = completion.content[0].type === 'text' ? completion.content[0].text : '';
    } else if (model === 'openai') {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // 현재 메시지 구성 (텍스트 + 이미지)
      const currentMessageContent: any[] = [];

      if (image) {
        currentMessageContent.push({
          type: 'image_url',
          image_url: {
            url: image, // data:image/jpeg;base64,... 형식 그대로 사용
          },
        });
      }

      if (message) {
        currentMessageContent.push({
          type: 'text',
          text: message,
        });
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...chatHistory.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: 'user',
            content: currentMessageContent.length === 1 && currentMessageContent[0].type === 'text'
              ? currentMessageContent[0].text
              : currentMessageContent,
          },
        ],
      });

      response = completion.choices[0]?.message?.content || '';
    } else {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
