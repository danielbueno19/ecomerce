import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly route = inject(Router);

  logout() {
    this.authService.logout();
    this.route.navigate(['/productos']);
  }
}