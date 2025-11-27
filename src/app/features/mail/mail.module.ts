import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MailComponent } from './mail.component';

const routes: Routes = [
    {
        path: '',
        component: MailComponent
    }
];

@NgModule({
    declarations: [MailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class MailModule { }
