import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { DashboardStats, UpcomingEvent } from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private dashboardRepository: DashboardRepository) {}

  getStats(): Observable<DashboardStats> {
    return this.dashboardRepository.getStats();
  }

  getUpcomingEvents(): Observable<UpcomingEvent[]> {
    return this.dashboardRepository.getUpcomingEvents();
  }
}