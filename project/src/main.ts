import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';

// Repository providers
import { AuthRepository } from './app/domain/repositories/auth.repository';
import { DashboardRepository } from './app/domain/repositories/dashboard.repository';
import { PlansRepository } from './app/domain/repositories/plans.repository';
import { AnimalRepository } from './app/domain/repositories/animal.repository';
import { CampaignRepository } from './app/domain/repositories/campaign.repository';
import { InventoryRepository } from './app/domain/repositories/inventory.repository';
import { AuthRepositoryImpl } from './app/infrastructure/repositories/auth.repository.impl';
import { DashboardRepositoryImpl } from './app/infrastructure/repositories/dashboard.repository.impl';
import { PlansRepositoryImpl } from './app/infrastructure/repositories/plans.repository.impl';
import { AnimalRepositoryImpl } from './app/infrastructure/repositories/animal.repository.impl';
import { CampaignRepositoryImpl } from './app/infrastructure/repositories/campaign.repository.impl';
import { InventoryRepositoryImpl } from './app/infrastructure/repositories/inventory.repository.impl';

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
    provideHttpClient(),
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: DashboardRepository, useClass: DashboardRepositoryImpl },
    { provide: PlansRepository, useClass: PlansRepositoryImpl },
    { provide: AnimalRepository, useClass: AnimalRepositoryImpl },
    { provide: CampaignRepository, useClass: CampaignRepositoryImpl },
    { provide: InventoryRepository, useClass: InventoryRepositoryImpl }
  ]
});
