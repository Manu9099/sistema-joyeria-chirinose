import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'https://inventario-backend-0lj9.onrender.com/api/productos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }

  crear(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  actualizar(id: string, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ NUEVO: subir foto
  subirFoto(productoId: string, file: File): Observable<{ fotoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    // ⚠️ NO pongas Content-Type manual. Angular lo pone con boundary.
    return this.http.post<{ fotoUrl: string }>(`${this.apiUrl}/${productoId}/foto`, formData);
  }

  // ✅ NUEVO: borrar foto
  eliminarFoto(productoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productoId}/foto`);
  }

getFotoUrl(fotoUrl: string | null | undefined, t?: string | number): string {
  if (!fotoUrl) return '';

  const baseUrl = 'https://inventario-backend-0lj9.onrender.com';
  const path = fotoUrl.startsWith('http')
    ? fotoUrl
    : `${baseUrl}${fotoUrl.startsWith('/') ? '' : '/'}${fotoUrl}`;

  return t !== undefined && t !== null ? `${path}?t=${t}` : path;
}
}