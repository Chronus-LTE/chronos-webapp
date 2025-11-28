export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export interface Suggestion {
  icon: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ChatResponse {
  response: string;
}

export interface ConversationData {
  id: string;
  title?: string;
  updated_at: string;
}

export interface MessageData {
  role: 'user' | 'assistant';
  content: string;
}
