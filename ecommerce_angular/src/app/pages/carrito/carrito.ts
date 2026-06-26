import { Component, inject, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoPage implements OnInit{
  readonly carritoService = inject(CarritoService);

  ngOnInit() {
    // Carga fresca del carrito al entrar a la página
    this.carritoService.cargarCarrito();
  }

  remover(productoId: number){
    this.carritoService.removerItem(productoId).subscribe({
      next: ()=> this.carritoService.cargarCarrito(),
    });
  }

  vaciar() {
    this.carritoService.vaciar().subscribe({
      next: ()=> this.carritoService.limpiarEstadoLocal(),
    })
  }
}