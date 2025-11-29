import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarEvent, CreateEventDto, UpdateEventDto } from './models/event.model';
import * as CalendarActions from './store/calendar.actions';
import * as CalendarSelectors from './store/calendar.selectors';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  viewDate$: Observable<Date>;
  events$: Observable<CalendarEvent[]>;
  loading$: Observable<boolean>;
  isSubmitting$: Observable<boolean>;
  selectedEvent$: Observable<CalendarEvent | null>;

  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  showEventForm = false;
  selectedEventForEdit: CalendarEvent | null = null;

  constructor(private store: Store) {
    this.viewDate$ = this.store.select(CalendarSelectors.selectViewDate);
    this.events$ = this.store.select(CalendarSelectors.selectAllEvents);
    this.loading$ = this.store.select(CalendarSelectors.selectLoading);
    this.isSubmitting$ = this.store.select(CalendarSelectors.selectIsSubmitting);
    this.selectedEvent$ = this.store.select(CalendarSelectors.selectSelectedEvent);
  }

  ngOnInit(): void {
    this.loadEvents();

    this.viewDate$.pipe(takeUntil(this.destroy$)).subscribe(date => {
      this.currentDate = date;
      this.generateCalendar();
    });

    this.events$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.generateCalendar();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    this.store.dispatch(CalendarActions.loadEvents({
      startDate: startOfMonth,
      endDate: endOfMonth
    }));
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentEventsSnapshot: CalendarEvent[] = [];
    this.events$.pipe(takeUntil(this.destroy$)).subscribe(events => {
      currentEventsSnapshot = events;
    });

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const dayEvents = currentEventsSnapshot.filter(event => {
        const eventDate = new Date(event.startTime);
        eventDate.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === checkDate.getTime();
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        events: dayEvents
      });
    }

    this.calendarDays = days;
  }

  previousMonth(): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.store.dispatch(CalendarActions.setViewDate({ date: newDate }));
    this.loadEvents();
  }

  nextMonth(): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.store.dispatch(CalendarActions.setViewDate({ date: newDate }));
    this.loadEvents();
  }

  goToToday(): void {
    this.store.dispatch(CalendarActions.setViewDate({ date: new Date() }));
    this.loadEvents();
  }

  getMonthYearString(): string {
    return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  openNewEventForm(): void {
    this.selectedEventForEdit = null;
    this.showEventForm = true;
  }

  openEditEventForm(event: CalendarEvent): void {
    this.selectedEventForEdit = event;
    this.showEventForm = true;
  }

  closeEventForm(): void {
    this.showEventForm = false;
    this.selectedEventForEdit = null;
  }

  onSaveEvent(eventData: CreateEventDto | UpdateEventDto): void {
    if (this.selectedEventForEdit) {
      this.store.dispatch(CalendarActions.updateEvent({
        id: this.selectedEventForEdit.id,
        event: eventData as UpdateEventDto
      }));
    } else {
      this.store.dispatch(CalendarActions.createEvent({
        event: eventData as CreateEventDto
      }));
    }
    this.closeEventForm();
  }

  onDeleteEvent(id: string): void {
    this.store.dispatch(CalendarActions.deleteEvent({ id }));
    this.closeEventForm();
  }

  onEventClick(event: CalendarEvent, $event: Event): void {
    $event.stopPropagation();
    this.openEditEventForm(event);
  }

  onDayClick(day: CalendarDay): void {
    if (!day.isCurrentMonth) {
      return;
    }
    // Could open event form with pre-filled date
    this.openNewEventForm();
  }
}
