import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Email } from '../../models/mail.model';
import * as MailActions from '../../store/mail.actions';
import * as MailSelectors from '../../store/mail.selectors';

@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailDetailComponent implements OnInit {
  email$: Observable<Email | null>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer
  ) {
    this.email$ = this.store.select(MailSelectors.selectSelectedEmail);
    this.loading$ = this.store.select(MailSelectors.selectLoading);
  }

  ngOnInit(): void {
  }

  deleteEmail() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email) {
        if (confirm('Are you sure you want to delete this email?')) {
          this.store.dispatch(MailActions.deleteEmail({ id: email.id }));
        }
      }
    });
  }

  toggleStar() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email) {
        this.store.dispatch(MailActions.toggleStar({ id: email.id, starred: !email.isStarred }));
      }
    });
  }

  markAsRead() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email && email.isUnread) {
        this.store.dispatch(MailActions.markAsRead({ id: email.id }));
      }
    });
  }

  markAsUnread() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email && !email.isUnread) {
        this.store.dispatch(MailActions.markAsUnread({ id: email.id }));
      }
    });
  }

  reply() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email) {
        this.store.dispatch(MailActions.openCompose({ mode: 'reply', email }));
      }
    });
  }

  forward() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email) {
        this.store.dispatch(MailActions.openCompose({ mode: 'forward', email }));
      }
    });
  }

  editDraft() {
    this.email$.pipe(take(1)).subscribe(email => {
      if (email) {
        this.store.dispatch(MailActions.openCompose({ mode: 'edit', email }));
      }
    });
  }

  isDraft(email: Email): boolean {
    return email.labels.includes('DRAFT');
  }

  getAvatar(email: string): string {
    const name = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getEmailContent(email: Email): SafeHtml | string {
    if (email.body_html) {
      return this.sanitizer.bypassSecurityTrustHtml(email.body_html);
    }
    return email.body_plain || '';
  }
}
