import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

// cliente.ts
private apiUrl = 'https://inventario-backend-0lj9.onrender.com/api/clientes';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crear(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  actualizar(id: string, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }
}