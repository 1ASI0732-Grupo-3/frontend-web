import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AnimalRepository } from '../../domain/repositories/animal.repository';
import { Animal, CreateAnimalRequest } from '../../shared/models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalRepositoryImpl extends AnimalRepository {
  private animals: Animal[] = [
    {
      id: '1',
      name: 'Gloria',
      breed: 'Gelbvieh',
      weight: 510,
      age: 4,
      birthdate: new Date('2021-01-12'),
      barn: 'La Bendición',
      location: 'Chorrillos',
      campaign: 'Vacas locas',
      gender: 'female',
      imageUrl: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=300&fit=crop&crop=center',
      createdAt: new Date('2021-01-15')
    },
    {
      id: '2',
      name: 'Motomoto',
      breed: 'Holstein',
      weight: 510,
      age: 4,
      birthdate: new Date('2021-02-20'),
      barn: 'San Miguel',
      location: 'Lima Norte',
      campaign: 'Vacas locas',
      gender: 'male',
      imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop&crop=center',
      createdAt: new Date('2021-02-25')
    },
    {
      id: '3',
      name: 'Rebeca',
      breed: 'Holstein Friesian',
      weight: 510,
      age: 4,
      birthdate: new Date('2021-03-05'),
      barn: 'El Paraíso',
      location: 'Callao',
      campaign: 'Vacas locas',
      gender: 'female',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop&crop=center',
      createdAt: new Date('2021-03-10')
    }
  ];

  getAnimals(): Observable<Animal[]> {
    return of([...this.animals]).pipe(delay(500));
  }

  getAnimalById(id: string): Observable<Animal> {
    const animal = this.animals.find(a => a.id === id);
    if (!animal) {
      throw new Error(`Animal with id ${id} not found`);
    }
    return of({ ...animal }).pipe(delay(300));
  }

  createAnimal(request: CreateAnimalRequest): Observable<Animal> {
    const age = this.calculateAge(request.birthdate);
    const newAnimal: Animal = {
      id: Math.random().toString(36).substr(2, 9),
      ...request,
      age,
      createdAt: new Date()
    };
    
    this.animals.push(newAnimal);
    return of({ ...newAnimal }).pipe(delay(800));
  }

  updateAnimal(id: string, updates: Partial<Animal>): Observable<Animal> {
    const index = this.animals.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Animal with id ${id} not found`);
    }
    
    this.animals[index] = { ...this.animals[index], ...updates };
    return of({ ...this.animals[index] }).pipe(delay(500));
  }

  deleteAnimal(id: string): Observable<void> {
    const index = this.animals.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Animal with id ${id} not found`);
    }
    
    this.animals.splice(index, 1);
    return of(void 0).pipe(delay(400));
  }

  private calculateAge(birthdate: Date): number {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return Math.max(0, age);
  }
}