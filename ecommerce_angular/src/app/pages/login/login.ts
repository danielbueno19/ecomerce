import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../auth.css',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  error = signal<string | null>(null);
  cargando = signal(false)

  // FormBuilder.group() define los controles y sus validaciones
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    // Marca todos los campos como "touched" para mostrar errores si el usuario
    // hace submit sin completar el formulario
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.login(this.form.getRawValue() as {email: string; password: string}).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: ()=> {
        this.error.set('Email o contraseña incorrectos.');
        this.cargando.set(false);
      }
    })
  }

  // Helpers para acceder a los controles en el template sin repetir this.form.get(...)
  get email() {return this.form.controls.email;}
  get password() { return this.form.controls.password;}
}