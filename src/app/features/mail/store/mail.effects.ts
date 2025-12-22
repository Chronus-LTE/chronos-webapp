import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, interval } from 'rxjs';
import { map, mergeMap, catchError, switchMap, takeUntil, filter } from 'rxjs/operators';
import { MailService } from '../services/mail.service';
import * as MailActions from './mail.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class MailEffects {

    startSync$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.startSync),
        mergeMap(action => this.mailService.startSync(action.forceFull, action.maxMessages).pipe(
            map(() => {
                // Start polling sync status after starting sync
                this.store.dispatch(MailActions.pollSyncStatus());
                return MailActions.startSyncSuccess();
            }),
            catchError(error => of(MailActions.startSyncFailure({ error })))
        ))
    ));

    pollSyncStatus$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.pollSyncStatus),
        switchMap(() => interval(2000).pipe(
            switchMap(() => this.mailService.getSyncStatus().pipe(
                map(status => {
                    // Stop polling if sync is completed or failed
                    if (status.status === 'completed' || status.status === 'failed') {
                        this.store.dispatch(MailActions.stopPollingSyncStatus());
                        // Reload emails after sync completes
                        if (status.status === 'completed') {
                            this.store.dispatch(MailActions.loadEmails({ label: 'INBOX' }));
                            this.store.dispatch(MailActions.loadUnreadCount());
                        }
                    }
                    return MailActions.getSyncStatusSuccess({ status });
                }),
                catchError(error => of(MailActions.getSyncStatusFailure({ error })))
            )),
            takeUntil(this.actions$.pipe(ofType(MailActions.stopPollingSyncStatus)))
        ))
    ));

    getSyncStatus$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.getSyncStatus),
        mergeMap(() => this.mailService.getSyncStatus().pipe(
            map(status => MailActions.getSyncStatusSuccess({ status })),
            catchError(error => of(MailActions.getSyncStatusFailure({ error })))
        ))
    ));

    loadEmails$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.loadEmails),
        switchMap(action => this.mailService.getEmails({
            label: action.label,
            limit: action.limit || 20,
            offset: action.offset || 0,
            unreadOnly: action.unreadOnly,
            starredOnly: action.starredOnly
        }).pipe(
            map(response => MailActions.loadEmailsSuccess({ response })),
            catchError(error => of(MailActions.loadEmailsFailure({ error })))
        ))
    ));

    loadMoreEmails$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.loadMoreEmails),
        switchMap(() => {
            // This will be handled by the component/selector to get current state
            // and dispatch loadEmails with incremented offset
            return of({ type: 'NO_OP' });
        })
    ), { dispatch: false });

    searchEmails$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.searchEmails),
        switchMap(action => this.mailService.searchEmails(action.query, action.limit).pipe(
            map(emails => MailActions.searchEmailsSuccess({ emails })),
            catchError(error => of(MailActions.searchEmailsFailure({ error })))
        ))
    ));

    loadUnreadCount$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.loadUnreadCount),
        mergeMap(() => this.mailService.getUnreadCount().pipe(
            map(count => MailActions.loadUnreadCountSuccess({ count })),
            catchError(error => of(MailActions.loadUnreadCountFailure({ error })))
        ))
    ));

    loadLabels$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.loadLabels),
        mergeMap(() => this.mailService.getLabels().pipe(
            map(labels => MailActions.loadLabelsSuccess({ labels })),
            catchError(error => of(MailActions.loadLabelsFailure({ error })))
        ))
    ));

    sendEmail$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.sendEmail),
        mergeMap(action => this.mailService.sendEmail(action.to, action.subject, action.body).pipe(
            map(email => MailActions.sendEmailSuccess({ email })),
            catchError(error => of(MailActions.sendEmailFailure({ error })))
        ))
    ));

    markAsRead$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.markAsRead),
        mergeMap(action => this.mailService.markAsRead(action.id).pipe(
            map(() => {
                // Update unread count after marking as read
                this.store.dispatch(MailActions.loadUnreadCount());
                return MailActions.markAsReadSuccess({ id: action.id });
            }),
            catchError(error => of(MailActions.markAsReadFailure({ error, id: action.id })))
        ))
    ));

    markAsUnread$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.markAsUnread),
        mergeMap(action => this.mailService.markAsUnread(action.id).pipe(
            map(() => {
                // Update unread count after marking as unread
                this.store.dispatch(MailActions.loadUnreadCount());
                return MailActions.markAsUnreadSuccess({ id: action.id });
            }),
            catchError(error => of(MailActions.markAsUnreadFailure({ error, id: action.id })))
        ))
    ));

    deleteEmail$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.deleteEmail),
        mergeMap(action => this.mailService.deleteEmail(action.id).pipe(
            map(() => MailActions.deleteEmailSuccess({ id: action.id })),
            catchError(error => of(MailActions.deleteEmailFailure({ error, id: action.id })))
        ))
    ));

    toggleStar$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.toggleStar),
        mergeMap(action => {
            const obs = action.starred
                ? this.mailService.starEmail(action.id)
                : this.mailService.unstarEmail(action.id);
            return obs.pipe(
                map(() => MailActions.toggleStarSuccess({ id: action.id, starred: action.starred })),
                catchError(error => of(MailActions.toggleStarFailure({ error, id: action.id, starred: action.starred })))
            );
        })
    ));

    // Reload emails when folder changes
    selectFolder$ = createEffect(() => this.actions$.pipe(
        ofType(MailActions.selectFolder),
        map(action => MailActions.loadEmails({
            label: action.folderId,
            unreadOnly: action.unreadOnly,
            starredOnly: action.starredOnly
        }))
    ));

    constructor(
        private actions$: Actions,
        private mailService: MailService,
        private store: Store
    ) { }
}
