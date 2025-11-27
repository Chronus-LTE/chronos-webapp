import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface Suggestion {
  icon: string;
  title: string;
  description: string;
  prompt: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef;
  @ViewChild('messageInput') private messageInput?: ElementRef;

  messages: Message[] = [];
  userMessage = '';
  isLoading = false;
  isChatStarted = false;
  currentChatId = '';
  currentUser: any = null;
  private shouldScrollToBottom = false;

  // Chat history (mockup data)
  chatHistory: ChatHistory[] = [
    {
      id: '1',
      title: 'Daily productivity planning',
      lastMessage: 'Help me prioritize my tasks for this week',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      title: 'Career development goals',
      lastMessage: 'What skills should I develop next?',
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  // Suggestions (mockup data)
  suggestions: Suggestion[] = [
    {
      icon: 'fas fa-list-check',
      title: 'Organize my day',
      description: 'create a productive schedule and task list',
      prompt: 'Help me organize my tasks for today and create a productive schedule'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Get creative ideas',
      description: 'brainstorm new projects and initiatives',
      prompt: 'I need creative ideas and brainstorming help for a new project'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Learn something new',
      description: 'explore topics and deepen your knowledge',
      prompt: 'What are some interesting topics I should learn about? Help me create a learning plan'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Analyze and decide',
      description: 'weigh options and make better decisions',
      prompt: 'Help me analyze a decision I need to make and provide pros and cons'
    }
  ];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
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
    if (!this.userMessage.trim()) {
      return;
    }

    // Start chat if not started
    if (!this.isChatStarted) {
      this.isChatStarted = true;
      this.currentChatId = Date.now().toString();
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: this.userMessage,
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    // Clear input
    const messageContent = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;
    this.shouldScrollToBottom = true;

    // TODO: Send message to backend API
    // For now, just simulate a response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: 'I received your message: "' + messageContent + '". This is a demo response. The actual AI integration will be implemented soon.',
        timestamp: new Date()
      };
      this.messages.push(botMsg);
      this.isLoading = false;
      this.shouldScrollToBottom = true;

      // Update chat history
      this.updateChatHistory(messageContent);
    }, 1500);
  }

  useSuggestion(prompt: string): void {
    this.userMessage = prompt;
    // Focus on input
    setTimeout(() => {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }, 0);
  }

  startNewChat(): void {
    this.messages = [];
    this.isChatStarted = false;
    this.currentChatId = '';
    this.userMessage = '';
  }

  loadChat(chatId: string): void {
    // TODO: Load chat from backend
    this.currentChatId = chatId;
    this.isChatStarted = true;
    this.messages = [
      {
        id: '1',
        sender: 'user',
        content: 'This is a loaded conversation',
        timestamp: new Date()
      },
      {
        id: '2',
        sender: 'assistant',
        content: 'This feature will load previous conversations from the backend.',
        timestamp: new Date()
      }
    ];
    this.shouldScrollToBottom = true;
  }

  deleteChat(chatId: string, event: Event): void {
    event.stopPropagation();
    this.chatHistory = this.chatHistory.filter(chat => chat.id !== chatId);
    if (this.currentChatId === chatId) {
      this.startNewChat();
    }
  }

  private updateChatHistory(firstMessage: string): void {
    const existingChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
    if (!existingChat) {
      // Add new chat to history
      const title = firstMessage.length > 40
        ? firstMessage.substring(0, 40) + '...'
        : firstMessage;

      this.chatHistory.unshift({
        id: this.currentChatId,
        title: title,
        lastMessage: firstMessage,
        timestamp: new Date()
      });
    }
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

