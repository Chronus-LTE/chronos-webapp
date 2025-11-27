import { Component } from '@angular/core';

@Component({
    selector: 'app-mail',
    template: `
    <div class="module-container">
      <div class="module-header">
        <h1>Mail</h1>
        <p>Your email inbox and messages</p>
      </div>
      <div class="module-content">
        <p>Mail module content will go here</p>
      </div>
    </div>
  `,
    styles: [`
    .module-container {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .module-header {
      margin-bottom: 32px;
    }

    .module-header h1 {
      font-family: var(--font-primary);
      font-size: 32px;
      font-weight: 600;
      color: var(--sidebar-text);
      margin: 0 0 8px 0;
    }

    .module-header p {
      font-family: var(--font-primary);
      font-size: 16px;
      color: var(--sidebar-text-secondary);
      margin: 0;
    }

    .module-content {
      background: var(--main-bg);
      border: 1px solid var(--main-border);
      border-radius: 12px;
      padding: 24px;
      min-height: 400px;
    }
  `]
})
export class MailComponent { }
