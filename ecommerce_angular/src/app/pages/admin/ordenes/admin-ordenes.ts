import { Component, inject, OnInit, signal } from '@angular/core';
import { OrdenService } from '../../../services/orden.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoOrden, Orden } from '../../../models/orden.model';

@Component({
  selector: 'app-admin-ordenes',
  imports: [DecimalPipe, DatePipe, FormsModule],
  templateUrl: './admin-ordenes.html',
  styleUrl: '../admin.css',
})
export class AdminOrdenesPage implements OnInit {
  private readonly ordenService = inject(OrdenService);
  readonly estados: EstadoOrden[] = ['PREPARANDO', 'ENTREGANDO', 'ENTREGADO', 'CANCELADO'];

  ordenes = signal<Orden[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.ordenService.obtenerTodasOrdenes().subscribe({
      next: (data) => {
        this.ordenes.set(data);
        this.cargando.set(false);
      },
    });
  }

  cambiarEstado(orden: Orden, nuevoEstado: EstadoOrden): void {
    this.ordenService.actualizarEstado(orden.id, nuevoEstado).subscribe({
      next: (ordenActualizada) => {
        // Actualiza solo la orden afectada en el signal sin recargar todo
        this.ordenes.update((lista) =>
          lista.map((o) => (o.id === ordenActualizada.id ? ordenActualizada : o)),
        );
      },
    });
  }

  calcularTotal(orden: Orden): number {
    return orden.ordenItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }
}