import { createReducer, on } from '@ngrx/store';
import { CalendarEvent } from '../models/event.model';
import * as CalendarActions from './calendar.actions';

export interface CalendarState {
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    viewDate: Date;
    loading: boolean;
    isSubmitting: boolean;
    error: string | null;
}

export const initialState: CalendarState = {
    events: [],
    selectedEvent: null,
    viewDate: new Date(),
    loading: false,
    isSubmitting: false,
    error: null
};

export const calendarReducer = createReducer(
    initialState,

    // Load Events
    on(CalendarActions.loadEvents, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CalendarActions.loadEventsSuccess, (state, { events }) => ({
        ...state,
        events,
        loading: false,
        error: null
    })),

    on(CalendarActions.loadEventsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Event
    on(CalendarActions.createEvent, (state) => ({
        ...state,
        isSubmitting: true,
        error: null
    })),

    on(CalendarActions.createEventSuccess, (state, { event }) => ({
        ...state,
        events: [...state.events, event],
        isSubmitting: false,
        error: null
    })),

    on(CalendarActions.createEventFailure, (state, { error }) => ({
        ...state,
        isSubmitting: false,
        error
    })),

    // Update Event
    on(CalendarActions.updateEvent, (state) => ({
        ...state,
        isSubmitting: true,
        error: null
    })),

    on(CalendarActions.updateEventSuccess, (state, { event }) => ({
        ...state,
        events: state.events.map(e => e.id === event.id ? event : e),
        selectedEvent: state.selectedEvent?.id === event.id ? event : state.selectedEvent,
        isSubmitting: false,
        error: null
    })),

    on(CalendarActions.updateEventFailure, (state, { error }) => ({
        ...state,
        isSubmitting: false,
        error
    })),

    // Delete Event
    on(CalendarActions.deleteEvent, (state) => ({
        ...state,
        isSubmitting: true,
        error: null
    })),

    on(CalendarActions.deleteEventSuccess, (state, { id }) => ({
        ...state,
        events: state.events.filter(e => e.id !== id),
        selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
        isSubmitting: false,
        error: null
    })),

    on(CalendarActions.deleteEventFailure, (state, { error }) => ({
        ...state,
        isSubmitting: false,
        error
    })),

    // Select Event
    on(CalendarActions.selectEvent, (state, { event }) => ({
        ...state,
        selectedEvent: event
    })),

    // Set View Date
    on(CalendarActions.setViewDate, (state, { date }) => ({
        ...state,
        viewDate: date
    }))
);
