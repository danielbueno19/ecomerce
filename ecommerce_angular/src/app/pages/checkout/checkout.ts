import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { OrdenService } from '../../services/orden.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './checkout.html',
})
export class CheckoutPages {
  private readonly fb = inject(FormBuilder);
  private readonly ordenService = inject(OrdenService);
  private readonly carritoService = inject(CarritoService);
  private readonly route = inject(Router);

  error = signal<string | null>(null);
  cargando = signal(false);

  // Exponemos los computed del carrito para mostrar el resumen
  readonly items = this.carritoService.items;
  readonly total = this.carritoService.total;

  form = this.fb.group({
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const { direccion, telefono } = this.form.getRawValue();

    this.ordenService.crearOrden(direccion!, telefono!).subscribe({
      next: (orden) => {
        // Orden creada: el backend vacía el carrito automáticamente
        this.carritoService.limpiarEstadoLocal();

        // Redirigimos al historial pasando el id de la nueva orden como queryParam
        this.route.navigate(['/ordenes'], { queryParams: { nueva: orden.id } });
      },
      error: () => {
        this.error.set('No se pudo crear la orden. Verificá que el carrito no esté vacío.');
        this.cargando.set(false);
      },
    });
  }
  get direccion() {
    return this.form.controls.direccion;
  }
  get telefono() {
    return this.form.controls.telefono;
  }
}