import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: '../auth.css',
})
export class RegistroPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  error = signal<string | null>(null);
  cargando = signal(false);

  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // "confirmar" solo existe en el frontend para validación cruzada
      confirmar: ['', Validators.required],
    },
    // Validador a nivel de grupo: compara dos controles entre sí
    { validators: passwordsIguales },
  );

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.registrar({ email: email!, password: password! }).subscribe({
      // Tras registro exitoso, redirigimos a confirmar email
      next: () => this.router.navigate(['/confirmar-email'], { queryParams: { email } }),
      error: (err) => {
        // El backend devuelve 409/500 si el email ya existe
        this.error.set(err.status === 500 ? 'El email ya existe' : 'Error al registrarse.');
        this.cargando.set(false);
      },
    });
  }

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirmar() {
    return this.form.controls.confirmar;
  }
}

function passwordsIguales(group: import('@angular/forms').AbstractControl) {
  const pass = group.get('password')?.value;
  const confirmar = group.get('confirmar')?.value;
  return pass === confirmar ? null: {noCoinciden: true};
}