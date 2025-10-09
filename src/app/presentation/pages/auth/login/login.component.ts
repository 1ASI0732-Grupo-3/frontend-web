import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../application/services/auth.service';
import { TokenService } from '../../../../application/services/token.service';
import { LoginRequest } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <!-- Left Panel - Branding -->
      <div class="auth-left-panel">
        <div class="branding-content">
          <h1 class="brand-title">Welcome to VacApp</h1>
          <p class="brand-subtitle">Your comprehensive veterinary management solution</p>
          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Manage your livestock efficiently</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Track vaccination campaigns</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Monitor inventory levels</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Login Form -->
      <div class="auth-right-panel">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">Sign In</h2>
            <p class="form-subtitle">Enter your credentials to access your account</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="input-group">
              <label for="userName" class="input-label">User Name</label>
              <input
                id="userName"
                type="text"
                class="form-input"
                placeholder="Enter your username"
                [(ngModel)]="loginRequest.userName"
                name="userName"
                required
                #userNameInput="ngModel">
            </div>

            <div class="input-group">
              <label for="password" class="input-label">Password</label>
              <div class="password-wrapper">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Enter your password"
                  [(ngModel)]="loginRequest.password"
                  name="password"
                  required
                  minlength="6"
                  #passwordInput="ngModel">
                <button
                  type="button"
                  class="toggle-password"
                  (click)="togglePasswordVisibility()">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.22A9.953 9.953 0 0012 4.5c2.21 0 4.21.74 5.83 1.98M3.98 15.78A9.953 9.953 0 0012 19.5c2.21 0 4.21-.74 5.83-1.98M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.22A9.953 9.953 0 0012 4.5c2.21 0 4.21.74 5.83 1.98M3.98 15.78A9.953 9.953 0 0012 19.5c2.21 0 4.21-.74 5.83-1.98M12 12l9.25 9.25M12 12L2.75 2.75" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" class="form-checkbox">
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-link" (click)="forgotPassword($event)">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary auth-submit"
              [disabled]="loading || loginForm.invalid">
              <span *ngIf="loading">Signing In...</span>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>

          <div class="auth-switch">
            Don't have an account? 
            <a routerLink="/auth/register" class="switch-link">Sign Up</a>
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
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--dark-green) 0%, #064a32 100%);
    }

    .auth-left-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: white;
    }

    .branding-content {
      max-width: 500px;
      text-align: center;
    }

    .brand-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .brand-subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .features-list {
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .feature-item svg {
      margin-right: 1rem;
      opacity: 0.8;
    }

    .auth-right-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      padding: 2rem;
    }

    .form-container {
      width: 100%;
      max-width: 400px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      color: #666;
      font-size: 0.9rem;
    }

    .input-group {
      margin-bottom: 1.5rem;
    }

    .input-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #2d5a4f;
      box-shadow: 0 0 0 3px rgba(45, 90, 79, 0.1);
    }

    .password-wrapper {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-password:hover {
      color: #2d5a4f;
    }

    .icon {
      width: 20px;
      height: 20px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #666;
      cursor: pointer;
    }

    .form-checkbox {
      margin-right: 0.5rem;
    }

    .forgot-link {
      color: #2d5a4f;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      display: inline-block;
      text-decoration: none;
    }

    .btn-primary {
      background: var(--dark-green);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      background: #064a32;
      box-shadow: 0 4px 12px rgba(3, 45, 35, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-submit {
      width: 100%;
      margin-bottom: 1rem;
    }

    .auth-switch {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .switch-link {
      color: #2d5a4f;
      text-decoration: none;
      font-weight: 600;
    }

    .switch-link:hover {
      text-decoration: underline;
    }

    .error-message {
      background-color: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.9rem;
      text-align: center;
    }



    @media (max-width: 768px) {
      .auth-container {
        flex-direction: column;
      }

      .auth-left-panel {
        padding: 1rem;
      }

      .brand-title {
        font-size: 2rem;
      }

      .auth-right-panel {
        padding: 1rem;
      }
    }
  `]
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    userName: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';

    console.log('🔐 Usando backend real para login');

    // Usar únicamente el backend real
    this.authService.login(this.loginRequest).subscribe({
      next: (response: any) => {
        console.log('✅ Login exitoso:', response);
        // Guardar token y usuario
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);

        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('❌ Error en login:', error);
        this.loading = false;
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Forgot password - Not implemented');
  }
}