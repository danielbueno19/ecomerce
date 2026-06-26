import { Routes } from '@angular/router';
import { ProductosPage } from './pages/productos/productos';
import { ProductoDetallePage } from './pages/producto-detalle/producto-detalle';
import { LoginPage } from './pages/login/login';
import { RegistroPage } from './pages/registro/registro';
import { ConfirmarEmailPage } from './pages/confirmar-email/confirmar-email';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  // Rutas públicas
  { path: 'productos', component: ProductosPage },
  { path: 'productos/:id', component: ProductoDetallePage },
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegistroPage },
  { path: 'confirmar-email', component: ConfirmarEmailPage },

  // Rutas protegidas - requieren sesión activa (estar logueado)
  {
    path: 'carrito',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.CarritoPage),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.CheckoutPages),
  },
  {
    path: 'ordenes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ordenes/ordenes').then((m) => m.OrdenesPage),
  },

  // Rutas admin — requieren rol ADMIN
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminPage),
    // children: rutas hijas que se renderizan dentro del <router-outlet> de AdminPage
    children: [
      {path:'productos', loadComponent: () => import('./pages/admin/productos/admin-productos')
          .then(m => m.AdminProductosPage)},
      {path:'ordenes', loadComponent: ()=> import('./pages/admin/ordenes/admin-ordenes')
          .then(m=> m.AdminOrdenesPage)},
    ]
  },
];
