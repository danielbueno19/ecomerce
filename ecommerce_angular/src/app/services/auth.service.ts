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

  // GET /api/auth/usuario/rol — requiere JWT en el header (lo pone el interceptor)
  obtenerRol(): Observable<string> {
    return this.http.get(`${this.base}/usuario/rol`, { responseType: 'text' });
  }

  // POST /api/auth/login — el backend devuelve el JWT como string plano
  login(datos: LoginRequest): Observable<string> {
    return this.http.post(this.base + '/login', datos, { responseType: 'text' }).pipe(
      tap((token) => {
        localStorage.setItem('token', token);
        // Decodificamos el payload del JWT para obtener el email
        // El rol se consulta en un paso separado (ver cargarRolYGuardarSesion)
        this.cargarRolYGuardarSesion();
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
    return this.usuarioActual()?.rol === 'ADMIN'
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

  // Consulta el rol al backend y guarda la sesión completa
  private cargarRolYGuardarSesion() {
    this.obtenerRol().subscribe((rol) => {
      const email = this.leerEmailDelToken();
      if (!email) return;

      const sesion: UsuarioSesion = {
        email,
        rol: rol as 'USER' | 'ADMIN',
      };
      localStorage.setItem('usuario', JSON.stringify(sesion));
      this.usuarioActual.set(sesion);
    });
  }

  private leerEmailDelToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null; // Spring Security guarda el email en "sub"
    } catch {
      return null;
    }
  }
}