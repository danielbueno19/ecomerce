import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ConfirmacionEmailRequest,
  LoginRequest,
  RegistroRequest,
  UsuarioSesion,
} from '../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/auth';
  // Signal global: cualquier componente puede leer el usuario actual
  // Se inicializa desde localStorage para persistir la sesión al recargar
  usuarioActual = signal<UsuarioSesion | null>(this.cargarSesionGuardada());

  // POST /api/auth/login — el backend devuelve el JWT como string plano
  login(datos: LoginRequest): Observable<string> {
    return this.http.post(this.base + '/login', datos, { responseType: 'text' }).pipe(
      tap((token) => {
        localStorage.setItem('token', token);
        // Decodificamos el payload del JWT para obtener el email
        // El rol se consulta en un paso separado (ver cargarRolYGuardarSesion)
        this.guardarSesionDesdeToken();
      }),
    );
  }

  // POST /api/auth/registar (typo en el backend, lo respetamos)
  registrar(datos: RegistroRequest): Observable<unknown> {
    return this.http.post(`${this.base}/registrar`, datos);
  }

  // POST /api/auth/confirmar-email
  confirmarEmail(datos: ConfirmacionEmailRequest): Observable<unknown> {
    return this.http.post(`${this.base}/confirmar-email`, datos, {
      responseType: 'text',
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioActual.set(null);
  }

  estaAutenticado() {
    return this.usuarioActual() !== null;
  }

  esAdmin() {
    return this.usuarioActual()?.rol === 'ADMIN';
  }

  // Restaura la sesión desde localStorage al iniciar la app
  private cargarSesionGuardada(): UsuarioSesion | null {
    const guardado = localStorage.getItem('usuario');
    if (!guardado) return null;
    try {
      return JSON.parse(guardado) as UsuarioSesion;
    } catch {
      return null;
    }
  }

  // Lee email y rol del payload JWT y guarda la sesión localmente
  private guardarSesionDesdeToken() {
    const payload = this.leerPayLoad();

    if (!payload) return;

    const email = String(payload['sub'] ?? '');
    // El backend guarda "ROLE_USER" o "ROLE_ADMIN" en el claim "rol"
    const rol = String(payload['rol'] ?? '').replace('ROLE_','') as 'USER' | 'ADMIN';

    if (!email || !rol) return;

    const session: UsuarioSesion = {email, rol};
    localStorage.setItem('usuario', JSON.stringify(session));
    this.usuarioActual.set(session);
  }

  private leerPayLoad(): Record<string, unknown> | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}