import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const router = inject(Router);

  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
        // ✅ Sin Content-Type — el navegador lo pone automático según el tipo de petición
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
