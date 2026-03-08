import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = '/api/ventas';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(venta: any): Observable<any> {
    return this.http.post(this.apiUrl, venta);
  }

  anular(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/anular`, {});
  }

  descargarBoleta(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/boleta`, { responseType: 'blob' });
  }
}