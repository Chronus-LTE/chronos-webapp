import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Authenticating...</h1>
          <p class="auth-subtitle">Please wait while we log you in</p>
        </div>
        <div class="spinner-container">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/theme';

    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-color: var(--dark-bg);
      background-image: radial-gradient(circle at 50% 0%, var(--dark-bg-gradient-center) 0%, var(--dark-bg) 75%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--dark-surface);
      padding: 2.5rem;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--dark-border);
      text-align: center;
    }

    .auth-header {
      margin-bottom: 2rem;

      .auth-title {
        font-family: var(--font-secondary);
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--clay-50);
        margin: 0 0 0.5rem;
        letter-spacing: -0.02em;
      }

      .auth-subtitle {
        color: var(--clay-300);
        font-size: 0.95rem;
        margin: 0;
      }
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 2rem 0;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(var(--clay-400-rgb), 0.2);
      border-radius: 50%;
      border-top-color: var(--clay-400);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check if we have a token in the URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'] || params['access_token'];

      if (token) {
        // Token was passed via URL
        this.authService.handleGoogleCallback(token);

        // Use Angular Router for navigation
        setTimeout(() => {
          this.router.navigate(['/chat']).then(success => {
            console.log('✅ Navigation success:', success);
          }).catch(err => {
              console.error('❌ Navigation error:', err);
          });
        }, 500);
      } else {
        this.verifyAuthentication();
      }
    });
  }

  private verifyAuthentication(): void {
    this.authService.getCurrentUser().subscribe({
      next: (response: any) => {
        // User is authenticated, redirect to chat
        setTimeout(() => {
          this.router.navigate(['/chat']).then(success => {
          }).catch(err => {
            console.error('❌ Navigation error:', err);
          });
        }, 500);
      },
      error: (error: any) => {
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1000);
      }
    });
  }
}
