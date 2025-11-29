import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CalendarEvent,
    CreateEventDto,
    UpdateEventDto,
    CalendarEventResponse,
    CreateEventRequest,
    UpdateEventRequest,
    ListEventsResponse
} from '../models/event.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    private apiUrl = `${environment.apiUrl}/calendar/events`;

    constructor(private http: HttpClient) { }

    /**
     * Convert backend response to frontend model
     */
    private mapResponseToEvent(response: CalendarEventResponse): CalendarEvent {
        return {
            id: response.id,
            title: response.summary,
            description: response.description,
            startTime: new Date(response.start_timestamp * 1000), // Convert Unix timestamp to Date
            endTime: new Date(response.end_timestamp * 1000),
            htmlLink: response.html_link,
            color: this.getDefaultColor(),
            allDay: this.isAllDayEvent(response.start_timestamp, response.end_timestamp),
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    /**
     * Convert frontend DTO to backend request
     */
    private mapDtoToRequest(dto: CreateEventDto): CreateEventRequest {
        return {
            summary: dto.title,
            start_timestamp: Math.floor(dto.startTime.getTime() / 1000), // Convert Date to Unix timestamp
            end_timestamp: Math.floor(dto.endTime.getTime() / 1000),
            description: dto.description
        };
    }

    /**
     * Convert frontend update DTO to backend request
     */
    private mapUpdateDtoToRequest(dto: UpdateEventDto): UpdateEventRequest {
        const request: UpdateEventRequest = {};

        if (dto.title !== undefined) {
            request.summary = dto.title;
        }
        if (dto.startTime !== undefined) {
            request.start_timestamp = Math.floor(dto.startTime.getTime() / 1000);
        }
        if (dto.endTime !== undefined) {
            request.end_timestamp = Math.floor(dto.endTime.getTime() / 1000);
        }
        if (dto.description !== undefined) {
            request.description = dto.description;
        }

        return request;
    }

    /**
     * Check if event is all-day based on timestamps
     */
    private isAllDayEvent(startTimestamp: number, endTimestamp: number): boolean {
        const start = new Date(startTimestamp * 1000);
        const end = new Date(endTimestamp * 1000);

        // Check if start is at midnight and duration is 24 hours or more
        return start.getHours() === 0 &&
            start.getMinutes() === 0 &&
            (endTimestamp - startTimestamp) >= 86400; // 24 hours in seconds
    }

    /**
     * Get default color for events
     */
    private getDefaultColor(): string {
        return '#4285f4';
    }

    /**
     * Get all events (optionally filtered by date range and max results)
     */
    getEvents(startDate?: Date, endDate?: Date, maxResults?: number): Observable<CalendarEvent[]> {
        const params: any = {};

        if (startDate) {
            params.start_timestamp = Math.floor(startDate.getTime() / 1000);
        }
        if (endDate) {
            params.end_timestamp = Math.floor(endDate.getTime() / 1000);
        }
        if (maxResults) {
            params.max_results = maxResults;
        }

        return this.http.get<ListEventsResponse>(this.apiUrl, { params }).pipe(
            map(response => response.events.map(event => this.mapResponseToEvent(event)))
        );
    }

    /**
     * Get event by ID
     */
    getEventById(id: string): Observable<CalendarEvent | undefined> {
        return this.http.get<CalendarEventResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => this.mapResponseToEvent(response))
        );
    }

    /**
     * Create new event
     */
    createEvent(eventDto: CreateEventDto): Observable<CalendarEvent> {
        const request = this.mapDtoToRequest(eventDto);

        return this.http.post<CalendarEventResponse>(this.apiUrl, request).pipe(
            map(response => {
                const event = this.mapResponseToEvent(response);
                // Preserve frontend-only fields from DTO
                event.color = eventDto.color || event.color;
                event.allDay = eventDto.allDay || event.allDay;
                event.location = eventDto.location;
                event.attendees = eventDto.attendees;
                return event;
            })
        );
    }

    /**
     * Update existing event
     */
    updateEvent(id: string, eventDto: UpdateEventDto): Observable<CalendarEvent> {
        const request = this.mapUpdateDtoToRequest(eventDto);

        return this.http.put<CalendarEventResponse>(`${this.apiUrl}/${id}`, request).pipe(
            map(response => {
                const event = this.mapResponseToEvent(response);
                // Preserve frontend-only fields from DTO
                if (eventDto.color) event.color = eventDto.color;
                if (eventDto.allDay !== undefined) event.allDay = eventDto.allDay;
                if (eventDto.location) event.location = eventDto.location;
                if (eventDto.attendees) event.attendees = eventDto.attendees;
                return event;
            })
        );
    }

    /**
     * Delete event
     */
    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
