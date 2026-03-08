import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../core/services/proveedor';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proveedores',
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
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class ProveedoresComponent implements OnInit {

  proveedores: any[] = [];
  proveedoresFiltrados: any[] = [];
  busqueda: string = '';
  dialogVisible: boolean = false;
  editando: boolean = false;
  loading: boolean = false;

  proveedorForm: any = {
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: ''
  };

  constructor(
    private proveedorService: ProveedorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.listarTodos().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.proveedoresFiltrados = proveedores;
    });
  }

  buscar(): void {
    this.proveedoresFiltrados = this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      p.contacto?.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirDialogNuevo(): void {
    this.editando = false;
    this.proveedorForm = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };
    this.dialogVisible = true;
  }

  abrirDialogEditar(proveedor: any): void {
    this.editando = true;
    this.proveedorForm = { ...proveedor };
    this.dialogVisible = true;
  }

  guardar(): void {
    if (!this.proveedorForm.nombre) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre es requerido' });
      return;
    }
    this.loading = true;
    if (this.editando) {
      this.proveedorService.actualizar(this.proveedorForm.id, this.proveedorForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado' });
          this.dialogVisible = false;
          this.cargarProveedores();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
          this.loading = false;
        }
      });
    } else {
      this.proveedorService.crear(this.proveedorForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado' });
          this.dialogVisible = false;
          this.cargarProveedores();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
          this.loading = false;
        }
      });
    }
  }

  eliminar(id: string): void {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedorService.eliminar(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado' });
          this.cargarProveedores();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
        }
      });
    }
  }
}