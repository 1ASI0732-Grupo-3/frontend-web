import { Observable } from "rxjs";
import { Animal, CreateAnimalRequest } from "../../shared/models/animal.model";

export abstract class AnimalRepository {
  abstract getAnimals(): Observable<Animal[]>;
  abstract getAnimalById(id: number): Observable<Animal>;
  abstract createAnimal(request: CreateAnimalRequest): Observable<Animal>;
  abstract updateAnimal(id: number, animal: Partial<Animal>): Observable<Animal>;
  abstract deleteAnimal(id: number): Observable<void>;
}

export {};