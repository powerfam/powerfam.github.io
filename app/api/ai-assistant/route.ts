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
    const { message, model, currentContent = '', currentTitle = '', chatHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
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

      const messages = [
        ...chatHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ];

      const completion = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages as any,
      });

      response = completion.content[0].type === 'text' ? completion.content[0].text : '';
    } else if (model === 'openai') {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-5.1',
        max_tokens: 500,
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
            content: message,
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
