import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, Producto, ProductoList } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/productos';

  // GET /api/productos?page=0&size=10
  getProductos(page = 0, size = 10): Observable<Page<ProductoList>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<ProductoList>>(this.base, { params });
  }

  // GET /api/productos/:id
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  // PUT /api/productos/:id — multipart/form-data (solo ADMI
  actualizarProducto(id: number, formData: FormData): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, formData);
  }

  // POST /api/productos — multipart/form-data (solo ADMIN)
  crearProducto(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(`${this.base}`, formData);
  }

  // DELETE /api/productos/:id (solo ADMIN)
  eliminarProducto(id: number): Observable<void>{
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}


