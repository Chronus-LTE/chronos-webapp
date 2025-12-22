import { Component, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-email-body',
    template: `
    <div class="email-content" [innerHTML]="safeContent"></div>
  `,
    styleUrls: ['./email-body.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class EmailBodyComponent implements OnChanges {
    @Input() content: string | undefined | null;
    safeContent: SafeHtml = '';

    constructor(private sanitizer: DomSanitizer) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['content']) {
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.content || '');
        }
    }
}
