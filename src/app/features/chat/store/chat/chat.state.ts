import { Message, ChatHistory } from '../../models/chat.model';

export interface ChatState {
  messages: Message[];
  chatHistory: ChatHistory[];
  currentConversationId: string;
  isChatStarted: boolean;
  isLoading: boolean;
  userMessage: string;
  error: string | null;
}

export const initialChatState: ChatState = {
  messages: [],
  chatHistory: [],
  currentConversationId: '',
  isChatStarted: false,
  isLoading: false,
  userMessage: '',
  error: null
};
