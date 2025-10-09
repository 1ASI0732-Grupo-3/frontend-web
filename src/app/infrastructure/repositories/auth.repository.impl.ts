import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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
import { environment } from '../../../enviroments/enviroment';
import { API_ENDPOINTS, createEndpointUrls } from '../../shared/config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl extends AuthRepository {
  private readonly baseUrl = environment.apiUrl;
  private detectedLoginEndpoint: string | null = null;
  private detectedRegisterEndpoint: string | null = null;

  constructor(private http: HttpClient) {
    super();
  }

  // Usar los endpoints específicos requeridos
  private detectLoginEndpoint(): Observable<string> {
    if (this.detectedLoginEndpoint) {
      return of(this.detectedLoginEndpoint);
    }

    console.log('🔍 Configurando endpoint de login específico...');
    
    // Usar el endpoint específico solicitado: /user/sign-in (sin duplicar /api/v1)
    const loginUrl = `${this.baseUrl}/user/sign-in`;
    console.log('📌 Usando endpoint específico:', loginUrl);
    this.detectedLoginEndpoint = loginUrl;
    
    return of(loginUrl);
  }

  // Usar el endpoint específico para registro
  private detectRegisterEndpoint(): Observable<string> {
    if (this.detectedRegisterEndpoint) {
      return of(this.detectedRegisterEndpoint);
    }

    console.log('🔍 Configurando endpoint de registro específico...');
    
    // Usar el endpoint específico solicitado: /user/sign-up (sin duplicar /api/v1)
    const registerUrl = `${this.baseUrl}/user/sign-up`;
    console.log('📌 Usando endpoint específico:', registerUrl);
    this.detectedRegisterEndpoint = registerUrl;
    
    return of(registerUrl);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    const signInRequest: SignInRequest = {
      userName: request.userName, // Cambiado de email a userName
      password: request.password
    };

    console.log('🔐 Iniciando proceso de login...');
    console.log('👤 Username:', request.userName);

    return this.detectLoginEndpoint().pipe(
      switchMap(loginUrl => {
        console.log('🎯 Usando endpoint:', loginUrl);
        console.log('📤 Enviando request:', signInRequest);
        
        return this.http.post<any>(loginUrl, signInRequest).pipe(
          map(response => {
            console.log('✅ Login response:', response);
            // The actual API response structure may vary, adjust as needed
            const authResponse: AuthResponse = {
              token: response.token || response.accessToken, // Adjust based on API
              user: {
                username: response.username || response.user?.username || request.userName,
                name: response.username || response.user?.username || request.userName, // For component compatibility
                email: response.email || response.user?.email || '',
                emailConfirmed: response.emailConfirmed || response.user?.emailConfirmed || false,
                id: response.id || response.user?.id || '1', // For component compatibility
                role: UserRole.VETERINARIAN, // Default role
                createdAt: new Date()
              }
            };
            return authResponse;
          }),
          catchError(error => {
            console.error('Login error full details:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('❌ Error en login:', error.error);

            let errorMessage = 'Login failed';
            if (error.status === 401) {
              errorMessage = 'Invalid username or password';
            } else if (error.status === 404) {
              errorMessage = 'Login endpoint not found - Backend structure may be different';
            } else if (error.status === 0) {
              errorMessage = 'Cannot connect to server - CORS or network issue';
            }

            return throwError(() => new Error(errorMessage));
          })
        );
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const signUpRequest: SignUpRequest = {
      username: request.username, // Ya está correcto
      email: request.email,
      password: request.password
    };

    console.log('📝 Iniciando proceso de registro...');
    console.log('👤 Usuario:', request.username);
    console.log('📧 Email:', request.email);
    
    return this.detectRegisterEndpoint().pipe(
      switchMap(registerUrl => {
        console.log('🎯 Usando endpoint:', registerUrl);
        console.log('📤 Enviando request:', signUpRequest);

        return this.http.post<any>(registerUrl, signUpRequest).pipe(
          map(response => {
            console.log('✅ Register response:', response);
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
            console.error('Registration error full details:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error response:', error.error);

            let errorMessage = 'Registration failed';
            if (error.status === 400) {
              errorMessage = error.error?.message || 'Invalid registration data';
            } else if (error.status === 409) {
              errorMessage = 'Email or username already exists';
            } else if (error.status === 0) {
              errorMessage = 'Cannot connect to server';
            }

            return throwError(() => new Error(errorMessage));
          })
        );
      })
    );
  }

  private tryAlternativeRegister(request: RegisterRequest): Observable<AuthResponse> {
    console.log('Trying alternative register endpoints...');
    
    const endpoints = [
      '/api/users/register',
      '/api/user/register', 
      '/users/register',
      '/user/register',
      '/auth/register',
      '/register'
    ];

    const requests = [
      {
        name: request.name,
        email: request.email,
        password: request.password
      },
      {
        fullName: request.name,
        email: request.email,
        password: request.password
      },
      {
        firstName: request.name,
        email: request.email,
        password: request.password
      }
    ];

    // For now, just try the first alternative
    const testRequest = requests[0];
    return this.http.post<any>(`${this.baseUrl}${endpoints[0]}`, testRequest).pipe(
      map(response => {
        const authResponse: AuthResponse = {
          token: response.token || response.accessToken || response.access_token,
          user: {
            username: response.username || response.name || testRequest.name,
            name: response.name || response.username || testRequest.name,
            email: response.email || testRequest.email,
            emailConfirmed: response.emailConfirmed || false,
            id: response.id || '1',
            role: UserRole.VETERINARIAN,
            createdAt: new Date()
          }
        };
        return authResponse;
      }),
      catchError(error => {
        console.error('Alternative register also failed:', error);
        return throwError(() => new Error('All register attempts failed'));
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
    return this.http.get<any>(`${this.baseUrl}/auth/profile`).pipe(
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
    return this.http.get<UserInfo>(`${this.baseUrl}/auth/profile`);
  }
}