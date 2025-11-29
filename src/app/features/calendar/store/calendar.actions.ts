import { createAction, props } from '@ngrx/store';
import { CalendarEvent, CreateEventDto, UpdateEventDto } from '../models/event.model';

// Load Events
export const loadEvents = createAction(
    '[Calendar] Load Events',
    props<{ startDate?: Date; endDate?: Date }>()
);

export const loadEventsSuccess = createAction(
    '[Calendar] Load Events Success',
    props<{ events: CalendarEvent[] }>()
);

export const loadEventsFailure = createAction(
    '[Calendar] Load Events Failure',
    props<{ error: string }>()
);

// Create Event
export const createEvent = createAction(
    '[Calendar] Create Event',
    props<{ event: CreateEventDto }>()
);

export const createEventSuccess = createAction(
    '[Calendar] Create Event Success',
    props<{ event: CalendarEvent }>()
);

export const createEventFailure = createAction(
    '[Calendar] Create Event Failure',
    props<{ error: string }>()
);

// Update Event
export const updateEvent = createAction(
    '[Calendar] Update Event',
    props<{ id: string; event: UpdateEventDto }>()
);

export const updateEventSuccess = createAction(
    '[Calendar] Update Event Success',
    props<{ event: CalendarEvent }>()
);

export const updateEventFailure = createAction(
    '[Calendar] Update Event Failure',
    props<{ error: string }>()
);

// Delete Event
export const deleteEvent = createAction(
    '[Calendar] Delete Event',
    props<{ id: string }>()
);

export const deleteEventSuccess = createAction(
    '[Calendar] Delete Event Success',
    props<{ id: string }>()
);

export const deleteEventFailure = createAction(
    '[Calendar] Delete Event Failure',
    props<{ error: string }>()
);

// Select Event
export const selectEvent = createAction(
    '[Calendar] Select Event',
    props<{ event: CalendarEvent | null }>()
);

// Set View Date
export const setViewDate = createAction(
    '[Calendar] Set View Date',
    props<{ date: Date }>()
);
