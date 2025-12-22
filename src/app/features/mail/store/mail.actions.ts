import { createAction, props } from '@ngrx/store';
import { Email, MailFolder } from '../models/mail.model';
import { EmailListResponse, SyncStatusResponse } from '../services/mail.service';

// Sync
export const startSync = createAction(
    '[Mail] Start Sync',
    props<{ forceFull?: boolean; maxMessages?: number }>()
);
export const startSyncSuccess = createAction('[Mail] Start Sync Success');
export const startSyncFailure = createAction('[Mail] Start Sync Failure', props<{ error: any }>());

export const getSyncStatus = createAction('[Mail] Get Sync Status');
export const getSyncStatusSuccess = createAction('[Mail] Get Sync Status Success', props<{ status: SyncStatusResponse }>());
export const getSyncStatusFailure = createAction('[Mail] Get Sync Status Failure', props<{ error: any }>());

export const pollSyncStatus = createAction('[Mail] Poll Sync Status');
export const stopPollingSyncStatus = createAction('[Mail] Stop Polling Sync Status');

// Load Emails
export const loadEmails = createAction(
    '[Mail] Load Emails',
    props<{
        label?: string;
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
        starredOnly?: boolean;
    }>()
);

export const loadEmailsSuccess = createAction(
    '[Mail] Load Emails Success',
    props<{ response: EmailListResponse }>()
);

export const loadEmailsFailure = createAction(
    '[Mail] Load Emails Failure',
    props<{ error: any }>()
);

export const loadMoreEmails = createAction('[Mail] Load More Emails');

// Search
export const searchEmails = createAction(
    '[Mail] Search Emails',
    props<{ query: string; limit?: number }>()
);

export const searchEmailsSuccess = createAction(
    '[Mail] Search Emails Success',
    props<{ emails: Email[] }>()
);

export const searchEmailsFailure = createAction(
    '[Mail] Search Emails Failure',
    props<{ error: any }>()
);

export const clearSearch = createAction('[Mail] Clear Search');

// Unread Count
export const loadUnreadCount = createAction('[Mail] Load Unread Count');

export const loadUnreadCountSuccess = createAction(
    '[Mail] Load Unread Count Success',
    props<{ count: number }>()
);

export const loadUnreadCountFailure = createAction(
    '[Mail] Load Unread Count Failure',
    props<{ error: any }>()
);

// Labels
export const loadLabels = createAction('[Mail] Load Labels');

export const loadLabelsSuccess = createAction(
    '[Mail] Load Labels Success',
    props<{ labels: MailFolder[] }>()
);

export const loadLabelsFailure = createAction(
    '[Mail] Load Labels Failure',
    props<{ error: any }>()
);

// Send Email
export const sendEmail = createAction(
    '[Mail] Send Email',
    props<{ to: string; subject: string; body: string }>()
);

export const sendEmailSuccess = createAction(
    '[Mail] Send Email Success',
    props<{ email: Email }>()
);

export const sendEmailFailure = createAction(
    '[Mail] Send Email Failure',
    props<{ error: any }>()
);

// Mark Read/Unread
export const markAsRead = createAction(
    '[Mail] Mark As Read',
    props<{ id: string }>()
);

export const markAsReadSuccess = createAction(
    '[Mail] Mark As Read Success',
    props<{ id: string }>()
);

export const markAsReadFailure = createAction(
    '[Mail] Mark As Read Failure',
    props<{ error: any; id: string }>()
);

export const markAsUnread = createAction(
    '[Mail] Mark As Unread',
    props<{ id: string }>()
);

export const markAsUnreadSuccess = createAction(
    '[Mail] Mark As Unread Success',
    props<{ id: string }>()
);

export const markAsUnreadFailure = createAction(
    '[Mail] Mark As Unread Failure',
    props<{ error: any; id: string }>()
);

// Selection
export const selectFolder = createAction(
    '[Mail] Select Folder',
    props<{ folderId: string; unreadOnly?: boolean; starredOnly?: boolean }>()
);

export const selectEmail = createAction(
    '[Mail] Select Email',
    props<{ email: Email | null }>()
);

// Star/Unstar
export const toggleStar = createAction(
    '[Mail] Toggle Star',
    props<{ id: string; starred: boolean }>()
);

export const toggleStarSuccess = createAction(
    '[Mail] Toggle Star Success',
    props<{ id: string; starred: boolean }>()
);

export const toggleStarFailure = createAction(
    '[Mail] Toggle Star Failure',
    props<{ error: any; id: string; starred: boolean }>()
);

// Delete
export const deleteEmail = createAction(
    '[Mail] Delete Email',
    props<{ id: string }>()
);

export const deleteEmailSuccess = createAction(
    '[Mail] Delete Email Success',
    props<{ id: string }>()
);

export const deleteEmailFailure = createAction(
    '[Mail] Delete Email Failure',
    props<{ error: any; id: string }>()
);

// Compose
export const openCompose = createAction(
    '[Mail] Open Compose',
    props<{ mode: 'new' | 'reply' | 'forward' | 'edit'; email?: Email }>()
);

export const closeCompose = createAction('[Mail] Close Compose');
