import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// protege rutas que requieren estar autenticado (tener una sesión)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) return true;
  // Si no hay sesión, redirige a login y bloquea el acceso a la ruta
  return router.createUrlTree(['/login']);
}