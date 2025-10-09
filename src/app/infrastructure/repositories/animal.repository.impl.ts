import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AnimalRepository } from '../../domain/repositories/animal.repository';
import {
  Animal, 
  CreateAnimalRequest,
  CreateAnimalApiRequest,
  Vaccination,
  Stable 
} from '../../shared/models/animal.model';
import { API_ENDPOINTS } from '../../shared/config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class AnimalRepositoryImpl extends AnimalRepository {

  constructor(private http: HttpClient) {
    super();
  }

  getAnimals(): Observable<Animal[]> {
    console.log('🐄 Fetching bovines from:', API_ENDPOINTS.ANIMALS.LIST);
    return this.http.get<any[]>(API_ENDPOINTS.ANIMALS.LIST).pipe(
      map(apiAnimals => {
        console.log('✅ Bovines received:', apiAnimals);
        return apiAnimals.map(apiAnimal => this.mapApiAnimalToAnimal(apiAnimal));
      }),
      catchError(error => {
        console.error('❌ Error fetching bovines:', error);
        return of([]);
      })
    );
  }

  getAnimalById(id: number): Observable<Animal> {
    const url = API_ENDPOINTS.ANIMALS.DETAIL(id.toString());
    console.log('🐄 Fetching bovine by ID from:', url);

    return this.http.get<any>(url).pipe(
      map(apiAnimal => {
        console.log('✅ Bovine received:', apiAnimal);
        return this.mapApiAnimalToAnimal(apiAnimal);
      }),
      catchError(error => {
        console.error('❌ Error fetching bovine:', error);
        throw error;
      })
    );
  }

  createAnimal(request: CreateAnimalRequest): Observable<Animal> {
    console.log('🆕 Creating new bovine:', request);

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('Name', request.name);
    formData.append('Gender', request.gender);
    formData.append('BirthDate', request.birthDate.toISOString());
    formData.append('Breed', request.breed);
    formData.append('Location', request.location);
    formData.append('StableId', request.stableId.toString());

    // Add image file if provided - backend expects 'FileData' field
    if (request.imageFile) {
      formData.append('FileData', request.imageFile, request.imageFile.name);
    }

    console.log('📤 Sending FormData with:', {
      Name: request.name,
      Gender: request.gender,
      BirthDate: request.birthDate.toISOString(),
      Breed: request.breed,
      Location: request.location,
      StableId: request.stableId,
      hasImage: !!request.imageFile,
      fileName: request.imageFile?.name
    });

    return this.http.post<any>(API_ENDPOINTS.ANIMALS.CREATE, formData).pipe(
      map(response => {
        console.log('✅ Bovine created:', response);
        return this.mapApiAnimalToAnimal(response);
      }),
      catchError(error => {
        console.error('❌ Error creating bovine:', error);
        throw error;
      })
    );
  }

  updateAnimal(id: number, updates: Partial<Animal>): Observable<Animal> {
    const url = API_ENDPOINTS.ANIMALS.UPDATE(id.toString());
    console.log('🔄 Updating bovine:', id, updates);

    const formData = new FormData();
    
    if (updates.name) formData.append('Name', updates.name);
    if (updates.gender) formData.append('Gender', updates.gender);
    if (updates.breed) formData.append('Breed', updates.breed);
    if (updates.location) formData.append('Location', updates.location);
    if (updates.stableId) formData.append('StableId', updates.stableId.toString());

    return this.http.put<any>(url, formData).pipe(
      map(apiAnimal => {
        console.log('✅ Bovine updated:', apiAnimal);
        return this.mapApiAnimalToAnimal(apiAnimal);
      }),
      catchError(error => {
        console.error('❌ Error updating bovine:', error);
        throw error;
      })
    );
  }

  deleteAnimal(id: number): Observable<void> {
    const url = API_ENDPOINTS.ANIMALS.DELETE(id.toString());
    console.log('🗑️ Deleting bovine:', id);

    return this.http.delete<void>(url).pipe(
      map(() => {
        console.log('✅ Bovine deleted successfully');
      }),
      catchError(error => {
        console.error('❌ Error deleting bovine:', error);
        throw error;
      })
    );
  }

  // Additional API methods
  getAnimalsByStable(stableId: number): Observable<Animal[]> {
    const url = API_ENDPOINTS.STABLES.LIST + `/${stableId}/animals`;
    console.log('🏠 Fetching animals by stable from:', url);

    return this.http.get<Animal[]>(url).pipe(
      map(apiAnimals => {
        console.log('✅ Animals by stable received:', apiAnimals);
        return apiAnimals.map(apiAnimal => this.mapApiAnimalToAnimal(apiAnimal));
      }),
      catchError(error => {
        console.error('❌ Error fetching animals by stable:', error);
        return of([]);
      })
    );
  }

  getVaccinations(animalId: number): Observable<Vaccination[]> {
    const url = API_ENDPOINTS.VACCINES.LIST + `/animal/${animalId}`;
    console.log('💉 Fetching vaccinations from:', url);

    return this.http.get<Vaccination[]>(url).pipe(
      map(vaccinations => {
        console.log('✅ Vaccinations received:', vaccinations);
        return vaccinations;
      }),
      catchError(error => {
        console.error('❌ Error fetching vaccinations:', error);
        return of([]);
      })
    );
  }

  getStables(): Observable<Stable[]> {
    console.log('🏠 Fetching stables from:', API_ENDPOINTS.STABLES.LIST);

    return this.http.get<Stable[]>(API_ENDPOINTS.STABLES.LIST).pipe(
      map(stables => {
        console.log('✅ Stables received:', stables);
        return stables;
      }),
      catchError(error => {
        console.error('❌ Error fetching stables:', error);
        return of([]);
      })
    );
  }

  private mapApiAnimalToAnimal(apiAnimal: any): Animal {
    return {
      id: apiAnimal.id,
      name: apiAnimal.name,
      breed: apiAnimal.breed,
      gender: apiAnimal.gender,
      location: apiAnimal.location,
      birthDate: apiAnimal.birthDate, // Keep as ISO string
      bovineImg: apiAnimal.bovineImg,
      stableId: apiAnimal.stableId,

      // For component compatibility
      birthdate: new Date(apiAnimal.birthDate),
      imageUrl: apiAnimal.bovineImg || '',
      weight: 500, // Default weight
      campaign: 'General', // Default campaign
      barn: 'Establo General', // Default barn
      age: this.calculateAge(apiAnimal.birthDate),
      createdAt: new Date()
    };
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return Math.max(0, age);
  }
}
