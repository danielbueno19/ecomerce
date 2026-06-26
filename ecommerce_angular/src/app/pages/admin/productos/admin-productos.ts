import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto, ProductoList } from '../../../models/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-productos',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './admin-productos.html',
})
export class AdminProductosPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);

  editandoId = signal<number | null>(null);
  imagenSeleccionada: File | null = null;
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  guardando = signal(false);
  cargando = signal(true);
  productos = signal<ProductoList[]>([]);

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    cantidad: [0, [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit() {
    this.cargarProductos();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);

    const formData = new FormData();
    const productoBlob = new Blob([JSON.stringify(this.form.getRawValue())], {
      type: 'application/json',
    });
    formData.append('producto', productoBlob);
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    const id = this.editandoId();
    const operacion$ = id
      ? this.productoService.actualizarProducto(id, formData)
      : this.productoService.crearProducto(formData);

    operacion$.subscribe({
      next: () => {
        this.exito.set(id ? 'Producto actualizado' : 'Producto creado');
        this.cancelarEdicion();
        this.cargarProductos();
        this.guardando.set(false);
      },
      error: () => {
        this.error.set('Error al guardar el producto.');
        this.guardando.set(false);
      },
    });
  }

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imagenSeleccionada = input.files?.[0] ?? null;
  }

  cancelarEdicion() {
    this.editandoId.set(null);
    this.imagenSeleccionada = null;
    this.form.reset({ nombre: '', descripcion: '', precio: 0, cantidad: 0 });
    this.error.set(null);
  }

  editarProducto(productoId: number) {
    this.productoService.getProducto(productoId).subscribe({
      next: (prod: Producto) => {
        this.editandoId.set(productoId);
        this.form.setValue({
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precio: prod.precio,
          cantidad: prod.cantidad,
        });
      },
    });
  }

  cargarProductos() {
    this.productoService.getProductos(0, 100).subscribe({
      next: (data) => {
        this.productos.set(data.content);
        this.cargando.set(false);
      },
    });
  }

  eliminar(id: number) {
    if (!confirm('Desea eliminar el producto?')) return;
    this.productoService.eliminarProducto(id).subscribe({
      next: () => this.cargarProductos(),
    });
  }

  get nombre() {
    return this.form.controls.nombre;
  }
  get descripcion() {
    return this.form.controls.descripcion;
  }
  get precio() {
    return this.form.controls.precio;
  }
  get cantidad() {
    return this.form.controls.cantidad;
  }
}