import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MailState } from './mail.reducer';

export const selectMailState = createFeatureSelector<MailState>('mail');

export const selectEmails = createSelector(
    selectMailState,
    (state: MailState) => state.emails
);

export const selectLoading = createSelector(
    selectMailState,
    (state: MailState) => state.loading
);

export const selectError = createSelector(
    selectMailState,
    (state: MailState) => state.error
);

export const selectSelectedFolderId = createSelector(
    selectMailState,
    (state: MailState) => state.selectedFolderId
);

export const selectSelectedEmail = createSelector(
    selectMailState,
    (state: MailState) => state.selectedEmail
);

export const selectUnreadCount = createSelector(
    selectMailState,
    (state: MailState) => state.unreadCount
);

export const selectFolders = createSelector(
    selectMailState,
    (state: MailState) => state.folders
);

// Pagination selectors
export const selectPagination = createSelector(
    selectMailState,
    (state: MailState) => ({
        total: state.total,
        limit: state.limit,
        offset: state.offset,
        hasMore: state.hasMore,
        currentPage: Math.floor(state.offset / state.limit),
        totalPages: Math.ceil(state.total / state.limit)
    })
);

export const selectHasMore = createSelector(
    selectMailState,
    (state: MailState) => state.hasMore
);

// Sync selectors
export const selectSyncing = createSelector(
    selectMailState,
    (state: MailState) => state.syncing
);

export const selectSyncStatus = createSelector(
    selectMailState,
    (state: MailState) => state.syncStatus
);

export const selectSyncProgress = createSelector(
    selectSyncStatus,
    (status) => status ? {
        percentage: status.progress_percentage,
        synced: status.synced_messages,
        total: status.total_messages,
        status: status.status
    } : null
);

// Filter selectors
export const selectCurrentFilters = createSelector(
    selectMailState,
    (state: MailState) => state.currentFilters
);

// Search selectors
export const selectSearchQuery = createSelector(
    selectMailState,
    (state: MailState) => state.searchQuery
);

export const selectIsSearching = createSelector(
    selectMailState,
    (state: MailState) => state.isSearching
);

// Compose selectors
export const selectIsComposeOpen = createSelector(
    selectMailState,
    (state: MailState) => state.isComposeOpen
);

export const selectComposeMode = createSelector(
    selectMailState,
    (state: MailState) => state.composeMode
);

export const selectComposeEmail = createSelector(
    selectMailState,
    (state: MailState) => state.composeEmail
);
