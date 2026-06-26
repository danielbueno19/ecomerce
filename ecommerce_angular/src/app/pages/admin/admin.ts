import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './admin.css',
  template: `
    <div class="admin-layout">
      <nav class="admin-nav">
        <h2>Panel Admin</h2>
        <a routerLink="productos" routerLinkActive="activo">Productos</a>
        <a routerLink="ordenes" routerLinkActive="activo">Órdenes</a>
      </nav>
      <main class="admin-content">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminPage {}
