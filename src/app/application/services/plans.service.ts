import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlansRepository } from '@domain/repositories/plans.repository';
import { Plan } from '@shared/models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private plansRepository: PlansRepository) {}

  getPlans(): Observable<Plan[]> {
    return this.plansRepository.getPlans();
  }

  subscribeToPlan(planId: string): Observable<boolean> {
    return this.plansRepository.subscribeToPlan(planId);
  }
}