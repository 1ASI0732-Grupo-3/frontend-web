import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  SignInRequest,
  SignUpRequest,
  UserInfo,
  UserRole
} from '@shared/models/user.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl extends AuthRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    const signInRequest: SignInRequest = {
      email: request.email,
      password: request.password
    };

    return this.http.post<any>(`${this.baseUrl}/user/sign-in`, signInRequest).pipe(
      map(response => {
        // The actual API response structure may vary, adjust as needed
        const authResponse: AuthResponse = {
          token: response.token || response.accessToken, // Adjust based on API
          user: {
            username: response.username || response.user?.username || '',
            name: response.username || response.user?.username || '', // For component compatibility
            email: response.email || response.user?.email || request.email,
            emailConfirmed: response.emailConfirmed || response.user?.emailConfirmed || false,
            id: response.id || response.user?.id || '1', // For component compatibility
            role: UserRole.VETERINARIAN, // Default role
            createdAt: new Date()
          }
        };
        return authResponse;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const signUpRequest: SignUpRequest = {
      username: request.name,
      email: request.email,
      password: request.password
    };

    return this.http.post<any>(`${this.baseUrl}/user/sign-up`, signUpRequest).pipe(
      map(response => {
        // The actual API response structure may vary, adjust as needed
        const authResponse: AuthResponse = {
          token: response.token || response.accessToken,
          user: {
            username: response.username || signUpRequest.username,
            name: response.username || signUpRequest.username, // For component compatibility
            email: response.email || signUpRequest.email,
            emailConfirmed: response.emailConfirmed || false,
            id: response.id || '1', // For component compatibility
            role: UserRole.VETERINARIAN, // Default role
            createdAt: new Date()
          }
        };
        return authResponse;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  logout(): Observable<void> {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    return of(void 0);
  }

  getCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return of(null);
    }

    // Try to get user info from API
    return this.http.get<any>(`${this.baseUrl}/user/get-info`).pipe(
      map(response => {
        const user: User = {
          username: response.name || '',
          name: response.name || '', // For component compatibility
          email: response.email || '',
          emailConfirmed: true,
          id: response.id || '1', // For component compatibility
          role: UserRole.VETERINARIAN, // Default role
          createdAt: new Date()
        };
        return user;
      }),
      catchError(error => {
        console.error('Get user info error:', error);
        // If API call fails, try to get from localStorage
        const userStr = localStorage.getItem('user_info');
        if (userStr) {
          return of(JSON.parse(userStr) as User);
        }
        return of(null);
      })
    );
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/user/get-info`);
  }
}