import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../application/services/auth.service';
import { TokenService } from '../../../../application/services/token.service';
import { RegisterRequest } from '../../../../shared/models/user.model';

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
              <label for="username" class="form-label">Username</label>
              <input 
                id="username"
                type="text" 
                class="form-input" 
                placeholder="Enter your username" 
                [(ngModel)]="registerRequest.username"
                name="username"
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
              <div class="password-wrapper">
                <input 
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  class="form-input" 
                  placeholder="Create a strong password" 
                  [(ngModel)]="registerRequest.password"
                  name="password"
                  required
                  minlength="8">
                <button
                  type="button"
                  class="toggle-password"
                  (click)="togglePasswordVisibility()">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
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

    .password-wrapper {
      position: relative;
      width: 100%;
    }

    .toggle-password {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      color: var(--dark-green);
      transition: color 0.2s ease;
    }

    .toggle-password:hover {
      color: #064a32;
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
    username: '', // Cambiado de name a username
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService // Agregado TokenService
  ) {}

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.register(this.registerRequest).subscribe({
      next: (response: any) => {
        // Guardar token y usuario después del registro exitoso
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);

        this.loading = false;
        this.router.navigate(['/dashboard']); // Ir directamente al dashboard
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}