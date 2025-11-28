import { createAction, props } from '@ngrx/store';
import { Message, ChatHistory } from '../../models/chat.model';

// Load Conversations
export const loadConversations = createAction(
  '[Chat] Load Conversations'
);

export const loadConversationsSuccess = createAction(
  '[Chat] Load Conversations Success',
  props<{ conversations: ChatHistory[] }>()
);

export const loadConversationsError = createAction(
  '[Chat] Load Conversations Error',
  props<{ error: string }>()
);

// Load Chat History
export const loadChatHistory = createAction(
  '[Chat] Load Chat History',
  props<{ conversationId: string }>()
);

export const loadChatHistorySuccess = createAction(
  '[Chat] Load Chat History Success',
  props<{ messages: Message[] }>()
);

export const loadChatHistoryError = createAction(
  '[Chat] Load Chat History Error',
  props<{ error: string }>()
);

// Send Message
export const sendMessage = createAction(
  '[Chat] Send Message',
  props<{ content: string; conversationId?: string }>()
);

export const sendMessageSuccess = createAction(
  '[Chat] Send Message Success',
  props<{ response: Message; conversationId?: string }>()
);

export const sendMessageError = createAction(
  '[Chat] Send Message Error',
  props<{ error: string }>()
);

// Add Message (for immediately adding user or assistant messages)
export const addMessage = createAction(
  '[Chat] Add Message',
  props<{ message: Message }>()
);

// Set User Message
export const setUserMessage = createAction(
  '[Chat] Set User Message',
  props<{ message: string }>()
);

// Clear User Message
export const clearUserMessage = createAction(
  '[Chat] Clear User Message'
);

// Start New Chat
export const startNewChat = createAction(
  '[Chat] Start New Chat'
);

// Set Current Conversation
export const setCurrentConversation = createAction(
  '[Chat] Set Current Conversation',
  props<{ conversationId: string }>()
);

// Delete Conversation
export const deleteConversation = createAction(
  '[Chat] Delete Conversation',
  props<{ conversationId: string }>()
);

export const deleteConversationSuccess = createAction(
  '[Chat] Delete Conversation Success',
  props<{ conversationId: string }>()
);

export const deleteConversationError = createAction(
  '[Chat] Delete Conversation Error',
  props<{ error: string }>()
);
