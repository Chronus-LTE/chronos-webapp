import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { CalendarService } from '../services/calendar.service';
import { ToastService } from '../../../shared/services/toast.service';
import * as CalendarActions from './calendar.actions';

@Injectable()
export class CalendarEffects {

    loadEvents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarActions.loadEvents),
            switchMap(({ startDate, endDate }) =>
                this.calendarService.getEvents(startDate, endDate).pipe(
                    map(events => CalendarActions.loadEventsSuccess({ events })),
                    catchError(error => {
                        this.toastService.error('Failed to load events');
                        return of(CalendarActions.loadEventsFailure({
                            error: error.message || 'Failed to load events'
                        }));
                    })
                )
            )
        )
    );

    createEvent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarActions.createEvent),
            switchMap(({ event }) =>
                this.calendarService.createEvent(event).pipe(
                    map(createdEvent => {
                        this.toastService.success('Event created successfully');
                        return CalendarActions.createEventSuccess({ event: createdEvent });
                    }),
                    catchError(error => {
                        this.toastService.error('Failed to create event');
                        return of(CalendarActions.createEventFailure({
                            error: error.message || 'Failed to create event'
                        }));
                    })
                )
            )
        )
    );

    updateEvent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarActions.updateEvent),
            switchMap(({ id, event }) =>
                this.calendarService.updateEvent(id, event).pipe(
                    map(updatedEvent => {
                        this.toastService.success('Event updated successfully');
                        return CalendarActions.updateEventSuccess({ event: updatedEvent });
                    }),
                    catchError(error => {
                        this.toastService.error('Failed to update event');
                        return of(CalendarActions.updateEventFailure({
                            error: error.message || 'Failed to update event'
                        }));
                    })
                )
            )
        )
    );

    deleteEvent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarActions.deleteEvent),
            switchMap(({ id }) =>
                this.calendarService.deleteEvent(id).pipe(
                    map(() => {
                        this.toastService.success('Event deleted successfully');
                        return CalendarActions.deleteEventSuccess({ id });
                    }),
                    catchError(error => {
                        this.toastService.error('Failed to delete event');
                        return of(CalendarActions.deleteEventFailure({
                            error: error.message || 'Failed to delete event'
                        }));
                    })
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private calendarService: CalendarService,
        private toastService: ToastService
    ) { }
}
