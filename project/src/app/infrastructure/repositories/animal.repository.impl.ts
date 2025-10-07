import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AnimalRepository } from '../../domain/repositories/animal.repository';
import { 
  Animal, 
  CreateAnimalRequest,
  Vaccination,
  Stable 
} from '../../shared/models/animal.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimalRepositoryImpl extends AnimalRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bovines`).pipe(
      map(apiAnimals => apiAnimals.map(apiAnimal => this.mapApiAnimalToAnimal(apiAnimal))),
      catchError(error => {
        console.error('Error fetching animals:', error);
        return of([]);
      })
    );
  }

  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<any>(`${this.baseUrl}/bovines/${id}`).pipe(
      map(apiAnimal => this.mapApiAnimalToAnimal(apiAnimal)),
      catchError(error => {
        console.error('Error fetching animal:', error);
        throw error;
      })
    );
  }

  createAnimal(request: CreateAnimalRequest): Observable<Animal> {
    // Convert request to API format and create multipart form data
    const formData = new FormData();
    formData.append('Name', request.name);
    formData.append('Gender', request.gender);
    formData.append('BirthDate', request.birthdate.toISOString());
    formData.append('Breed', request.breed);
    formData.append('Location', request.location);
    formData.append('StableId', '1'); // Default stable, will need to be dynamic

    // If imageUrl is provided as base64 or file
    if (request.imageUrl) {
      // Handle image upload - this will be implemented in the file upload section
      // For now, skip image upload
    }

    return this.http.post<any>(`${this.baseUrl}/bovines`, formData).pipe(
      map((apiResponse) => {
        // Convert API response to frontend format
        const animal: Animal = {
          id: apiResponse.id,
          name: apiResponse.name,
          breed: apiResponse.breed,
          gender: apiResponse.gender,
          location: apiResponse.location,
          birthDate: apiResponse.birthDate,
          birthdate: new Date(apiResponse.birthDate), // For component compatibility
          bovineImg: apiResponse.bovineImg,
          imageUrl: apiResponse.bovineImg, // For component compatibility
          stableId: apiResponse.stableId,
          weight: request.weight,
          campaign: request.campaign,
          barn: request.barn,
          age: this.calculateAge(apiResponse.birthDate),
          createdAt: new Date()
        };
        return animal;
      }),
      catchError(error => {
        console.error('Error creating animal:', error);
        throw error;
      })
    );
  }

  updateAnimal(id: number, updates: Partial<Animal>): Observable<Animal> {
    const formData = new FormData();
    
    if (updates.name) formData.append('Name', updates.name);
    if (updates.gender) formData.append('Gender', updates.gender);
    if (updates.breed) formData.append('Breed', updates.breed);
    if (updates.location) formData.append('Location', updates.location);
    if (updates.stableId) formData.append('StableId', updates.stableId.toString());

    return this.http.put<any>(`${this.baseUrl}/bovines/${id}`, formData).pipe(
      map(apiAnimal => this.mapApiAnimalToAnimal(apiAnimal)),
      catchError(error => {
        console.error('Error updating animal:', error);
        throw error;
      })
    );
  }

  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bovines/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting animal:', error);
        throw error;
      })
    );
  }

  // Additional API methods
  getAnimalsByStable(stableId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.baseUrl}/bovines/stable/${stableId}`).pipe(
      catchError(error => {
        console.error('Error fetching animals by stable:', error);
        return of([]);
      })
    );
  }

  getVaccinations(animalId: number): Observable<Vaccination[]> {
    return this.http.get<Vaccination[]>(`${this.baseUrl}/vaccines/bovine/${animalId}`).pipe(
      catchError(error => {
        console.error('Error fetching vaccinations:', error);
        return of([]);
      })
    );
  }

  getStables(): Observable<Stable[]> {
    return this.http.get<Stable[]>(`${this.baseUrl}/stables`).pipe(
      catchError(error => {
        console.error('Error fetching stables:', error);
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
      birthDate: apiAnimal.birthDate,
      birthdate: new Date(apiAnimal.birthDate), // For component compatibility
      bovineImg: apiAnimal.bovineImg,
      imageUrl: apiAnimal.bovineImg || '', // For component compatibility
      stableId: apiAnimal.stableId,
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
