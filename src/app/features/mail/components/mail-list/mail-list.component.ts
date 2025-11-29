import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Email } from '../../models/mail.model';
import * as MailActions from '../../store/mail.actions';
import * as MailSelectors from '../../store/mail.selectors';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  emails$: Observable<Email[]>;
  selectedEmail$: Observable<Email | null>;
  loading$: Observable<boolean>;
  pagination$: Observable<any>;
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.emails$ = this.store.select(MailSelectors.selectEmails);
    this.selectedEmail$ = this.store.select(MailSelectors.selectSelectedEmail);
    this.loading$ = this.store.select(MailSelectors.selectLoading);
    this.pagination$ = this.store.select(MailSelectors.selectPagination);
  }

  ngOnInit(): void {
    // Handle search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query && query.trim().length > 0) {
        this.store.dispatch(MailActions.searchEmails({ query, limit: 20 }));
      } else {
        this.store.dispatch(MailActions.clearSearch());
        // Reload current folder
        combineLatest([
          this.store.select(MailSelectors.selectCurrentFilters)
        ]).pipe(take(1)).subscribe(([filters]) => {
          this.store.dispatch(MailActions.loadEmails({
            label: filters.label,
            unreadOnly: filters.unreadOnly,
            starredOnly: filters.starredOnly,
            limit: 20,
            offset: 0
          }));
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectEmail(email: Email) {
    this.store.dispatch(MailActions.selectEmail({ email }));
    if (email.isUnread) {
      this.store.dispatch(MailActions.markAsRead({ id: email.id }));
    }
  }

  toggleStar(event: Event, email: Email) {
    event.stopPropagation();
    this.store.dispatch(MailActions.toggleStar({ id: email.id, starred: !email.isStarred }));
  }

  deleteEmail(event: Event, email: Email) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this email?')) {
      this.store.dispatch(MailActions.deleteEmail({ id: email.id }));
    }
  }

  toggleRead(event: Event, email: Email) {
    event.stopPropagation();
    if (email.isUnread) {
      this.store.dispatch(MailActions.markAsRead({ id: email.id }));
    } else {
      this.store.dispatch(MailActions.markAsUnread({ id: email.id }));
    }
  }

  loadMore() {
    combineLatest([
      this.pagination$,
      this.store.select(MailSelectors.selectCurrentFilters)
    ]).pipe(take(1)).subscribe(([pagination, filters]) => {
      if (pagination.hasMore) {
        this.store.dispatch(MailActions.loadEmails({
          label: filters.label,
          unreadOnly: filters.unreadOnly,
          starredOnly: filters.starredOnly,
          limit: pagination.limit,
          offset: pagination.offset + pagination.limit
        }));
      }
    });
  }

  goToPage(page: number) {
    combineLatest([
      this.pagination$,
      this.store.select(MailSelectors.selectCurrentFilters)
    ]).pipe(take(1)).subscribe(([pagination, filters]) => {
      this.store.dispatch(MailActions.loadEmails({
        label: filters.label,
        unreadOnly: filters.unreadOnly,
        starredOnly: filters.starredOnly,
        limit: pagination.limit,
        offset: page * pagination.limit
      }));
    });
  }
}
