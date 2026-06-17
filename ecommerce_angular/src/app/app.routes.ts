import { Routes } from '@angular/router';
import { ProductosPage } from './pages/productos/productos';
import { ProductoDetallePage } from './pages/producto-detalle/producto-detalle';
import { LoginPage } from './pages/login/login';
import { RegistroPage } from './pages/registro/registro';
import { ConfirmarEmailPage } from './pages/confirmar-email/confirmar-email';

export const routes: Routes = [
  {path: '', redirectTo: 'productos', pathMatch: 'full'},
  {path: 'productos', component: ProductosPage},
  {path: 'productos/:id', component: ProductoDetallePage},
  {path: 'login', component: LoginPage},
  {path: 'registro', component: RegistroPage},
  {path: 'confirmar-email', component: ConfirmarEmailPage},
];
