import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
    id: string;
    label: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    @Input() collapsed = false;
    @Output() toggleCollapse = new EventEmitter<void>();

    activeRoute = '';

    navItems: NavItem[] = [
        { id: 'chat', label: 'Chat', icon: 'chat', route: '/chat' },
        { id: 'mail', label: 'Mail', icon: 'mail', route: '/mail' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar', route: '/calendar' },
        { id: 'knowledge', label: 'Knowledge Base', icon: 'library', route: '/knowledge' }
    ];

    constructor(private router: Router) {
        this.activeRoute = this.router.url;
    }

    navigate(route: string): void {
        this.activeRoute = route;
        this.router.navigate([route]);
    }

    isActive(route: string): boolean {
        return this.activeRoute.startsWith(route);
    }
}
