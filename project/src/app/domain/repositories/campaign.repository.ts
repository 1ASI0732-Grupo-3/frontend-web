import { Observable } from "rxjs";
import { Campaign, CreateCampaignRequest } from "../../shared/models/campaign.model";

export abstract class CampaignRepository {
  abstract getCampaigns(): Observable<Campaign[]>;
  abstract getCampaignById(id: number): Observable<Campaign>;
  abstract createCampaign(request: CreateCampaignRequest): Observable<Campaign>;
  abstract updateCampaign(id: number, campaign: Partial<Campaign>): Observable<Campaign>;
  abstract deleteCampaign(id: number): Observable<void>;
  abstract getActiveCampaigns(): Observable<Campaign[]>;
  abstract getCompletedCampaigns(): Observable<Campaign[]>;
}

export {};