import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as MailActions from './store/mail.actions';
import * as MailSelectors from './store/mail.selectors';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit, OnDestroy {
  syncStatus$: Observable<any>;
  syncing$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.syncStatus$ = this.store.select(MailSelectors.selectSyncProgress);
    this.syncing$ = this.store.select(MailSelectors.selectSyncing);
  }

  ngOnInit() {
    // Check sync status first
    this.store.dispatch(MailActions.getSyncStatus());

    // Subscribe to sync status to determine if we need to start sync
    this.store.select(MailSelectors.selectSyncStatus).pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {
      if (status && status.status === 'pending') {
        // Start initial sync if not synced yet
        this.store.dispatch(MailActions.startSync({ forceFull: false, maxMessages: 1000 }));
      } else if (status && status.status === 'completed') {
        // Load data if sync is already completed
        this.loadInitialData();
      }
    });

    // Load initial data anyway (will show cached data if available)
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(MailActions.stopPollingSyncStatus());
  }

  private loadInitialData() {
    this.store.dispatch(MailActions.loadLabels());
    this.store.dispatch(MailActions.loadUnreadCount());
    this.store.dispatch(MailActions.loadEmails({ label: 'INBOX', limit: 20, offset: 0 }));
  }
}
