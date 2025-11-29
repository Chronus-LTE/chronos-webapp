// Backend API response structure
export interface CalendarEventResponse {
    id: string;
    summary: string;
    start_timestamp: number;
    end_timestamp: number;
    description?: string;
    html_link?: string;
}

// List events response wrapper
export interface ListEventsResponse {
    events: CalendarEventResponse[];
}

// Backend API request structure
export interface CreateEventRequest {
    summary: string;
    start_timestamp: number;
    end_timestamp: number;
    description?: string;
}

export interface UpdateEventRequest {
    summary?: string;
    start_timestamp?: number;
    end_timestamp?: number;
    description?: string;
}

// Frontend model (for UI usage)
export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    color?: string;
    allDay?: boolean;
    location?: string;
    attendees?: string[];
    htmlLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Frontend DTO for creating events
export interface CreateEventDto {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    color?: string;
    allDay?: boolean;
    location?: string;
    attendees?: string[];
}

// Frontend DTO for updating events
export interface UpdateEventDto {
    title?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    color?: string;
    allDay?: boolean;
    location?: string;
    attendees?: string[];
}
