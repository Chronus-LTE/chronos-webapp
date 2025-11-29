import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

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

    currentUser$: Observable<any>;
    isProfileOpen = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.activeRoute = this.router.url;
        this.currentUser$ = this.authService.currentUser$;
    }

    ngOnInit() {
        console.log('SidebarComponent initialized');
        this.authService.getCurrentUser().subscribe({
            next: (user) => console.log('User loaded in sidebar:', user),
            error: (err) => console.error('Error loading user in sidebar:', err)
        });
    }

    navigate(route: string): void {
        this.activeRoute = route;
        this.router.navigate([route]);
    }

    isActive(route: string): boolean {
        return this.activeRoute.startsWith(route);
    }

    logout(): void {
        this.authService.logout();
    }

    getAvatar(user: any): string {
        if (user && user.picture) {
            return user.picture;
        }
        const name = user ? user.full_name : 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    }
}
