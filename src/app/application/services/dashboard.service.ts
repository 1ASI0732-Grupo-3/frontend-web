import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DashboardStats, UpcomingEvent } from '../../shared/models/dashboard.model';
import { API_ENDPOINTS } from '../../shared/config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    console.log('📊 Fetching real dashboard stats from backend');

    // Hacer peticiones paralelas a todos los endpoints para obtener conteos reales
    return forkJoin({
      bovines: this.http.get<any[]>(API_ENDPOINTS.ANIMALS.LIST).pipe(
        map(data => data.length),
        catchError(() => of(0))
      ),
      campaigns: this.http.get<any[]>(API_ENDPOINTS.CAMPAIGNS.LIST).pipe(
        map(data => data.length),
        catchError(() => of(0))
      ),
      stables: this.http.get<any[]>(API_ENDPOINTS.STABLES.LIST).pipe(
        map(data => data.length),
        catchError(() => of(0))
      ),
      staff: this.http.get<any[]>(API_ENDPOINTS.STAFF.LIST).pipe(
        map(data => data.length),
        catchError(() => of(0))
      ),
      vaccines: this.http.get<any[]>(API_ENDPOINTS.VACCINES.LIST).pipe(
        map(data => data.length),
        catchError(() => of(0))
      ),
      activeCampaigns: this.http.get<any[]>(API_ENDPOINTS.CAMPAIGNS.LIST).pipe(
        map(data => data.filter(campaign => campaign.status === 'Active').length),
        catchError(() => of(0))
      )
    }).pipe(
      map(results => {
        console.log('✅ Real stats calculated:', results);

        const stats: DashboardStats = {
          registeredAnimals: results.bovines,
          campaigns: results.campaigns,
          employees: results.staff,
          vaccinesAboutToExpire: 0, // Calcular basado en fechas reales si es necesario
          activeCampaigns: results.activeCampaigns,
          totalStables: results.stables,
          totalVaccines: results.vaccines
        };

        return stats;
      }),
      catchError(error => {
        console.error('❌ Error fetching dashboard stats:', error);
        // Retornar stats vacías en caso de error
        return of({
          registeredAnimals: 0,
          campaigns: 0,
          employees: 0,
          vaccinesAboutToExpire: 0,
          activeCampaigns: 0,
          totalStables: 0,
          totalVaccines: 0
        });
      })
    );
  }

  getUpcomingEvents(): Observable<UpcomingEvent[]> {
    console.log('📅 Fetching upcoming events from real campaigns');

    return this.http.get<any[]>(API_ENDPOINTS.CAMPAIGNS.LIST).pipe(
      map(campaigns => {
        const upcomingEvents: UpcomingEvent[] = [];
        const now = new Date();

        campaigns.forEach(campaign => {
          const startDate = new Date(campaign.startDate);
          const endDate = new Date(campaign.endDate);

          // Eventos de campañas que están por comenzar o terminar
          if (startDate > now) {
            upcomingEvents.push({
              id: campaign.id,
              title: `${campaign.name} - Start`,
              date: startDate.toLocaleDateString(),
              type: 'campaign-start'
            });
          }

          if (endDate > now && startDate <= now) {
            upcomingEvents.push({
              id: campaign.id,
              title: `${campaign.name} - End`,
              date: endDate.toLocaleDateString(),
              type: 'campaign-end'
            });
          }
        });

        // Ordenar por fecha
        upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        console.log('✅ Upcoming events calculated:', upcomingEvents);
        return upcomingEvents.slice(0, 5); // Limitar a 5 eventos
      }),
      catchError(error => {
        console.error('❌ Error fetching upcoming events:', error);
        return of([]);
      })
    );
  }
}