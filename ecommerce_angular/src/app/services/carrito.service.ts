import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductoService } from './producto.service';
import { Carrito, CarritoItemVista } from '../models/carrito.model';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CarritoService {
  private readonly http = inject(HttpClient);
  private readonly productoService = inject(ProductoService);
  private readonly base = 'http://localhost:8080/api/carrito';

  items = signal<CarritoItemVista[]>([]);
  total = computed(()=>
    this.items().reduce((acc, item) => acc + item.subtotal, 0)
  );
  cantidadItems = computed(()=>
    this.items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  // GET /api/carrito — carga el carrito y enriquece cada item con datos del producto
  cargarCarrito(){
    this.http.get<Carrito>(this.base).pipe(
      switchMap(carrito => {
        if (carrito.items.length === 0) return of([]);

        const peticiones =  carrito.items.map(item =>
          this.productoService.getProducto(item.productoId).pipe(
            map(producto =>({
              itemId: item.id,
              productoId: item.productoId,
              nombre: producto.nombre,
              precio: producto.precio,
              cantidad: item.cantidad,
              subtotal: producto.precio * item.cantidad,
            } as CarritoItemVista))
          )
        );
        return forkJoin(peticiones);
      })
    ).subscribe({
      next: itemVista => this.items.set(itemVista),
      error: ()=> this.items.set([]),
    });
  }

  // POST /api/carrito/agregar?productoId=x&cantidad=y
  agregar(productoId: number, cantidad: number): Observable<Carrito>{
    const params = new HttpParams()
      .set('productoId', productoId)
      .set('cantidad', cantidad);

    return this.http.post<Carrito>(`${this.base}/agregar`, null, {params});
  }

  // DELETE /api/carrito/:productoId
  removerItem(productoId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${productoId}`);
  }

  // DELETE /api/carrito
  vaciar(): Observable<void> {
    return this.http.delete<void>(`${this.base}`);
  }

  limpiarEstadoLocal() {
    this.items.set([]);
  }
}