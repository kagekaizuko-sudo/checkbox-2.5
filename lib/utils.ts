import type { CoreAssistantMessage, CoreToolMessage, UIMessage } from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Document } from '@/lib/db/schema';
import { ChatSDKError, type ErrorCode } from './errors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const localStorageKey = "chat_sidebar_state";

// Utility functions for managing chat stop state
export const setChatStopState = (chatId: string, isStopped: boolean) => {
  if (typeof window !== 'undefined') {
    const key = `chat_stop_${chatId}`;
    if (isStopped) {
      localStorage.setItem(key, Date.now().toString());
    } else {
      localStorage.removeItem(key);
    }
  }
};

export const getChatStopState = (chatId: string): boolean => {
  if (typeof window === 'undefined') return false;

  const key = `chat_stop_${chatId}`;
  const stopTime = localStorage.getItem(key);

  if (!stopTime) return false;

  // Auto-clear stop state after 10 seconds
  const timeDiff = Date.now() - parseInt(stopTime);
  if (timeDiff > 10000) {
    localStorage.removeItem(key);
    return false;
  }

  return true;
};

export const clearChatResumeState = (chatId: string) => {
  if (typeof window === 'undefined') return;
  
  // Clear all resume-related localStorage keys for this chat
  localStorage.removeItem(`chat_resume_${chatId}`);
  localStorage.removeItem(`chat_state_${chatId}`);
  localStorage.setItem(`chat_resume_${chatId}`, 'stopped');
  localStorage.setItem('shouldAutoResume', 'false');
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatSDKError('offline:chat');
    }

    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}