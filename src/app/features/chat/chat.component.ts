import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { Message, ChatHistory, Suggestion } from './models/chat.model';
import { CHAT_SUGGESTIONS } from './models/chat.suggestions';
import * as ChatActions from './store/chat/chat.actions';
import * as ChatSelectors from './store/chat/chat.selectors';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef;
  @ViewChild('messageInput') private messageInput?: ElementRef;

  messages$: Observable<Message[]>;
  userMessage$: Observable<string>;
  isLoading$: Observable<boolean>;
  isChatStarted$: Observable<boolean>;
  chatHistory$: Observable<ChatHistory[]>;
  currentConversationId$: Observable<string>;

  currentUser: any = null;
  private shouldScrollToBottom = false;

  // Suggestions
  suggestions: Suggestion[] = CHAT_SUGGESTIONS;

  constructor(
    private authService: AuthService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.messages$ = this.store.select(ChatSelectors.selectMessages);
    this.userMessage$ = this.store.select(ChatSelectors.selectUserMessage);
    this.isLoading$ = this.store.select(ChatSelectors.selectIsLoading);
    this.isChatStarted$ = this.store.select(ChatSelectors.selectIsChatStarted);
    this.chatHistory$ = this.store.select(ChatSelectors.selectChatHistory);
    this.currentConversationId$ = this.store.select(ChatSelectors.selectCurrentConversationId);
  }

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Load initial conversations
    this.store.dispatch(ChatActions.loadConversations());

    // Parse URL to get conversation_id
    this.activatedRoute.params.subscribe(params => {
      const conversationId = params['conversationId'];
      if (conversationId) {
        let currentId: string | null = null;
        this.currentConversationId$.pipe(take(1)).subscribe((id: string) => currentId = id);

        if (currentId !== conversationId) {
          this.store.dispatch(ChatActions.setCurrentConversation({ conversationId }));
          this.store.dispatch(ChatActions.loadChatHistory({ conversationId }));
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  handleEnterKey(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    this.userMessage$.subscribe(userMessage => {
      if (!userMessage.trim()) {
        return;
      }

      this.currentConversationId$.subscribe(conversationId => {
        this.store.dispatch(ChatActions.sendMessage({
          content: userMessage,
          conversationId: conversationId || undefined
        }));
        this.store.dispatch(ChatActions.clearUserMessage());
        this.shouldScrollToBottom = true;
      }).unsubscribe();
    }).unsubscribe();
  }

  setUserMessage(message: string): void {
    this.store.dispatch(ChatActions.setUserMessage({ message }));
  }

  useSuggestion(prompt: string): void {
    this.store.dispatch(ChatActions.setUserMessage({ message: prompt }));
    // Focus on input
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 0);
  }

  startNewChat(): void {
    this.store.dispatch(ChatActions.startNewChat());
    this.router.navigate(['/chat']);
  }

  loadChat(conversationId: string): void {
    this.router.navigate(['/chat', conversationId]);
  }

  deleteConversation(conversationId: string, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(ChatActions.deleteConversation({ conversationId }));
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}

