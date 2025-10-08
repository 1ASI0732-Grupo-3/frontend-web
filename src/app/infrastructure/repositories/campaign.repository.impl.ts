import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { CampaignRepository } from '@domain/repositories/campaign.repository';
import { Campaign, CreateCampaignRequest, CampaignStatus, CreateCampaignApiRequest } from '@shared/models/campaign.model';
import {environment} from "../../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class CampaignRepositoryImpl extends CampaignRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  // Backup mock data for fallback
  private mockCampaigns: Campaign[] = [
    {
      id: 1,
      name: 'Bovine Brucellosis',
      description: 'Cattle vaccination',
      startDate: new Date('2025-05-09'),
      endDate: new Date('2025-06-20'),
      status: CampaignStatus.ACTIVE,
      targetAnimals: ['cattle', 'bovine'],
      vaccineType: 'Brucellosis Vaccine',
      createdAt: new Date('2025-05-01'),
      updatedAt: new Date('2025-05-09')
    },
    {
      id: 2,
      name: 'Foot-and-Mouth Disease',
      description: 'Cattle vaccination',
      startDate: new Date('2025-05-09'),
      endDate: new Date('2025-06-20'),
      status: CampaignStatus.ACTIVE,
      targetAnimals: ['cattle', 'livestock'],
      vaccineType: 'FMD Vaccine',
      createdAt: new Date('2025-05-01'),
      updatedAt: new Date('2025-05-09')
    },
    {
      id: 3,
      name: 'Healthy Herd 2025',
      description: 'Cattle vaccination',
      startDate: new Date('2025-05-09'),
      endDate: new Date('2025-06-20'),
      status: CampaignStatus.SCHEDULED,
      targetAnimals: ['cattle', 'livestock'],
      vaccineType: 'Multi-vaccine Protocol',
      createdAt: new Date('2025-05-01'),
      updatedAt: new Date('2025-05-09')
    },
    {
      id: 4,
      name: 'Winter Deworming Campaign',
      description: 'Comprehensive deworming program',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-04-30'),
      status: CampaignStatus.COMPLETED,
      targetAnimals: ['cattle', 'sheep', 'goats'],
      vaccineType: 'Antiparasitic Treatment',
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-04-30')
    }
  ];

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<any[]>(`${this.baseUrl}/campaigns`).pipe(
      map(apiCampaigns => apiCampaigns.map(apiCampaign => this.mapApiCampaignToCampaign(apiCampaign))),
      catchError(error => {
        console.error('Error fetching campaigns:', error);
        // Fallback to mock data in case of error
        return of([...this.mockCampaigns]);
      })
    );
  }

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<any>(`${this.baseUrl}/campaigns/${id}`).pipe(
      map(apiCampaign => this.mapApiCampaignToCampaign(apiCampaign)),
      catchError(error => {
        console.error('Error fetching campaign:', error);
        throw error;
      })
    );
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    const apiRequest: CreateCampaignApiRequest = {
      name: request.name,
      description: request.description,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
      status: this.determineStatus(request.startDate, request.endDate),
      goals: [],
      channels: [],
      stableId: undefined
    };

    return this.http.post<any>(`${this.baseUrl}/campaigns`, apiRequest).pipe(
      map(apiResponse => this.mapApiCampaignToCampaign(apiResponse)),
      catchError(error => {
        console.error('Error creating campaign:', error);
        throw error;
      })
    );
  }

  updateCampaign(id: number, updates: Partial<Campaign>): Observable<Campaign> {
    const apiUpdates: any = { ...updates };

    // Convert Date fields to ISO strings if present
    if (updates.startDate) {
      apiUpdates.startDate = updates.startDate.toISOString();
    }
    if (updates.endDate) {
      apiUpdates.endDate = updates.endDate.toISOString();
    }

    return this.http.put<any>(`${this.baseUrl}/campaigns/${id}`, apiUpdates).pipe(
      map(apiCampaign => this.mapApiCampaignToCampaign(apiCampaign)),
      catchError(error => {
        console.error('Error updating campaign:', error);
        throw error;
      })
    );
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/campaigns/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting campaign:', error);
        throw error;
      })
    );
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    return this.getCampaigns().pipe(
      map(campaigns => campaigns.filter(c => c.status === CampaignStatus.ACTIVE))
    );
  }

  getCompletedCampaigns(): Observable<Campaign[]> {
    return this.getCampaigns().pipe(
      map(campaigns => campaigns.filter(c => c.status === CampaignStatus.COMPLETED))
    );
  }

  // Mapping function from API format to frontend format
  private mapApiCampaignToCampaign(apiCampaign: any): Campaign {
    return {
      id: apiCampaign.id,
      name: apiCampaign.name,
      description: apiCampaign.description,
      startDate: new Date(apiCampaign.startDate), // Convert string to Date
      endDate: new Date(apiCampaign.endDate), // Convert string to Date
      status: this.mapApiStatus(apiCampaign.status),
      targetAnimals: apiCampaign.targetAnimals || [],
      vaccineType: apiCampaign.vaccineType,
      createdAt: apiCampaign.createdAt ? new Date(apiCampaign.createdAt) : new Date(),
      updatedAt: apiCampaign.updatedAt ? new Date(apiCampaign.updatedAt) : new Date(),
      goals: apiCampaign.goals || [],
      channels: apiCampaign.channels || [],
      stableId: apiCampaign.stableId
    };
  }

  // Map API status to frontend enum
  private mapApiStatus(apiStatus: string): CampaignStatus {
    switch (apiStatus?.toLowerCase()) {
      case 'active':
        return CampaignStatus.ACTIVE;
      case 'completed':
        return CampaignStatus.COMPLETED;
      case 'scheduled':
        return CampaignStatus.SCHEDULED;
      case 'cancelled':
        return CampaignStatus.CANCELLED;
      default:
        return CampaignStatus.SCHEDULED;
    }
  }

  private determineStatus(startDate: Date, endDate: Date): string {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return 'scheduled';
    } else if (now >= start && now <= end) {
      return 'active';
    } else {
      return 'completed';
    }
  }
}