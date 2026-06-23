import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden.model';

@Component({
  selector: 'app-ordenes',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './ordenes.html',
})
export class OrdenesPage implements OnInit {
  private readonly ordenService = inject(OrdenService);
  private readonly route = inject(ActivatedRoute);

  ordenes = signal<Orden[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  // Recibe el id de orden recién creada para destacarla visualmente
  nuevaOrdenId = signal<number | null>(null);

  ngOnInit() {
    const nueva = this.route.snapshot.queryParams['nueva'];
    if (nueva) this.nuevaOrdenId.set(Number(nueva));

    this.ordenService.obtenerMisOrdenes().subscribe({
      next: data => {
        this.ordenes.set(data.sort((a,b) =>
          new Date(b.fechaCreacion).getDate() - new Date(a.fechaCreacion).getDate()));
        this.cargando.set(false);
      },
      error: ()=>{
        this.error.set('No se pudieron cargar las órdenes.');
        this.cargando.set(false);
      },
    })
  }
  calcularTotal(orden: Orden): number{
    return orden.ordenItems.reduce((acc, item)=> acc + item.precio * item.cantidad, 0);
  }
}