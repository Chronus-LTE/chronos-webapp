import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarService } from '../../../core/services/avatar.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private avatarService: AvatarService
    ) {
        this.registerForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    async onSubmit(): Promise<void> {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            const formData = this.registerForm.value;

            // Add generated avatar picture to the form data
            const payload = {
                ...formData,
                picture: await this.avatarService.generateRandomAvatar(formData.email)
            };

            this.authService.register(payload).subscribe({
                next: (response) => {
                    console.log('Registration successful:', response);
                    this.isLoading = false;
                    // Check if response has access_token (if backend auto-login after register)
                    if (response.access_token) {
                        // Auto login after registration
                        this.authService.handleAuthResponse(response);
                        this.router.navigate(['/chat']);
                    } else {
                        // Redirect to login
                        alert('Registration successful! Please log in.');
                        this.router.navigate(['/auth/login']);
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.errorMessage = error.error?.detail || error.error?.message || 'Registration failed. Please try again.';
                    console.error('Registration error:', error);
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }    loginWithGoogle(): void {
        // Redirect to backend Google OAuth endpoint
        this.authService.loginWithGoogle();
    }
}
