import { Component } from '@angular/core';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-features-page',
    templateUrl: './features-page.component.html',
    styleUrls: ['./features-page.component.scss'],
})
export class FeaturesPageComponent {
    readonly features: Feature[] = [
        {
            icon: 'fa-brain',
            title: 'Natural Language Processing',
            description: 'Advanced AI that understands context and intent, making interactions feel natural and intuitive.',
        },
        {
            icon: 'fa-calendar-check',
            title: 'Smart Calendar Management',
            description: 'Intelligent scheduling that handles conflicts, time zones, and preferences automatically.',
        },
        {
            icon: 'fa-list-check',
            title: 'Task Organization',
            description: 'Effortless task management with intelligent prioritization and deadline tracking.',
        },
        {
            icon: 'fa-clock-rotate-left',
            title: 'Contextual Memory',
            description: 'Chronus remembers your preferences, past conversations, and working patterns.',
        },
        {
            icon: 'fa-shield-halved',
            title: 'Privacy & Security',
            description: 'Enterprise-grade security with complete transparency and user control.',
        },
        {
            icon: 'fa-plug',
            title: 'Seamless Integration',
            description: 'Connect with the tools you already use for a unified workflow experience.',
        },
    ];
}
