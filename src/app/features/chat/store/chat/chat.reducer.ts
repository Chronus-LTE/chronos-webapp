import { createReducer, on } from '@ngrx/store';
import * as ChatActions from './chat.actions';
import { ChatState, initialChatState } from './chat.state';

export const chatReducer = createReducer(
  initialChatState,

  // Load Conversations
  on(ChatActions.loadConversations, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ChatActions.loadConversationsSuccess, (state, { conversations }) => ({
    ...state,
    chatHistory: conversations,
    isLoading: false,
    error: null
  })),

  on(ChatActions.loadConversationsError, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Chat History
  on(ChatActions.loadChatHistory, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ChatActions.loadChatHistorySuccess, (state, { messages }) => ({
    ...state,
    messages,
    isLoading: false,
    isChatStarted: true,
    error: null
  })),

  on(ChatActions.loadChatHistoryError, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Send Message
  on(ChatActions.sendMessage, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ChatActions.sendMessageSuccess, (state, { response, conversationId }) => ({
    ...state,
    messages: [...state.messages, response],
    currentConversationId: conversationId || state.currentConversationId,
    isLoading: false,
    isChatStarted: true,
    error: null
  })),

  on(ChatActions.sendMessageError, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Add Message
  on(ChatActions.addMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  })),

  // Set User Message
  on(ChatActions.setUserMessage, (state, { message }) => ({
    ...state,
    userMessage: message
  })),

  // Clear User Message
  on(ChatActions.clearUserMessage, (state) => ({
    ...state,
    userMessage: ''
  })),

  // Start New Chat
  on(ChatActions.startNewChat, (state) => ({
    ...state,
    messages: [],
    currentConversationId: '',
    isChatStarted: false,
    userMessage: '',
    error: null
  })),

  // Set Current Conversation
  on(ChatActions.setCurrentConversation, (state, { conversationId }) => ({
    ...state,
    currentConversationId: conversationId,
    isChatStarted: true
  })),

  // Delete Conversation
  on(ChatActions.deleteConversationSuccess, (state, { conversationId }) => ({
    ...state,
    chatHistory: state.chatHistory.filter(chat => chat.id !== conversationId),
    currentConversationId: state.currentConversationId === conversationId ? '' : state.currentConversationId,
    messages: state.currentConversationId === conversationId ? [] : state.messages,
    isChatStarted: state.currentConversationId === conversationId ? false : state.isChatStarted
  })),

  on(ChatActions.deleteConversationError, (state, { error }) => ({
    ...state,
    error
  }))
);
