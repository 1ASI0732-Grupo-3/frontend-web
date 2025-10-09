import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { DashboardStats, UpcomingEvent } from '../../shared/models/dashboard.model';
import { DashboardService } from '../../application/services/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardRepositoryImpl extends DashboardRepository {

  constructor(private dashboardService: DashboardService) {
    super();
  }

  getStats(): Observable<DashboardStats> {
    // Usar el servicio real que hace peticiones a tu backend
    return this.dashboardService.getStats();
  }

  getUpcomingEvents(): Observable<UpcomingEvent[]> {
    // Usar el servicio real que calcula eventos desde campañas reales
    return this.dashboardService.getUpcomingEvents();
  }
}