export interface Email {
    id: string;
    gmail_id: string;
    thread_id: string;
    subject: string;
    from: string;
    to: string;
    cc?: string;
    snippet: string;
    body_plain?: string;
    body_html?: string;
    date: Date;
    labels: string[];
    isUnread: boolean;
    isStarred: boolean;
    is_important?: boolean;
    has_attachments: boolean;
    attachments?: EmailAttachment[];
}

export interface EmailAttachment {
    id: string;
    filename: string;
    mime_type?: string;
    size?: number;
    is_downloaded: boolean;
}

export interface EmailThread {
    id: string;
    gmail_thread_id: string;
    subject: string;
    snippet?: string;
    message_count: number;
    participants?: string[];
    isUnread: boolean;
    isStarred: boolean;
    has_attachments: boolean;
    first_message_date?: Date;
    last_message_date: Date;
}

export interface MailFolder {
    id: string;
    name: string;
    gmail_label_id?: string;
    icon: string;
    type: 'system' | 'custom';
    total_messages?: number;
    unread_messages?: number;
}

export type FolderType = 'INBOX' | 'SENT' | 'DRAFT' | 'TRASH' | 'SPAM' | 'STARRED' | 'IMPORTANT';

export const SYSTEM_FOLDERS: Record<FolderType, { name: string; icon: string; label: string }> = {
    INBOX: { name: 'Inbox', icon: 'inbox', label: 'INBOX' },
    SENT: { name: 'Sent', icon: 'send', label: 'SENT' },
    DRAFT: { name: 'Drafts', icon: 'file-text', label: 'DRAFT' },
    TRASH: { name: 'Trash', icon: 'trash-2', label: 'TRASH' },
    SPAM: { name: 'Spam', icon: 'alert-circle', label: 'SPAM' },
    STARRED: { name: 'Starred', icon: 'star', label: 'STARRED' },
    IMPORTANT: { name: 'Important', icon: 'flag', label: 'IMPORTANT' }
};
