import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MailFolder } from '../../models/mail.model';
import { MailService } from '../../services/mail.service';
import * as MailActions from '../../store/mail.actions';
import * as MailSelectors from '../../store/mail.selectors';

@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit {
  folders$: Observable<MailFolder[]>;
  selectedFolder$: Observable<string>;
  unreadCount$: Observable<number>;
  isComposeOpen$: Observable<boolean>;

  // Filter states
  showUnreadOnly = false;
  showStarredOnly = false;

  constructor(
    private store: Store,
    private mailService: MailService
  ) {
    this.folders$ = this.store.select(MailSelectors.selectFolders);
    this.selectedFolder$ = this.store.select(MailSelectors.selectSelectedFolderId);
    this.unreadCount$ = this.store.select(MailSelectors.selectUnreadCount);
    this.isComposeOpen$ = this.store.select(MailSelectors.selectIsComposeOpen);
  }

  ngOnInit(): void {
    // Load system folders from service
    const systemFolders = this.mailService.getSystemFolders();
    this.store.dispatch(MailActions.loadLabelsSuccess({ labels: systemFolders }));
  }

  openCompose() {
    this.store.dispatch(MailActions.openCompose({ mode: 'new' }));
  }

  closeCompose() {
    this.store.dispatch(MailActions.closeCompose());
  }

  selectFolder(folderId: string) {
    this.store.dispatch(MailActions.selectFolder({
      folderId,
      unreadOnly: this.showUnreadOnly,
      starredOnly: this.showStarredOnly
    }));
  }

  toggleUnreadFilter() {
    this.showUnreadOnly = !this.showUnreadOnly;
    this.showStarredOnly = false; // Reset starred filter
    this.reloadEmails();
  }

  toggleStarredFilter() {
    this.showStarredOnly = !this.showStarredOnly;
    this.showUnreadOnly = false; // Reset unread filter
    this.reloadEmails();
  }

  private reloadEmails() {
    this.selectedFolder$.subscribe(folderId => {
      this.store.dispatch(MailActions.selectFolder({
        folderId,
        unreadOnly: this.showUnreadOnly,
        starredOnly: this.showStarredOnly
      }));
    }).unsubscribe();
  }

  getIcon(iconName: string): string {
    const map: { [key: string]: string } = {
      'inbox': 'inbox',
      'send': 'paper-plane',
      'file-text': 'file',
      'archive': 'archive',
      'trash-2': 'trash',
      'alert-circle': 'exclamation-circle',
      'star': 'star',
      'flag': 'flag',
      'tag': 'tag'
    };
    return map[iconName] || iconName;
  }
}
