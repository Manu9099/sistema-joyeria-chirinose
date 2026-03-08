import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  busqueda: string = '';
  dialogVisible: boolean = false;
  editando: boolean = false;
  loading: boolean = false;

  usuarioForm: any = {
    nombre: '',
    email: '',
    password: '',
    rol: 'USUARIO'
  };

  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuario', value: 'USUARIO' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
      }
    });
  }

  buscar(): void {
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirDialogNuevo(): void {
    this.editando = false;
    this.usuarioForm = { nombre: '', email: '', password: '', rol: 'USUARIO' };
    this.dialogVisible = true;
  }

  abrirDialogEditar(usuario: any): void {
    this.editando = true;
    this.usuarioForm = { ...usuario, password: '' };
    this.dialogVisible = true;
  }

 guardar(): void {
    if (!this.usuarioForm.nombre || !this.usuarioForm.email) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Nombre y email son requeridos' });
      return;
    }
    if (!this.editando && !this.usuarioForm.password) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'La contraseña es requerida' });
      return;
    }
    if (!this.editando && this.usuarioForm.password.length < 6) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    this.loading = true;

    if (this.editando) {
      const datos: any = {
        nombre: this.usuarioForm.nombre,
        rol: this.usuarioForm.rol
      };
      if (this.usuarioForm.password) {
        datos.password = this.usuarioForm.password;
      }
      this.usuarioService.actualizar(this.usuarioForm.id, datos).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
          this.dialogVisible = false;
          this.cargarUsuarios();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
          this.loading = false;
        }
      });
    } else {
      this.usuarioService.crear(this.usuarioForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado exitosamente' });
          this.dialogVisible = false;
          this.cargarUsuarios();
          this.loading = false;
        },
        error: (err) => {
          const mensaje = err.error?.message || 'No se pudo crear el usuario';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
          this.loading = false;
        }
      });
    }
  }

  toggleActivo(usuario: any): void {
    this.usuarioService.actualizar(usuario.id, { activo: !usuario.activo }).subscribe({
      next: () => {
        usuario.activo = !usuario.activo;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Usuario ${usuario.activo ? 'activado' : 'desactivado'}`
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado' });
      }
    });
  }
}