import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../application/services/auth.service';
import { LogoComponent } from '../../../components/logo/logo.component';
import { RegisterRequest } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in">
        <app-logo></app-logo>
        
        <h1 class="auth-title">Sign Up</h1>
        
        <div class="social-buttons">
          <button class="btn btn-google" (click)="registerWithProvider('google')">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Gmail
          </button>
          <button class="btn btn-outlook" (click)="registerWithProvider('outlook')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.8 12c0-1.68 1.1-3.2 2.8-3.2s2.8 1.52 2.8 3.2-1.1 3.2-2.8 3.2S7.8 13.68 7.8 12zM22 5v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z"/>
            </svg>
            Outlook
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <input 
              type="text" 
              class="form-input" 
              placeholder="Name" 
              [(ngModel)]="registerRequest.name"
              name="name"
              required>
          </div>
          
          <div class="form-group">
            <input 
              type="email" 
              class="form-input" 
              placeholder="Email" 
              [(ngModel)]="registerRequest.email"
              name="email"
              required>
          </div>
          
          <div class="form-group">
            <input 
              type="password" 
              class="form-input" 
              placeholder="Password" 
              [(ngModel)]="registerRequest.password"
              name="password"
              required>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary auth-submit"
            [disabled]="loading || registerForm.invalid">
            <span *ngIf="loading">Creating Account...</span>
            <span *ngIf="!loading">Sign Up</span>
          </button>
        </form>

        <div class="auth-links">
          <div class="auth-switch">
            Already have an account? 
            <a routerLink="/auth/login" class="switch-link">Sign In</a>
          </div>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--dark-green) 0%, #064a32 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-card {
      background: var(--white);
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .auth-title {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: var(--text-dark);
      margin-bottom: 30px;
    }

    .social-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
    }

    .auth-submit {
      width: 100%;
      padding: 16px;
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
    }

    .auth-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .auth-links {
      text-align: center;
      margin-top: 20px;
    }

    .auth-switch {
      font-size: 14px;
      color: #666;
    }

    .switch-link {
      color: var(--dark-green);
      text-decoration: none;
      font-weight: 600;
    }

    .switch-link:hover {
      text-decoration: underline;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 30px 20px;
      }
      
      .social-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    name: '',
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/plans']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  registerWithProvider(provider: 'google' | 'outlook'): void {
    console.log(`Register with ${provider} - Not implemented in demo`);
  }
}