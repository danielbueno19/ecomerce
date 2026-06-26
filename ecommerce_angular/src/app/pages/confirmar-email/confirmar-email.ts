import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-email',
  imports: [ReactiveFormsModule],
  templateUrl: './confirmar-email.html',
  styleUrl: '../auth.css',
})
export class ConfirmarEmailPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  error = signal<string | null>(null);
  cargando = signal(false);

  // El email llega como queryParam desde la página de registro: /confirmar-email?email=...
  emailPreLLenado = this.route.snapshot.queryParams['email'] ?? '';

  form = this.fb.group({
    email: [this.emailPreLLenado, [Validators.required, Validators.email]],
    codigoConfirmacion: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const {email, codigoConfirmacion} = this.form.getRawValue();

    this.authService.confirmarEmail({email: email!, codigoConfirmacion: codigoConfirmacion!})
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => {
          this.error.set("Error de código o email incorrecto");
          this.cargando.set(false);
        },
      });
  }
  get emailCtr() {return this.form.controls.email};
  get codigo() {return this.form.controls.codigoConfirmacion}
}