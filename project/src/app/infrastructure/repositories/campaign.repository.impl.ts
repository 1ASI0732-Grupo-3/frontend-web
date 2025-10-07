import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CampaignRepository } from '../../domain/repositories/campaign.repository';
import { Campaign, CreateCampaignRequest, CampaignStatus } from '../../shared/models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignRepositoryImpl extends CampaignRepository {
  private campaigns: Campaign[] = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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
      id: '4',
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
    return of([...this.campaigns]).pipe(delay(500));
  }

  getCampaignById(id: string): Observable<Campaign> {
    const campaign = this.campaigns.find(c => c.id === id);
    if (!campaign) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    return of({ ...campaign }).pipe(delay(300));
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      ...request,
      status: this.determineStatus(request.startDate, request.endDate),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.campaigns.push(newCampaign);
    return of({ ...newCampaign }).pipe(delay(800));
  }

  updateCampaign(id: string, updates: Partial<Campaign>): Observable<Campaign> {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    
    this.campaigns[index] = { 
      ...this.campaigns[index], 
      ...updates,
      updatedAt: new Date()
    };
    return of({ ...this.campaigns[index] }).pipe(delay(500));
  }

  deleteCampaign(id: string): Observable<void> {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    
    this.campaigns.splice(index, 1);
    return of(void 0).pipe(delay(400));
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    const activeCampaigns = this.campaigns.filter(c => c.status === CampaignStatus.ACTIVE);
    return of([...activeCampaigns]).pipe(delay(400));
  }

  getCompletedCampaigns(): Observable<Campaign[]> {
    const completedCampaigns = this.campaigns.filter(c => c.status === CampaignStatus.COMPLETED);
    return of([...completedCampaigns]).pipe(delay(400));
  }

  private determineStatus(startDate: Date, endDate: Date): CampaignStatus {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return CampaignStatus.SCHEDULED;
    } else if (now >= start && now <= end) {
      return CampaignStatus.ACTIVE;
    } else {
      return CampaignStatus.COMPLETED;
    }
  }
}