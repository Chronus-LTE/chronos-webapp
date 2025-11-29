import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-delete-confirm-modal',
    templateUrl: './delete-confirm-modal.component.html',
    styleUrls: ['./delete-confirm-modal.component.scss']
})
export class DeleteConfirmModalComponent {
    @Input() eventTitle: string = '';

    constructor(public activeModal: NgbActiveModal) { }
}
