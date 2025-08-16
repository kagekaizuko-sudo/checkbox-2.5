'use client';

import { Chat } from '@/components/chat';
import { useWebSearchState } from '@/hooks/use-web-search-state';
import type { Session } from 'next-auth';
import type { UIMessage } from '@/lib/types';

interface ChatWrapperProps {
  id: string;
  initialMessages: UIMessage[];
  initialChatModel: string;
  initialVisibilityType: 'private' | 'public';
  isReadonly: boolean;
  session: Session;
  autoResume: boolean;
}

export function ChatWrapper(props: ChatWrapperProps) {
  const webSearchState = useWebSearchState();

  return (
    <Chat
      {...props}
      webSearchState={webSearchState}
    />
  );
}