import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);
  private readonly carritoService = inject(CarritoService);
  readonly authService = inject(AuthService);

  producto = signal<Producto | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null)
  cantidad = signal(1);
  agregado = signal(false)

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

  agregarAlCarrito() {
    const prod = this.producto();
    if (!prod) return;

    this.carritoService.agregar(prod.id, this.cantidad()).subscribe({
      next: () => {
        this.carritoService.cargarCarrito();
        this.agregado.set(true);
        // Resetea el mensaje de confirmación tras 2 segundos
        setTimeout(()=> this.agregado.set(false), 2000)
      },
    });
  }

  incrementar() {
    const prod = this.producto();
    if (prod && this.cantidad() < prod.cantidad) this.cantidad.update(cant => cant + 1);
  }

  decrementar() {
    const prod = this.producto();
    if (this.cantidad() > 1) this.cantidad.update(cant => cant - 1);
  }
}