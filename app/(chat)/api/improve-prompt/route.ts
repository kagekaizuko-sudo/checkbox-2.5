
import { NextRequest, NextResponse } from 'next/server';
import { deepseek } from '@ai-sdk/deepseek';
import { groq } from '@ai-sdk/groq'
import { generateText } from 'ai';

const IMPROVEMENT_PROMPT = `You are an expert prompt engineer and language specialist. Your task is to improve the given text by:

1. Correcting grammar and spelling mistakes
2. Improving sentence structure and clarity
3. Making the prompt more specific and actionable for AI assistants
4. Maintaining the original intent and meaning
5. Using professional and clear language
6. Making it more engaging and complete

Rules:
- Keep the same language as the input (Hindi, English, or mixed)
- Don't change the core meaning or request
- Make it more detailed and specific if needed
- Fix any grammatical errors
- Improve readability and flow
- Make it suitable for AI conversation

Return only the improved prompt without any explanation or additional text.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    if (prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Empty prompt provided' },
        { status: 400 }
      );
    }

    // Check if DEEPSEEK_API_KEY exists
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    // Use DeepSeek to improve the prompt
    const { text } = await generateText({
      model: groq('openai/gpt-oss-120b', {
        temperature: 0.3,
        maxTokens: 2048,
      }),
      messages: [
        {
          role: 'system',
          content: IMPROVEMENT_PROMPT,
        },
        {
          role: 'user',
          content: `Please improve this prompt: "${prompt}"`,
        },
      ],
    });

    const improvedPrompt = text.trim();

    if (!improvedPrompt) {
      return NextResponse.json(
        { error: 'Failed to generate improved prompt' },
        { status: 500 }
      );
    }

    // Return with the correct field name that frontend expects
    return NextResponse.json({
      improved_prompt: improvedPrompt,
      original_prompt: prompt,
    });

  } catch (error) {
    console.error('Error in improve-prompt API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
