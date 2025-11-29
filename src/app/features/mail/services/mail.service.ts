import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Email, MailFolder } from '../models/mail.model';
import { environment } from 'src/environments/environment';

export interface EmailListResponse {
    emails: Email[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

export interface SyncStatusResponse {
    status: 'pending' | 'syncing' | 'completed' | 'failed';
    sync_type: 'initial' | 'incremental';
    total_messages: number;
    synced_messages: number;
    failed_messages: number;
    progress_percentage: number;
    last_sync_date: string | null;
    last_error: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class MailService {
    private apiUrl = `${environment.apiUrl}/gmail`;

    constructor(private http: HttpClient) { }

    // --- Sync ---

    startSync(forceFull: boolean = false, maxMessages: number = 1000): Observable<any> {
        return this.http.post(`${this.apiUrl}/sync`, {
            force_full: forceFull,
            max_messages: maxMessages
        });
    }

    getSyncStatus(): Observable<SyncStatusResponse> {
        return this.http.get<SyncStatusResponse>(`${this.apiUrl}/sync/status`);
    }

    // --- Emails ---

    getEmails(options: {
        label?: string;
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
        starredOnly?: boolean;
    } = {}): Observable<EmailListResponse> {
        let params = new HttpParams();

        if (options.label) {
            params = params.set('label', options.label);
        }
        if (options.limit !== undefined) {
            params = params.set('limit', options.limit.toString());
        }
        if (options.offset !== undefined) {
            params = params.set('offset', options.offset.toString());
        }
        if (options.unreadOnly) {
            params = params.set('unread_only', 'true');
        }
        if (options.starredOnly) {
            params = params.set('starred_only', 'true');
        }

        return this.http.get<{ emails: any[], total: number, limit: number, offset: number, has_more: boolean }>(`${this.apiUrl}/emails`, { params }).pipe(
            map(response => ({
                emails: (response.emails || []).map((email: any) => this.mapToEmailModel(email)),
                total: response.total,
                limit: response.limit,
                offset: response.offset,
                has_more: response.has_more
            }))
        );
    }

    searchEmails(query: string, limit: number = 20): Observable<Email[]> {
        const params = new HttpParams()
            .set('q', query)
            .set('limit', limit.toString());

        return this.http.get<{ emails: any[] }>(`${this.apiUrl}/search`, { params }).pipe(
            map(response => (response.emails || []).map((email: any) => this.mapToEmailModel(email)))
        );
    }

    getEmail(id: string): Observable<Email> {
        return this.http.get<any>(`${this.apiUrl}/emails/${id}`).pipe(
            map(email => this.mapToEmailModel(email))
        );
    }

    deleteEmail(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/emails/${id}`);
    }

    sendEmail(to: string, subject: string, body: string): Observable<Email> {
        return this.http.post<any>(`${this.apiUrl}/send`, { to, subject, body }).pipe(
            map(email => this.mapToEmailModel(email))
        );
    }

    markAsRead(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/emails/${id}/mark-read`, {});
    }

    markAsUnread(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/emails/${id}/mark-unread`, {});
    }

    starEmail(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/emails/${id}/star`, {});
    }

    unstarEmail(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/emails/${id}/unstar`, {});
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<{ unread_count: number }>(`${this.apiUrl}/unread-count`).pipe(
            map(response => response.unread_count)
        );
    }

    // --- Helper methods ---

    getLabels(): Observable<MailFolder[]> {
        // Return default labels based on Gmail standard labels
        return new Observable(observer => {
            const defaultFolders: MailFolder[] = [
                { id: 'INBOX', name: 'Inbox', icon: 'inbox', type: 'system' },
                { id: 'SENT', name: 'Sent', icon: 'send', type: 'system' },
                { id: 'DRAFT', name: 'Drafts', icon: 'file', type: 'system' },
                { id: 'STARRED', name: 'Starred', icon: 'star', type: 'system' },
                { id: 'TRASH', name: 'Trash', icon: 'trash-2', type: 'system' },
                { id: 'SPAM', name: 'Spam', icon: 'alert-circle', type: 'system' }
            ];
            observer.next(defaultFolders);
            observer.complete();
        });
    }

    getSystemFolders(): MailFolder[] {
        return [
            { id: 'INBOX', name: 'Inbox', icon: 'inbox', type: 'system' },
            { id: 'SENT', name: 'Sent', icon: 'send', type: 'system' },
            { id: 'DRAFT', name: 'Drafts', icon: 'file-text', type: 'system' },
            { id: 'STARRED', name: 'Starred', icon: 'star', type: 'system' },
            { id: 'IMPORTANT', name: 'Important', icon: 'flag', type: 'system' },
            { id: 'SPAM', name: 'Spam', icon: 'alert-circle', type: 'system' },
            { id: 'TRASH', name: 'Trash', icon: 'trash-2', type: 'system' }
        ];
    }

    private mapToEmailModel(apiEmail: any): Email {
        return {
            id: apiEmail.id?.toString() || apiEmail.gmail_id,
            gmail_id: apiEmail.gmail_id,
            thread_id: apiEmail.thread_id,
            subject: apiEmail.subject || '(No Subject)',
            from: apiEmail.from || '',
            to: apiEmail.to || '',
            cc: apiEmail.cc,
            snippet: apiEmail.snippet || '',
            body_plain: apiEmail.body_plain || '',
            date: new Date(apiEmail.date),
            labels: apiEmail.labels || [],
            isUnread: apiEmail.isUnread ?? false,
            isStarred: apiEmail.isStarred ?? false,
            is_important: apiEmail.is_important || false,
            has_attachments: apiEmail.has_attachments || false,
            attachments: apiEmail.attachments?.map((att: any) => ({
                id: att.id?.toString(),
                filename: att.filename,
                mime_type: att.mime_type,
                size: att.size,
                is_downloaded: att.is_downloaded || false
            })) || []
        };
    }
}
