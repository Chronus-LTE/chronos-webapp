import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';

import { CalendarComponent } from './calendar.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { calendarReducer } from './store/calendar.reducer';
import { CalendarEffects } from './store/calendar.effects';

const routes: Routes = [
    {
        path: '',
        component: CalendarComponent
    }
];

@NgModule({
    declarations: [
        CalendarComponent,
        EventFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        SharedModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('calendar', calendarReducer),
        EffectsModule.forFeature([CalendarEffects])
    ]
})
export class CalendarModule { }
