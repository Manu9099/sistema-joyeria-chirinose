import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const isAuthRequest =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/registro');

  // No enviar token en login/registro
  if (isAuthRequest) {
    return next(req).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError(error => {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('token_expiry');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};