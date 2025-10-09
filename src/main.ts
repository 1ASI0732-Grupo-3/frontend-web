import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { routes } from '@app/app.routes';
import { AuthInterceptor } from '@app/infrastructure/interceptors/auth.interceptor';

// Repository providers
import { AuthRepository } from '@domain/repositories/auth.repository';
import { DashboardRepository } from '@domain/repositories/dashboard.repository';
import { PlansRepository } from '@domain/repositories/plans.repository';
import { AnimalRepository } from '@domain/repositories/animal.repository';
import { CampaignRepository } from '@domain/repositories/campaign.repository';
import { InventoryRepository } from '@domain/repositories/inventory.repository';
import { AuthRepositoryImpl } from '@repositories/auth.repository.impl';
import { DashboardRepositoryImpl } from '@repositories/dashboard.repository.impl';
import { PlansRepositoryImpl } from '@repositories/plans.repository.impl';
import { AnimalRepositoryImpl } from '@repositories/animal.repository.impl';
import { CampaignRepositoryImpl } from '@repositories/campaign.repository.impl';
import { InventoryRepositoryImpl } from '@repositories/inventory.repository.impl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: DashboardRepository, useClass: DashboardRepositoryImpl },
    { provide: PlansRepository, useClass: PlansRepositoryImpl },
    { provide: AnimalRepository, useClass: AnimalRepositoryImpl },
    { provide: CampaignRepository, useClass: CampaignRepositoryImpl },
    { provide: InventoryRepository, useClass: InventoryRepositoryImpl }
  ]
});