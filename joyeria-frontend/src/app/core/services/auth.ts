import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

login(email: string, password: string, recordarme: boolean = false): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((response: any) => {
      const storage = recordarme ? localStorage : sessionStorage;
      storage.setItem('token', response.token);
      storage.setItem('usuario', JSON.stringify({
        id: response.id,
        nombre: response.nombre,
        email: response.email,
        rol: response.rol
      }));
      if (recordarme) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        localStorage.setItem('token_expiry', expiry.toISOString());
      }
    })
  );
}


logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('token_expiry');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  this.router.navigate(['/login']);
}
getUsuario(): any {
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
}


isLoggedIn(): boolean {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return false;
  const expiry = localStorage.getItem('token_expiry');
  if (expiry && new Date() > new Date(expiry)) {
    this.logout();
    return false;
  }
  return true;
}


  getRol(): string {
    return this.getUsuario()?.rol || '';
  }
}