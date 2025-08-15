'use server';

import { generateText, type UIMessage } from 'ai';
import { cookies } from 'next/headers';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import type { VisibilityType } from '@/components/visibility-selector';
import { myProvider } from '@/lib/ai/providers';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function getChatModelFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('chat-model')?.value || DEFAULT_CHAT_MODEL;
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  // Extract text content from the message
  const userContent = message.parts
    ?.filter(part => part.type === 'text')
    .map(part => part.text)
    .join(' ') || '';

  if (!userContent.trim()) {
    return 'New Chat';
  }

  // Truncate content if too long
  const truncatedContent = userContent.length > 200 
    ? userContent.substring(0, 200) + '...' 
    : userContent;

  try {
    const { text: title } = await generateText({
      model: myProvider.languageModel('title-model'),
      system: `You generate short, descriptive titles for chat messages. Requirements:
      - Keep titles under 80 characters
      - Summarize the main topic
      - No quotes or colons
      - Be specific and clear`,
      messages: [
        {
          role: 'user',
          content: truncatedContent,
        },
      ],
      maxTokens: 30,
      temperature: 0.3,
    });

    // Clean up the title
    const cleanTitle = title
      .trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\.$/, '') // Remove trailing period
      .substring(0, 80); // Ensure max length

    return cleanTitle || 'New Chat';
  } catch (error) {
    console.error('Failed to generate title:', error);
    
    // Fallback: Create a simple title from the first few words
    const words = userContent.split(' ').slice(0, 6);
    return words.length > 0 ? words.join(' ') : 'New Chat';
  }
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
