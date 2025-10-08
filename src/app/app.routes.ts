import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
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
    loadComponent: () => import('@pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'auth/register',
    loadComponent: () => import('@pages/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'plans',
    loadComponent: () => import('@pages/plans/plans.component').then(m => m.PlansComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'animals',
    loadComponent: () => import('@pages/animals/animals.component').then(m => m.AnimalsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'animals/new',
    loadComponent: () => import('@pages/animals/add-animal.component').then(m => m.AddAnimalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'animals/:id',
    loadComponent: () => import('@pages/animals/animal-detail.component').then(m => m.AnimalDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns',
    loadComponent: () => import('@pages/campaigns/campaigns.component').then(m => m.CampaignsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns/new',
    loadComponent: () => import('@pages/campaigns/add-campaign.component').then(m => m.AddCampaignComponent),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns/:id',
    loadComponent: () => import('@pages/campaigns/campaign-detail.component').then(m => m.CampaignDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    loadComponent: () => import('@pages/inventory/inventory.component').then(m => m.InventoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory/products',
    loadComponent: () => import('@pages/inventory/inventory-products.component').then(m => m.InventoryProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventory/add-product',
    loadComponent: () => import('@pages/inventory/add-inventory-product.component').then(m => m.AddInventoryProductComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('@pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];