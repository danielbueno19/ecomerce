import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly carritoService = inject(CarritoService);
  private readonly route = inject(Router);

  logout() {
    this.authService.logout();
    this.carritoService.limpiarEstadoLocal();
    this.route.navigate(['/productos']);
  }
}