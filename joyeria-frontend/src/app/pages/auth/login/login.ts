import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    CheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  recordarme: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {
    const emailGuardado = localStorage.getItem('remember_email');
    if (emailGuardado) {
      this.email = emailGuardado;
      this.recordarme = true;
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa email y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password, this.recordarme).subscribe({
      next: () => {
        if (this.recordarme) {
          localStorage.setItem('remember_email', this.email);
        } else {
          localStorage.removeItem('remember_email');
        }
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}