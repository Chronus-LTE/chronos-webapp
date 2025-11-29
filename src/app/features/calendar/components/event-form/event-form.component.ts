import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmModalComponent } from '../../../../shared/components/delete-confirm-modal/delete-confirm-modal.component';
import { CalendarEvent, CreateEventDto, UpdateEventDto } from '../../models/event.model';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
    @Input() event: CalendarEvent | null = null;
    @Output() save = new EventEmitter<CreateEventDto | UpdateEventDto>();
    @Output() cancel = new EventEmitter<void>();
    @Output() delete = new EventEmitter<string>();

    eventForm!: FormGroup;
    isEditMode = false;
    showLocation = false;
    showAttendees = false;
    private readonly DEFAULT_COLOR = '#4285f4'; // Single default color

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.isEditMode = !!this.event;
        this.showLocation = !!(this.event?.location);
        this.showAttendees = !!(this.event?.attendees && this.event.attendees.length > 0);
        this.initForm();
    }

    private initForm(): void {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        this.eventForm = this.fb.group({
            title: [this.event?.title || '', Validators.required],
            description: [this.event?.description || ''],
            startTime: [this.formatDateTimeLocal(this.event?.startTime || now), Validators.required],
            endTime: [this.formatDateTimeLocal(this.event?.endTime || oneHourLater), Validators.required],
            allDay: [this.event?.allDay || false],
            location: [this.event?.location || ''],
            attendees: [this.event?.attendees?.join(', ') || '']
        });

        // Update time fields when allDay changes
        this.eventForm.get('allDay')?.valueChanges.subscribe(allDay => {
            if (allDay) {
                const startDate = new Date(this.eventForm.get('startTime')?.value);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(this.eventForm.get('endTime')?.value);
                endDate.setHours(23, 59, 59, 999);

                this.eventForm.patchValue({
                    startTime: this.formatDateTimeLocal(startDate),
                    endTime: this.formatDateTimeLocal(endDate)
                }, { emitEvent: false });
            }
        });
    }

    private formatDateTimeLocal(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    onSubmit(): void {
        if (this.eventForm.valid) {
            const formValue = this.eventForm.value;
            const attendeesArray = formValue.attendees
                ? formValue.attendees.split(',').map((email: string) => email.trim()).filter((email: string) => email)
                : [];

            const eventData = {
                title: formValue.title,
                description: formValue.description || undefined,
                startTime: new Date(formValue.startTime),
                endTime: new Date(formValue.endTime),
                allDay: formValue.allDay,
                color: this.event?.color || this.DEFAULT_COLOR,
                location: formValue.location || undefined,
                attendees: attendeesArray.length > 0 ? attendeesArray : undefined
            };

            this.save.emit(eventData);
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    onDelete(): void {
        if (this.event) {
            const modalRef = this.modalService.open(DeleteConfirmModalComponent, {
                centered: true,
                size: 'sm'
            });

            modalRef.componentInstance.eventTitle = this.event.title;

            modalRef.result.then(
                () => {
                    this.delete.emit(this.event!.id);
                },
                () => {
                    // User dismissed modal
                }
            );
        }
    }
}
