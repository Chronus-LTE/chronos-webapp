import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userMessage = '';
  isLoading = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Add welcome message
    this.messages.push({
      id: '1',
      sender: 'assistant',
      content: 'Hello! I\'m Chronus, your AI assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) {
      return;
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
    this.userMessage = '';
    this.isLoading = true;

    // TODO: Send message to backend API
    // For now, just simulate a response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: 'I received your message: "' + userMsg.content + '". (This is a demo response)',
        timestamp: new Date()
      };
      this.messages.push(botMsg);
      this.isLoading = false;
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
  }
}
