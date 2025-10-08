import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardRepository } from '@domain/repositories/dashboard.repository';
import { DashboardStats, UpcomingEvent, EventType } from '@shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardRepositoryImpl extends DashboardRepository {

  getStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      registeredAnimals: 123,
      campaigns: 4,
      employees: 32,
      vaccinesAboutToExpire: 10,
      activeCampaigns: 6
    };
    
    return of(stats).pipe(delay(500));
  }

  getUpcomingEvents(): Observable<UpcomingEvent[]> {
    const events: UpcomingEvent[] = [
      {
        id: '1',
        title: 'Foot and Mouth Disease Vaccination',
        date: '10-May',
        type: EventType.VACCINATION
      },
      {
        id: '2',
        title: 'Internal and External Deworming',
        date: '05-July',
        type: EventType.DEWORMING
      },
      {
        id: '3',
        title: 'Brucellosis Sanitation Campaign',
        date: '23-August',
        type: EventType.CAMPAIGN
      }
    ];
    
    return of(events).pipe(delay(500));
  }
}