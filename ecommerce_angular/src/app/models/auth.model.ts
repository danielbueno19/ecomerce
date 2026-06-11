// Espeja LogingRequest.java
export interface LoginRequest {
  email: string;
  password: string;
}

// Espeja el body que acepta POST /api/auth/registrar (entidad Usuario directa)
export interface RegistroRequest {
  email: string;
  password: string;
}

// Espeja ConfirmacionEmailRequest.java
export interface ConfirmacionEmailRequest {
  email: string;
  codigoConfirmacion: string
}

// Representa al usuario en sesión (lo que guardamos localmente tras login)
export interface UsuarioSesion {
  email: string;
  rol: 'USER' | 'ADMIN';
}