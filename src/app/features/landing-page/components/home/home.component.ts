import { Component } from '@angular/core';

interface Capability {
  icon: string;
  title: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class LandingComponent {
  readonly currentYear = new Date().getFullYear();

  readonly capabilities: Capability[] = [
    {
      icon: 'fa-comments',
      title: 'Natural conversation',
      description: 'Talk to Chronus like you would with a colleague. No commands to memorize.',
    },
    {
      icon: 'fa-calendar-check',
      title: 'Smart scheduling',
      description: 'Manage your calendar automatically with conflict detection and reminders.',
    },
    {
      icon: 'fa-list-check',
      title: 'Task management',
      description: 'Keep track of your to-do list with intelligent prioritization.',
    },
    {
      icon: 'fa-brain',
      title: 'Context aware',
      description: 'Chronus remembers your preferences for personalized assistance.',
    },
    {
      icon: 'fa-shield-halved',
      title: 'Privacy focused',
      description: 'Your data is encrypted and secure with full transparency.',
    },
    {
      icon: 'fa-plug',
      title: 'Easy integration',
      description: 'Connect with Google Calendar and tools you already use.',
    },
  ];

  readonly features: Feature[] = [
    {
      title: 'Designed for how you work',
      description:
        'Chronus adapts to your workflow. Whether you prefer voice or text, quick commands or detailed conversations, it meets you where you are.',
    },
    {
      title: 'Stay organized effortlessly',
      description:
        'From scheduling meetings to tracking tasks, Chronus handles the details so you can focus on what matters.',
    },
    {
      title: 'Built with privacy in mind',
      description:
        'Your conversations and data are encrypted end-to-end. Chronus gives you complete control over your information.',
    },
  ];
}
