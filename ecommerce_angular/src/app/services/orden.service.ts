import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EstadoOrden, Orden } from '../models/orden.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/ordenes';

  // POST /api/ordenes?direccion=x&telefono=y — crea orden desde el carrito activo
  crearOrden(direccion: string, telefono: string): Observable<Orden> {
    const params = new HttpParams().set('direccion', direccion).set('telefono', telefono);

    return this.http.post<Orden>(`${this.base}`, null, { params });
  }

  // GET /api/ordenes/usuario — órdenes del usuario autenticado
  obtenerMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.base}/usuario`);
  }

  // GET /api/ordenes — todas las órdenes (solo ADMIN)
  obtenerTodasOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.base}`);
  }

  // PUT /api/ordenes/:id/estado?estado=X — (solo ADMIN)
  actualizarEstado(ordenId: number, estado: EstadoOrden): Observable<Orden> {
    const params = new HttpParams().set('estado', estado);
    return this.http.put<Orden>(`${this.base}/${ordenId}/estado`, null, {params});
  }
}