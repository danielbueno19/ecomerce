import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

// protege rutas que requieren rol ADMIN
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const route = inject(Router);

  if (authService.esAdmin()) return true;
  // Autenticado pero sin rol ADMIN → vuelve al catálogo
  if (authService.estaAutenticado()) return route.createUrlTree(['/productos']);

  return route.createUrlTree(['/login']);
}