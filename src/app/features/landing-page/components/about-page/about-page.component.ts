import { Component } from '@angular/core';

@Component({
    selector: 'app-about-page',
    templateUrl: './about-page.component.html',
    styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent {
    readonly currentYear = new Date().getFullYear();
}
