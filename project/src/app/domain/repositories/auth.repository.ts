import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/user.model';

export abstract class AuthRepository {
  abstract login(request: LoginRequest): Observable<AuthResponse>;
  abstract register(request: RegisterRequest): Observable<AuthResponse>;
  abstract logout(): Observable<void>;
  abstract getCurrentUser(): Observable<any>;
}

export { AuthRepository }