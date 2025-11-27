import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    this.isLoading = false;
                    this.router.navigate(['/chat']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = error.error?.detail || error.error?.message || 'Login failed. Please check your credentials.';
                    console.error('Login error:', error);
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    loginWithGoogle(): void {
        // Redirect to backend Google OAuth endpoint
        this.authService.loginWithGoogle();
    }
}
