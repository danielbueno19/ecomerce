import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../models/comentario.model';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);
  private readonly carritoService = inject(CarritoService);
  private readonly comentarioService = inject(ComentarioService);
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  producto = signal<Producto | null>(null);
  comentarios = signal<Comentario[]>([])
  cargando = signal(true);
  error = signal<string | null>(null)
  cantidad = signal(1);
  agregado = signal(false)
  enviandoComentario = signal(false);

  formComentario = this.fb.group({
    contenido: ['', Validators.required],
    puntuacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

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
    this.cargarComentarios(id);
  }

  cargarComentarios(productoId: number){
    this.comentarioService.obtenerPorProducto(productoId).subscribe({
      next: data => this.comentarios.set(data),
    })
  }

  enviarComentario(): void {
    if (this.formComentario.invalid) {
      this.formComentario.markAllAsTouched();
      return;
    }
    const id = this.producto()?.id;
    if (!id) return;

    this.enviandoComentario.set(true);
    const { contenido, puntuacion } = this.formComentario.getRawValue();

    this.comentarioService.agregar(id, { contenido: contenido!, puntuacion: puntuacion! }).subscribe({
      next: () => {
        this.formComentario.reset({ contenido: '', puntuacion: 5 });
        this.cargarComentarios(id);
        this.enviandoComentario.set(false);
      },
      error: () => this.enviandoComentario.set(false),
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

  get contenido() {return this.formComentario.controls.contenido}
  get puntuacion(){return this.formComentario.controls.puntuacion}
}