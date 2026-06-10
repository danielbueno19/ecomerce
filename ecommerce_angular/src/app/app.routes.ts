import { Routes } from '@angular/router';
import { ProductosPage } from './pages/productos/productos';
import { ProductoDetallePage } from './pages/producto-detalle/producto-detalle';

export const routes: Routes = [
  {path: '', redirectTo: 'productos', pathMatch: 'full'},
  {path: 'productos', component: ProductosPage},
  {path: 'productos/:id', component: ProductoDetallePage}
];
