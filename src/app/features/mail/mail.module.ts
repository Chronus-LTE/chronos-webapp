import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MailComponent } from './mail.component';
import { MailSidebarComponent } from './components/mail-sidebar/mail-sidebar.component';
import { MailListComponent } from './components/mail-list/mail-list.component';
import { MailDetailComponent } from './components/mail-detail/mail-detail.component';
import { ComposeEmailComponent } from './components/compose-email/compose-email.component';
import { EmailBodyComponent } from './components/email-body/email-body.component';
import { mailReducer } from './store/mail.reducer';
import { MailEffects } from './store/mail.effects';

const routes: Routes = [
    {
        path: '',
        component: MailComponent
    }
];

@NgModule({
    declarations: [
        MailComponent,
        MailSidebarComponent,
        MailListComponent,
        MailDetailComponent,
        ComposeEmailComponent,
        EmailBodyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('mail', mailReducer),
        EffectsModule.forFeature([MailEffects])
    ]
})
export class MailModule { }
