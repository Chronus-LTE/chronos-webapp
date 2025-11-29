import { Injectable } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    autohide: boolean;
    delay: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts: Toast[] = [];
    private idCounter = 0;

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', delay = 3000): void {
        const toast: Toast = {
            id: this.idCounter++,
            message,
            type,
            autohide: true,
            delay
        };
        this.toasts.push(toast);
    }

    success(message: string, delay = 3000): void {
        this.show(message, 'success', delay);
    }

    error(message: string, delay = 5000): void {
        this.show(message, 'error', delay);
    }

    info(message: string, delay = 3000): void {
        this.show(message, 'info', delay);
    }

    warning(message: string, delay = 4000): void {
        this.show(message, 'warning', delay);
    }

    remove(toast: Toast): void {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }

    clear(): void {
        this.toasts = [];
    }
}
