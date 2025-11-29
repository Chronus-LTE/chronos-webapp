import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import * as MailActions from '../../store/mail.actions';
import * as MailSelectors from '../../store/mail.selectors';

@Component({
    selector: 'app-compose-email',
    templateUrl: './compose-email.component.html',
    styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    composeForm: FormGroup;
    sending = false;
    mode: 'new' | 'reply' | 'forward' | 'edit' = 'new';

    constructor(
        private fb: FormBuilder,
        private store: Store
    ) {
        this.composeForm = this.fb.group({
            to: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            body: ['', Validators.required]
        });
    }

    ngOnInit() {
        combineLatest([
            this.store.select(MailSelectors.selectComposeMode),
            this.store.select(MailSelectors.selectComposeEmail)
        ]).pipe(take(1)).subscribe(([mode, email]) => {
            this.mode = mode;
            if (email) {
                if (mode === 'reply') {
                    this.composeForm.patchValue({
                        to: email.from,
                        subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
                        body: `\n\nOn ${new Date(email.date).toLocaleString()}, ${email.from} wrote:\n> ${email.snippet}`
                    });
                } else if (mode === 'forward') {
                    this.composeForm.patchValue({
                        subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
                        body: `\n\n---------- Forwarded message ---------\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${email.subject}\nTo: ${email.to}\n\n${email.snippet}`
                    });
                } else if (mode === 'edit') {
                    this.composeForm.patchValue({
                        to: email.to,
                        subject: email.subject,
                        body: email.body_plain || email.snippet
                    });
                }
            }
        });
    }

    send() {
        if (this.composeForm.valid) {
            this.sending = true;
            const { to, subject, body } = this.composeForm.value;
            this.store.dispatch(MailActions.sendEmail({ to, subject, body }));

            // Close modal after a short delay
            setTimeout(() => {
                this.sending = false;
                this.close.emit();
            }, 1000);
        }
    }

    cancel() {
        this.close.emit();
    }
}
