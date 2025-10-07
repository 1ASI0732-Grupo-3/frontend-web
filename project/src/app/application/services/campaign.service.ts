import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CampaignRepository } from '../../domain/repositories/campaign.repository';
import { Campaign, CreateCampaignRequest } from '../../shared/models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private campaignRepository: CampaignRepository) {}

  getCampaigns(): Observable<Campaign[]> {
    return this.campaignRepository.getCampaigns();
  }

  getCampaignById(id: string): Observable<Campaign> {
    return this.campaignRepository.getCampaignById(id);
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    return this.campaignRepository.createCampaign(request);
  }

  updateCampaign(id: string, campaign: Partial<Campaign>): Observable<Campaign> {
    return this.campaignRepository.updateCampaign(id, campaign);
  }

  deleteCampaign(id: string): Observable<void> {
    return this.campaignRepository.deleteCampaign(id);
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    return this.campaignRepository.getActiveCampaigns();
  }

  getCompletedCampaigns(): Observable<Campaign[]> {
    return this.campaignRepository.getCompletedCampaigns();
  }
}