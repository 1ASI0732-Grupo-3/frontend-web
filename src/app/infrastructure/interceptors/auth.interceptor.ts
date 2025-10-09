import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Buscar el token en las claves correctas
  const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');

  console.log('🔒 AuthInterceptor - Token encontrado:', token ? 'Sí' : 'No');
  console.log('🌐 Request URL:', req.url);

  // Clone the request and add the authorization header if token exists
  let authReq = req;

  if (token) {
    const headers: any = {
      Authorization: `Bearer ${token}`
    };

    // Only set Content-Type for non-FormData requests
    // FormData requests need the browser to set Content-Type automatically with boundary
    if (!(req.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    authReq = req.clone({
      setHeaders: headers
    });
  }

  console.log('📤 Request headers:', authReq.headers.keys().map(key => `${key}: ${authReq.headers.get(key)}`));

  return next(authReq).pipe(
    catchError(error => {
      console.error('🚨 HTTP Error:', error.status, error.message);

      // Handle 401 errors - redirect to login or refresh token
      if (error.status === 401) {
        console.warn('❌ Authentication failed - removing token and redirecting');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_info');

        // Redirect to login page if not already there
        const router = inject(Router);
        if (!req.url.includes('/auth/')) {
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
