import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = `${environment.apiUrl}/chat`;

    constructor(private http: HttpClient) { }

    sendMessage(message: string, conversationId?: string): Observable<any> {
        const payload: any = { message };
        if (conversationId) {
            payload.conversation_id = conversationId;
        }
        return this.http.post<any>(`${this.apiUrl}/`, payload);
    }

    getConversations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/conversations`);
    }

    getChatHistory(conversationId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${conversationId}`);
    }

    deleteConversation(conversationId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${conversationId}`);
    }
}
