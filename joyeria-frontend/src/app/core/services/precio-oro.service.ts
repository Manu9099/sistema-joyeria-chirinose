import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecioOroService {

  private apiUrl = '/api/precio-oro';

  constructor(private http: HttpClient) {}

  obtenerUltimo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimo`);
  }

  registrar(precioOro: any): Observable<any> {
    return this.http.post(this.apiUrl, precioOro);
  }

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}