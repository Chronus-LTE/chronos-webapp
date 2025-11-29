import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CalendarState } from './calendar.reducer';

export const selectCalendarState = createFeatureSelector<CalendarState>('calendar');

export const selectAllEvents = createSelector(
    selectCalendarState,
    (state) => state.events
);

export const selectSelectedEvent = createSelector(
    selectCalendarState,
    (state) => state.selectedEvent
);

export const selectViewDate = createSelector(
    selectCalendarState,
    (state) => state.viewDate
);

export const selectLoading = createSelector(
    selectCalendarState,
    (state) => state.loading
);

export const selectIsSubmitting = createSelector(
    selectCalendarState,
    (state) => state.isSubmitting
);

export const selectError = createSelector(
    selectCalendarState,
    (state) => state.error
);

export const selectEventsByDate = (date: Date) => createSelector(
    selectAllEvents,
    (events) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === targetDate.getTime();
        });
    }
);

export const selectEventsForMonth = (year: number, month: number) => createSelector(
    selectAllEvents,
    (events) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    }
);
