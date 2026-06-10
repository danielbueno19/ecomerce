import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { ProductoList } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './productos.html',
})
export class ProductosPage implements OnInit {
  private readonly productoService = inject(ProductoService);

  // Signals: estado reactivo local del componente
  productos = signal<ProductoList[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  paginaActual = signal(0);
  totalPaginas = signal(0);

  ngOnInit() {
    this.cargarProductos(0);
  }

  cargarProductos(pagina: number) {
    this.cargando.set(true);
    this.error.set(null);

    this.productoService.getProductos(pagina).subscribe({
      next: (data) => {
        this.productos.set(data.content);
        this.paginaActual.set(data.number);
        this.totalPaginas.set(data.totalPages);
        this.cargando.set(false)
      },
      error: () => {
        this.error.set('No se pudo cargar los productos.')
        this.cargando.set(false);
      },
    });
  }

  cambiarPagina(pagina: number) {
    this.cargarProductos(pagina)
  }
}