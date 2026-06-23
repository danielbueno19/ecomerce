import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/comentarios';

  // GET /api/comentarios/producto/:id — público
  obtenerPorProducto(productoId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.base}/producto/${productoId}`);
  }

  // POST /api/comentarios/producto/:id — requiere autenticación
  agregar(productoId: number, comentario: Omit<Comentario, 'id' | 'usuarioId'>): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.base}/producto/${productoId}`, comentario);
  }
}