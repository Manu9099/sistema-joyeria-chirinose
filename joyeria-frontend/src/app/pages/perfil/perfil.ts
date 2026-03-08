import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {

  perfil: any = null;
  loadingPerfil: boolean = false;
  loadingPassword: boolean = false;
  editandoNombre: boolean = false;

  perfilForm: any = {
    nombre: ''
  };

  passwordForm: any = {
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (perfil) => {
        this.perfil = perfil;
        this.perfilForm.nombre = perfil.nombre;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el perfil' });
      }
    });
  }

  guardarPerfil(): void {
    if (!this.perfilForm.nombre) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre es requerido' });
      return;
    }

    this.loadingPerfil = true;
    this.usuarioService.actualizarPerfil({ nombre: this.perfilForm.nombre }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado' });
        this.perfil.nombre = this.perfilForm.nombre;
        this.editandoNombre = false;
        this.loadingPerfil = false;

        const usuario = this.authService.getUsuario();
        usuario.nombre = this.perfilForm.nombre;
        localStorage.setItem('usuario', JSON.stringify(usuario));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el perfil' });
        this.loadingPerfil = false;
      }
    });
  }

  cambiarPassword(): void {
    if (!this.passwordForm.passwordActual || !this.passwordForm.passwordNueva || !this.passwordForm.passwordConfirmar) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Completa todos los campos' });
      return;
    }

    if (this.passwordForm.passwordNueva !== this.passwordForm.passwordConfirmar) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Las contraseñas no coinciden' });
      return;
    }

    if (this.passwordForm.passwordNueva.length < 6) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    this.loadingPassword = true;
    this.usuarioService.cambiarPassword(this.passwordForm).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: '✅ Éxito', detail: 'Contraseña actualizada correctamente' });
        this.passwordForm = { passwordActual: '', passwordNueva: '', passwordConfirmar: '' };
        this.loadingPassword = false;
      },
      error: (err) => {
        const mensaje = err.error?.error || 'No se pudo cambiar la contraseña';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
        this.loadingPassword = false;
      }
    });
  }

  getIniciales(): string {
    if (!this.perfil?.nombre) return '?';
    return this.perfil.nombre.split(' ')
      .map((n: string) => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getRolColor(): string {
    return this.perfil?.rol === 'ADMIN' ? '#b48c32' : '#63b3ed';
  }
}