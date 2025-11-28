import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChatService } from '../../../../core/services/chat.service';
import * as ChatActions from './chat.actions';
import { Message } from '../../models/chat.model';

@Injectable()
export class ChatEffects {
  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadConversations),
      switchMap(() =>
        this.chatService.getConversations().pipe(
          map((conversations) =>
            ChatActions.loadConversationsSuccess({
              conversations: conversations.map(c => ({
                id: c.id,
                title: c.title || 'New Conversation',
                lastMessage: '',
                timestamp: new Date(c.updated_at)
              }))
            })
          ),
          catchError((error) =>
            of(ChatActions.loadConversationsError({ error: error.message }))
          )
        )
      )
    )
  );

  loadChatHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChatHistory),
      switchMap(({ conversationId }) =>
        this.chatService.getChatHistory(conversationId).pipe(
          map((history) => {
            const messages: Message[] = history.map((msg: any) => ({
              id: Date.now().toString() + Math.random(),
              sender: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content.trim(),
              timestamp: new Date()
            }));
            return ChatActions.loadChatHistorySuccess({ messages });
          }),
          catchError((error) =>
            of(ChatActions.loadChatHistoryError({ error: error.message }))
          )
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      tap(({ content }) => {
        const userMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          content: content.trim(),
          timestamp: new Date()
        };
        this.store.dispatch(ChatActions.addMessage({ message: userMessage }));
      }),
      switchMap(({ content, conversationId }) =>
        this.chatService.sendMessage(content, conversationId).pipe(
          map((response) => {
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              content: response.response.trim(),
              timestamp: new Date()
            };
            return ChatActions.sendMessageSuccess({
              response: botMessage,
              conversationId: response.conversation_id
            });
          }),
          catchError((error) =>
            of(ChatActions.sendMessageError({ error: error.message }))
          )
        )
      )
    )
  );

  sendMessageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessageSuccess),
      tap(({ conversationId }) => {
        // Redirect to new conversation URL if backend created new one
        if (conversationId) {
          this.router.navigate(['/chat', conversationId]);
        }
      }),
      switchMap(() => of(ChatActions.loadConversations()))
    )
  );

  deleteConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.deleteConversation),
      switchMap(({ conversationId }) =>
        // TODO: Implement delete API endpoint in chat.service
        of(ChatActions.deleteConversationSuccess({ conversationId })).pipe(
          tap(() => {
            this.store.dispatch(ChatActions.loadConversations());
          }),
          catchError((error) =>
            of(ChatActions.deleteConversationError({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private chatService: ChatService,
    private router: Router,
    private store: Store
  ) {}
}
