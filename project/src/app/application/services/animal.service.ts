import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnimalRepository } from '../../domain/repositories/animal.repository';
import { Animal, CreateAnimalRequest } from '../../shared/models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  constructor(private animalRepository: AnimalRepository) {}

  getAnimals(): Observable<Animal[]> {
    return this.animalRepository.getAnimals();
  }

  getAnimalById(id: string): Observable<Animal> {
    return this.animalRepository.getAnimalById(id);
  }

  createAnimal(request: CreateAnimalRequest): Observable<Animal> {
    return this.animalRepository.createAnimal(request);
  }

  updateAnimal(id: string, animal: Partial<Animal>): Observable<Animal> {
    return this.animalRepository.updateAnimal(id, animal);
  }

  deleteAnimal(id: string): Observable<void> {
    return this.animalRepository.deleteAnimal(id);
  }
}