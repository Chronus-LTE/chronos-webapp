import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeComponent } from './knowledge.component';

const routes: Routes = [
    {
        path: '',
        component: KnowledgeComponent
    }
];

@NgModule({
    declarations: [KnowledgeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class KnowledgeModule { }
