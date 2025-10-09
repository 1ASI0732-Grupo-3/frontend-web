import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { RegisterRequest } from '@shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <!-- Left Panel - Branding -->
      <div class="auth-left-panel">
        <div class="branding-content">
          <h1 class="brand-title">Join VacApp Today</h1>
          <p class="brand-subtitle">Start managing your veterinary practice with our comprehensive platform</p>
          <div class="benefits-list">
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Free 30-day trial</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>No setup fees</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>24/7 support included</span>
            </div>
            <div class="benefit-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Register Form -->
      <div class="auth-right-panel">
        <div class="auth-form-container fade-in">
          <div class="form-header">
            <h2 class="form-title">Create Account</h2>
            <p class="form-subtitle">Fill in your information to get started</p>
          </div>
          


          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="form-group">
              <label for="name" class="form-label">Full Name</label>
              <input 
                id="name"
                type="text" 
                class="form-input" 
                placeholder="Enter your full name" 
                [(ngModel)]="registerRequest.name"
                name="name"
                required>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input 
                id="email"
                type="email" 
                class="form-input" 
                placeholder="Enter your email" 
                [(ngModel)]="registerRequest.email"
                name="email"
                required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                id="password"
                type="password" 
                class="form-input" 
                placeholder="Create a strong password" 
                [(ngModel)]="registerRequest.password"
                name="password"
                required>
              <div class="password-hint">
                Must be at least 8 characters long
              </div>
            </div>

            <div class="terms-container">
              <label class="checkbox-container">
                <input type="checkbox" class="checkbox" required>
                <span class="checkmark"></span>
                I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary auth-submit"
              [disabled]="loading || registerForm.invalid">
              <span *ngIf="loading">Creating Account...</span>
              <span *ngIf="!loading">Create Account</span>
            </button>
          </form>

          <div class="auth-switch">
            Already have an account? 
            <a routerLink="/auth/login" class="switch-link">Sign In</a>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      background: var(--white);
    }

    .auth-left-panel {
      flex: 1;
      background: linear-gradient(135deg, var(--dark-green) 0%, #064a32 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
      color: var(--white);
      position: relative;
      overflow: hidden;
    }

    .auth-left-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.03"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
      pointer-events: none;
    }

    .branding-content {
      max-width: 400px;
      text-align: center;
      z-index: 1;
      position: relative;
    }

    .brand-title {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 40px;
      line-height: 1.5;
    }

    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: left;
    }

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      opacity: 0.95;
    }

    .benefit-item svg {
      flex-shrink: 0;
      color: var(--light-beige);
    }

    .auth-right-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
      background: #fafafa;
    }

    .auth-form-container {
      background: var(--white);
      border-radius: 12px;
      padding: 48px;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e5e5;
    }

    .form-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .form-title {
      font-size: 28px;
      font-weight: bold;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .form-subtitle {
      font-size: 16px;
      color: #666;
      margin: 0;
    }



    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.2s ease;
      background: var(--white);
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--dark-green);
      box-shadow: 0 0 0 3px rgba(6, 74, 50, 0.1);
    }

    .password-hint {
      font-size: 13px;
      color: #666;
      margin-top: 6px;
    }

    .terms-container {
      margin-bottom: 32px;
      font-size: 14px;
    }

    .checkbox-container {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      color: #666;
      line-height: 1.4;
    }

    .checkbox {
      width: 16px;
      height: 16px;
      margin: 2px 0 0 0;
      flex-shrink: 0;
    }

    .terms-link {
      color: var(--dark-green);
      text-decoration: none;
      font-weight: 500;
    }

    .terms-link:hover {
      text-decoration: underline;
    }

    .auth-submit {
      width: 100%;
      padding: 14px;
      background: var(--dark-green);
      color: var(--white);
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 24px;
    }

    .auth-submit:hover:not(:disabled) {
      background: #064a32;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(6, 74, 50, 0.3);
    }

    .auth-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .auth-switch {
      text-align: center;
      font-size: 15px;
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
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      text-align: center;
      font-size: 14px;
      border: 1px solid #ffcdd2;
    }

    @media (max-width: 1024px) {
      .auth-container {
        flex-direction: column;
      }
      
      .auth-left-panel {
        min-height: 300px;
        padding: 40px 20px;
      }
      
      .auth-right-panel {
        padding: 40px 20px;
      }
      
      .auth-form-container {
        padding: 32px 24px;
      }
      
      .brand-title {
        font-size: 32px;
      }
    }

    @media (max-width: 768px) {
      .auth-left-panel {
        min-height: 200px;
        padding: 30px 20px;
      }
      
      .brand-title {
        font-size: 28px;
      }
      
      .brand-subtitle {
        font-size: 16px;
      }
      
      .benefits-list {
        display: none;
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



}