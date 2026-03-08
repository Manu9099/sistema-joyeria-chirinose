import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente'
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-clientes',
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
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  busqueda: string = '';
  dialogVisible: boolean = false;
  editando: boolean = false;
  loading: boolean = false;

  clienteForm: any = {
    nombre: '',
    documento: '',
    telefono: '',
    email: ''
  };

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listarTodos().subscribe(clientes => {
      this.clientes = clientes;
      this.clientesFiltrados = clientes;
    });
  }

  buscar(): void {
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      c.documento?.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirDialogNuevo(): void {
    this.editando = false;
    this.clienteForm = { nombre: '', documento: '', telefono: '', email: '' };
    this.dialogVisible = true;
  }

  abrirDialogEditar(cliente: any): void {
    this.editando = true;
    this.clienteForm = { ...cliente };
    this.dialogVisible = true;
  }

  guardar(): void {

       if (!this.clienteForm.nombre) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre es requerido' });
      return;
    }
    if (this.clienteForm.documento && this.clienteForm.documento.length !== 8) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El DNI debe tener exactamente 8 dígitos' });
      return;
    }
    if (this.clienteForm.telefono && this.clienteForm.telefono.length !== 9) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El teléfono debe tener exactamente 9 dígitos' });
      return;
    }
    if (this.clienteForm.documento && !/^\d{8}$/.test(this.clienteForm.documento)) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El DNI solo debe contener números' });
      return;
    }
    if (this.clienteForm.telefono && !/^\d{9}$/.test(this.clienteForm.telefono)) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El teléfono solo debe contener números' });
      return;
    }

    this.loading = true;
    if (this.editando) {
      this.clienteService.actualizar(this.clienteForm.id, this.clienteForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado' });
          this.dialogVisible = false;
          this.cargarClientes();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
          this.loading = false;
        }
      });
    } else {
      this.clienteService.crear(this.clienteForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado' });
          this.dialogVisible = false;
          this.cargarClientes();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
          this.loading = false;
        }
      });
    }
  }
}