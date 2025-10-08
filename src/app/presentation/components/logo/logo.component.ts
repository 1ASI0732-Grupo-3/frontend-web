import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <div class="logo-container">
      <div class="logo-circle">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <!-- Cow head icon -->
          <path d="M8 16C8 12 12 8 16 8H24C28 8 32 12 32 16V20C32 24 28 28 24 28H16C12 28 8 24 8 20V16Z" 
                fill="var(--dark-green)" opacity="0.8"/>
          <circle cx="16" cy="18" r="2" fill="var(--dark-green)"/>
          <circle cx="24" cy="18" r="2" fill="var(--dark-green)"/>
          <path d="M14 12C14 10 12 8 10 8C8 8 6 10 6 12V14H14V12Z" fill="var(--dark-green)" opacity="0.6"/>
          <path d="M26 12C26 10 28 8 30 8C32 8 34 10 34 12V14H26V12Z" fill="var(--dark-green)" opacity="0.6"/>
        </svg>
        <div class="logo-text">VacApp</div>
      </div>
    </div>
  `,
  styles: [`
    .logo-container {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }

    .logo-circle {
      width: 160px;
      height: 160px;
      background: var(--white);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: var(--transition);
    }

    .logo-circle:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: var(--dark-green);
      margin-top: 8px;
    }
  `]
})
export class LogoComponent {}