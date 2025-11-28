import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.state';

const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectMessages = createSelector(
  selectChatState,
  (state: ChatState) => state.messages
);

export const selectChatHistory = createSelector(
  selectChatState,
  (state: ChatState) => state.chatHistory
);

export const selectCurrentConversationId = createSelector(
  selectChatState,
  (state: ChatState) => state.currentConversationId
);

export const selectIsChatStarted = createSelector(
  selectChatState,
  (state: ChatState) => state.isChatStarted
);

export const selectIsLoading = createSelector(
  selectChatState,
  (state: ChatState) => state.isLoading
);

export const selectUserMessage = createSelector(
  selectChatState,
  (state: ChatState) => state.userMessage
);

export const selectError = createSelector(
  selectChatState,
  (state: ChatState) => state.error
);
