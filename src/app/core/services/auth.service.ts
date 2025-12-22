import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    GoogleLoginResponse,
    User
} from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Check if user is already logged in
        const token = this.getToken();
        if (token) {
            // You might want to validate the token here
            this.currentUserSubject.next({ token });
        }
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => this.handleAuthResponse(response))
            );
    }

    register(data: any): Observable<any> {
        // Map form data to API format
        const payload: RegisterRequest = {
            email: data.email,
            password: data.password,
            full_name: data.fullName,
            picture: data.picture
        };
        return this.http.post<any>(`${this.apiUrl}/auth/register`, payload);
    }

    loginWithGoogle(): void {
        // Fetch the authorization URL from backend
        this.http.get<GoogleLoginResponse>(`${this.apiUrl}/auth/google/login`)
            .subscribe(
                (response) => {
                    console.log('Received authorization URL:', response.authorization_url);
                    // Redirect to Google's authorization URL
                    window.location.href = response.authorization_url;
                },
                (error) => {
                    console.error('Failed to initiate Google login:', error);
                    alert('Failed to login with Google. Please try again.');
                }
            );
    }

    handleGoogleCallback(token: string): void {
        // Store the token received from Google OAuth callback
        this.setToken(token);
        this.currentUserSubject.next({ token });
        this.router.navigate(['/chat']);
    }

    logout(): void {
        this.removeToken();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    handleAuthResponse(response: AuthResponse): void {
        this.setToken(response.access_token);
        this.currentUserSubject.next(response.user);
    }

    private setToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    private removeToken(): void {
        localStorage.removeItem('access_token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/auth/me`)
            .pipe(
                tap(user => {
                    console.log('User retrieved from /auth/me:', user);
                    this.currentUserSubject.next(user);
                })
            );
    }

    refreshToken(): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {}, {
            withCredentials: true
        }).pipe(
            tap(response => this.handleAuthResponse(response))
        );
    }
}
