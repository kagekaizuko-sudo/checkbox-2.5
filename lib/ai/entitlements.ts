import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  maxWebSearchesPerDay: number; // Added for web search
  availableChatModelIds: Array<ChatModel['id']>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {

  guest: {
    maxMessagesPerDay: 200,
    maxWebSearchesPerDay: 10, 
    availableChatModelIds: ['chat-model', 'chat-model-reasoning'],
  },

 
  regular: {
    maxMessagesPerDay: 500,
    maxWebSearchesPerDay: 50,
    availableChatModelIds: ['chat-model', 'chat-model-reasoning', 'chat-model1', 'chat-model2', 'chat-model3'],
  },

};