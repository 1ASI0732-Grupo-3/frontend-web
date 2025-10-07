import { Observable } from "rxjs";
import { Animal, CreateAnimalRequest } from "../../shared/models/animal.model";

export abstract class AnimalRepository {
  abstract getAnimals(): Observable<Animal[]>;
  abstract getAnimalById(id: string): Observable<Animal>;
  abstract createAnimal(request: CreateAnimalRequest): Observable<Animal>;
  abstract updateAnimal(id: string, animal: Partial<Animal>): Observable<Animal>;
  abstract deleteAnimal(id: string): Observable<void>;
}

export {};