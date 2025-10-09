import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CampaignRepository } from '../../domain/repositories/campaign.repository';
import { Campaign, CreateCampaignRequest, CampaignStatus, CreateCampaignApiRequest } from '../../shared/models/campaign.model';
import { API_ENDPOINTS } from '../../shared/config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class CampaignRepositoryImpl extends CampaignRepository {

  constructor(private http: HttpClient) {
    super();
  }

  getCampaigns(): Observable<Campaign[]> {
    console.log('📋 Fetching campaigns from:', API_ENDPOINTS.CAMPAIGNS.LIST);
    return this.http.get<any[]>(API_ENDPOINTS.CAMPAIGNS.LIST).pipe(
      map(apiCampaigns => {
        console.log('✅ Campaigns received:', apiCampaigns);
        return apiCampaigns.map(apiCampaign => this.mapApiCampaignToCampaign(apiCampaign));
      }),
      catchError(error => {
        console.error('❌ Error fetching campaigns:', error);
        return of([]);
      })
    );
  }

  getCampaignById(id: number): Observable<Campaign> {
    const url = API_ENDPOINTS.CAMPAIGNS.DETAIL(id.toString());
    console.log('📋 Fetching campaign by ID from:', url);

    return this.http.get<any>(url).pipe(
      map(apiCampaign => {
        console.log('✅ Campaign received:', apiCampaign);
        return this.mapApiCampaignToCampaign(apiCampaign);
      }),
      catchError(error => {
        console.error('❌ Error fetching campaign:', error);
        throw error;
      })
    );
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    console.log('🆕 Creating new campaign:', request);

    // Adaptar el request al formato esperado por la API
    const apiRequest: CreateCampaignApiRequest = {
      name: request.name,
      description: request.description,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
      status: request.status || 'Draft',
      goals: request.goals || [],
      channels: request.channels || [],
      stableId: request.stableId
    };

    return this.http.post<any>(API_ENDPOINTS.CAMPAIGNS.CREATE, apiRequest).pipe(
      map(response => {
        console.log('✅ Campaign created:', response);
        return this.mapApiCampaignToCampaign(response);
      }),
      catchError(error => {
        console.error('❌ Error creating campaign:', error);
        throw error;
      })
    );
  }

  updateCampaign(id: number, updates: Partial<Campaign>): Observable<Campaign> {
    const url = API_ENDPOINTS.CAMPAIGNS.UPDATE(id.toString());
    console.log('🔄 Updating campaign:', id, updates);

    return this.http.put<any>(url, updates).pipe(
      map(response => {
        console.log('✅ Campaign updated:', response);
        return this.mapApiCampaignToCampaign(response);
      }),
      catchError(error => {
        console.error('❌ Error updating campaign:', error);
        throw error;
      })
    );
  }

  deleteCampaign(id: number): Observable<void> {
    const url = API_ENDPOINTS.CAMPAIGNS.DELETE(id.toString());
    console.log('🗑️ Deleting campaign:', id);

    return this.http.delete<void>(url).pipe(
      map(() => {
        console.log('✅ Campaign deleted successfully');
      }),
      catchError(error => {
        console.error('❌ Error deleting campaign:', error);
        throw error;
      })
    );
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    console.log('📋 Fetching active campaigns');
    return this.getCampaigns().pipe(
      map(campaigns => campaigns.filter(campaign => campaign.status === CampaignStatus.ACTIVE))
    );
  }

  getCompletedCampaigns(): Observable<Campaign[]> {
    console.log('📋 Fetching completed campaigns');
    return this.getCampaigns().pipe(
      map(campaigns => campaigns.filter(campaign => campaign.status === CampaignStatus.COMPLETED))
    );
  }

  private mapApiCampaignToCampaign(apiCampaign: any): Campaign {
    return {
      id: apiCampaign.id,
      name: apiCampaign.name,
      description: apiCampaign.description,
      startDate: new Date(apiCampaign.startDate),
      endDate: new Date(apiCampaign.endDate),
      status: this.mapApiStatusToCampaignStatus(apiCampaign.status),
      goals: apiCampaign.goals || [],
      channels: apiCampaign.channels || [],
      stableId: apiCampaign.stableId,
      createdAt: new Date(apiCampaign.createdAt || Date.now()),
      updatedAt: new Date(apiCampaign.updatedAt || Date.now())
    };
  }

  private mapApiStatusToCampaignStatus(apiStatus: string): CampaignStatus {
    switch (apiStatus?.toLowerCase()) {
      case 'active':
        return CampaignStatus.ACTIVE;
      case 'draft':
        return CampaignStatus.DRAFT;
      case 'completed':
        return CampaignStatus.COMPLETED;
      case 'cancelled':
        return CampaignStatus.CANCELLED;
      default:
        return CampaignStatus.DRAFT;
    }
  }
}