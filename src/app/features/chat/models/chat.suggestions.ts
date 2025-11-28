import { Suggestion } from './chat.model';

export const CHAT_SUGGESTIONS: Suggestion[] = [
  {
    icon: 'fas fa-calendar',
    title: 'Schedule a meeting',
    description: 'Set up a meeting for 8 AM tomorrow',
    prompt: 'Schedule a meeting for me at 8 AM tomorrow. Please help me set up the calendar event'
  },
  {
    icon: 'fas fa-lightbulb',
    title: 'Brainstorm ideas',
    description: 'Generate innovative solutions for a project',
    prompt: 'Help me brainstorm creative and innovative ideas for my upcoming project'
  },
  {
    icon: 'fas fa-graduation-cap',
    title: 'Learn a skill',
    description: 'Create a personalized learning roadmap',
    prompt: 'I want to learn a new skill. Can you create a personalized learning roadmap for me?'
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Plan your week',
    description: 'Organize tasks and prioritize goals',
    prompt: 'Help me plan my week by organizing my tasks and prioritizing my goals effectively'
  }
];
