import { Observable } from "rxjs";
import { Plan } from "../../shared/models/plan.model";

export abstract class PlansRepository {
  abstract getPlans(): Observable<Plan[]>;
  abstract subscribeToPlan(planId: string): Observable<boolean>;
}

export {};
