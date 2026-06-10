import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);

  producto = signal<Producto | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null)

  ngOnInit(): void {
    // ActivatedRoute.snapshot.params lee el :id de la URL
    const id = Number(this.route.snapshot.params['id']);
    this.productoService.getProducto(id).subscribe({
      next: (data) => {
        this.producto.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Producto no encontrado');
        this.cargando.set(false)
      },
    });
  }
}