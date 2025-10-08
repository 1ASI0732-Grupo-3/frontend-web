import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PlansRepository } from '@domain/repositories/plans.repository';
import { Plan } from '@shared/models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlansRepositoryImpl extends PlansRepository {

  getPlans(): Observable<Plan[]> {
    const plans: Plan[] = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'S/',
        features: [
          'Registro de hasta 10 animales.',
          'Acceso básico al historial sanitario.',
          'Recordatorios limitados.',
          'Visualización de reportes mensuales en formato simple.',
          'Soporte por correo electrónico.'
        ]
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 49.90,
        currency: 'S/',
        features: [
          'Registro ilimitado de animales.',
          'Seguimiento completo de salud y vacunación.',
          'Gestión de inventario y productos.',
          'Soporte prioritario.'
        ],
        isPopular: true
      }
    ];
    
    return of(plans).pipe(delay(500));
  }

  subscribeToPlan(planId: string): Observable<boolean> {
    console.log(`Subscribing to plan: ${planId}`);
    return of(true).pipe(delay(1000));
  }
}