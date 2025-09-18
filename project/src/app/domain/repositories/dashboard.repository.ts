import { Observable } from 'rxjs';
import { DashboardStats, UpcomingEvent } from '../../shared/models/dashboard.model';

export abstract class DashboardRepository {
  abstract getStats(): Observable<DashboardStats>;
  abstract getUpcomingEvents(): Observable<UpcomingEvent[]>;
}

export { DashboardRepository }