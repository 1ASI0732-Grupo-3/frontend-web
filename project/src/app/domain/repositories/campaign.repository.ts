import { Observable } from "rxjs";
import { Campaign, CreateCampaignRequest } from "../../shared/models/campaign.model";

export abstract class CampaignRepository {
  abstract getCampaigns(): Observable<Campaign[]>;
  abstract getCampaignById(id: string): Observable<Campaign>;
  abstract createCampaign(request: CreateCampaignRequest): Observable<Campaign>;
  abstract updateCampaign(id: string, campaign: Partial<Campaign>): Observable<Campaign>;
  abstract deleteCampaign(id: string): Observable<void>;
  abstract getActiveCampaigns(): Observable<Campaign[]>;
  abstract getCompletedCampaigns(): Observable<Campaign[]>;
}

export {};