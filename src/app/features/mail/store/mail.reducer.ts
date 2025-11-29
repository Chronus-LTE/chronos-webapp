import { createReducer, on } from '@ngrx/store';
import { Email, MailFolder } from '../models/mail.model';
import { SyncStatusResponse } from '../services/mail.service';
import * as MailActions from './mail.actions';

export interface MailState {
    emails: Email[];
    loading: boolean;
    error: any;
    selectedFolderId: string;
    selectedEmail: Email | null;
    unreadCount: number;
    folders: MailFolder[];

    // Pagination
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;

    // Sync
    syncing: boolean;
    syncStatus: SyncStatusResponse | null;

    // Filters
    currentFilters: {
        label?: string;
        unreadOnly?: boolean;
        starredOnly?: boolean;
    };

    // Search
    searchQuery: string | null;
    isSearching: boolean;

    // Compose
    isComposeOpen: boolean;
    composeMode: 'new' | 'reply' | 'forward' | 'edit';
    composeEmail: Email | null;
}

export const initialState: MailState = {
    emails: [],
    loading: false,
    error: null,
    selectedFolderId: 'INBOX',
    selectedEmail: null,
    unreadCount: 0,
    folders: [],

    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,

    syncing: false,
    syncStatus: null,

    currentFilters: {},

    searchQuery: null,
    isSearching: false,

    isComposeOpen: false,
    composeMode: 'new',
    composeEmail: null
};

export const mailReducer = createReducer(
    initialState,

    // Sync
    on(MailActions.startSync, state => ({
        ...state,
        syncing: true,
        error: null
    })),
    on(MailActions.startSyncSuccess, state => ({
        ...state,
        syncing: true // Keep syncing true until we get status updates
    })),
    on(MailActions.startSyncFailure, (state, { error }) => ({
        ...state,
        syncing: false,
        error
    })),
    on(MailActions.getSyncStatusSuccess, (state, { status }) => ({
        ...state,
        syncStatus: status,
        syncing: status.status === 'syncing'
    })),
    on(MailActions.getSyncStatusFailure, (state, { error }) => ({
        ...state,
        error
    })),

    // Load Emails
    on(MailActions.loadEmails, (state, action) => ({
        ...state,
        loading: true,
        error: null,
        currentFilters: {
            label: action.label,
            unreadOnly: action.unreadOnly,
            starredOnly: action.starredOnly
        },
        searchQuery: null,
        isSearching: false
    })),
    on(MailActions.loadEmailsSuccess, (state, { response }) => ({
        ...state,
        loading: false,
        emails: response.emails,
        total: response.total,
        limit: response.limit,
        offset: response.offset,
        hasMore: response.has_more
    })),
    on(MailActions.loadEmailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Search
    on(MailActions.searchEmails, (state, { query }) => ({
        ...state,
        loading: true,
        error: null,
        searchQuery: query,
        isSearching: true
    })),
    on(MailActions.searchEmailsSuccess, (state, { emails }) => ({
        ...state,
        loading: false,
        emails,
        total: emails.length,
        offset: 0,
        hasMore: false
    })),
    on(MailActions.searchEmailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(MailActions.clearSearch, state => ({
        ...state,
        searchQuery: null,
        isSearching: false
    })),

    // Unread Count
    on(MailActions.loadUnreadCountSuccess, (state, { count }) => ({
        ...state,
        unreadCount: count
    })),

    // Labels
    on(MailActions.loadLabelsSuccess, (state, { labels }) => ({
        ...state,
        folders: labels
    })),

    // Selection
    on(MailActions.selectFolder, (state, { folderId }) => ({
        ...state,
        selectedFolderId: folderId,
        selectedEmail: null,
        offset: 0
    })),
    on(MailActions.selectEmail, (state, { email }) => ({
        ...state,
        selectedEmail: email
    })),

    // Mark Read/Unread
    on(MailActions.markAsReadSuccess, (state, { id }) => ({
        ...state,
        emails: state.emails.map(email =>
            email.id === id ? { ...email, isUnread: false } : email
        ),
        selectedEmail: state.selectedEmail && state.selectedEmail.id === id
            ? { ...state.selectedEmail, isUnread: false }
            : state.selectedEmail
    })),
    on(MailActions.markAsUnreadSuccess, (state, { id }) => ({
        ...state,
        emails: state.emails.map(email =>
            email.id === id ? { ...email, isUnread: true } : email
        ),
        selectedEmail: state.selectedEmail && state.selectedEmail.id === id
            ? { ...state.selectedEmail, isUnread: true }
            : state.selectedEmail
    })),

    // Delete
    on(MailActions.deleteEmailSuccess, (state, { id }) => ({
        ...state,
        emails: state.emails.filter(email => email.id !== id),
        selectedEmail: state.selectedEmail && state.selectedEmail.id === id
            ? null
            : state.selectedEmail,
        total: state.total - 1
    })),

    // Star/Unstar
    on(MailActions.toggleStarSuccess, (state, { id, starred }) => ({
        ...state,
        emails: state.emails.map(email =>
            email.id === id ? { ...email, isStarred: starred } : email
        ),
        selectedEmail: state.selectedEmail && state.selectedEmail.id === id
            ? { ...state.selectedEmail, isStarred: starred }
            : state.selectedEmail
    })),

    // Compose
    on(MailActions.openCompose, (state, { mode, email }) => ({
        ...state,
        isComposeOpen: true,
        composeMode: mode,
        composeEmail: email || null
    })),
    on(MailActions.closeCompose, state => ({
        ...state,
        isComposeOpen: false,
        composeMode: 'new',
        composeEmail: null
    }))
);
