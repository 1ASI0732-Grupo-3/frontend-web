import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './application/services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  } else {
    return router.createUrlTree(['/auth/login']);
  }
};

const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return true;
  } else {
    return router.createUrlTree(['/dashboard']);
  }
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./presentation/pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./presentation/pages/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'plans',
    loadComponent: () => import('./presentation/pages/plans/plans.component').then(m => m.PlansComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./presentation/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'animals',
    loadComponent: () => import('./presentation/pages/animals/animals.component').then(m => m.AnimalsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'animals/new',
    loadComponent: () => import('./presentation/pages/animals/add-animal.component').then(m => m.AddAnimalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'animals/:id',
    loadComponent: () => import('./presentation/pages/animals/animal-detail.component').then(m => m.AnimalDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns',
    loadComponent: () => import('./presentation/pages/campaigns/campaigns.component').then(m => m.CampaignsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns/new',
    loadComponent: () => import('./presentation/pages/campaigns/add-campaign.component').then(m => m.AddCampaignComponent),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns/:id',
    loadComponent: () => import('./presentation/pages/campaigns/campaign-detail.component').then(m => m.CampaignDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    loadComponent: () => import('./presentation/pages/inventory/inventory.component').then(m => m.InventoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory/products',
    loadComponent: () => import('./presentation/pages/inventory/inventory-products.component').then(m => m.InventoryProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory/add-product',
    loadComponent: () => import('./presentation/pages/inventory/add-inventory-product.component').then(m => m.AddInventoryProductComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./presentation/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];