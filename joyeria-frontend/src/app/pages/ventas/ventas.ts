import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../core/services/venta';
import { ProductoService } from '../../core/services/producto';
import { ClienteService } from '../../core/services/cliente';
import { AuthService } from '../../core/services/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
   SelectModule
  ],
  providers: [MessageService],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {

  ventas: any[] = [];
  clientes: any[] = [];
  productos: any[] = [];
  dialogVisible: boolean = false;
  loading: boolean = false;

  ventaForm: any = {
    clienteId: null,
    detalles: [],
    pagos: []
  };

  detalleNuevo: any = {
    productoId: null,
    cantidad: 1
  };

  pagoNuevo: any = {
    monto: 0,
    metodoPago: 'EFECTIVO'
  };

  metodosPago = [
    { label: 'Efectivo', value: 'EFECTIVO' },
    { label: 'Tarjeta', value: 'TARJETA' },
    { label: 'Transferencia', value: 'TRANSFERENCIA' }
  ];

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ventaService.listarTodas().subscribe(v => this.ventas = v);
    this.clienteService.listarTodos().subscribe(c => this.clientes = c);
    this.productoService.listarActivos().subscribe(p => this.productos = p);
  }

  abrirDialogNuevo(): void {
    this.ventaForm = { clienteId: null, detalles: [], pagos: [] };
    this.detalleNuevo = { productoId: null, cantidad: 1 };
    this.pagoNuevo = { monto: 0, metodoPago: 'EFECTIVO' };
    this.dialogVisible = true;
  }

  agregarDetalle(): void {
    if (!this.detalleNuevo.productoId || this.detalleNuevo.cantidad < 1) return;
    const producto = this.productos.find(p => p.id === this.detalleNuevo.productoId);
    if (!producto) return;

    const existe = this.ventaForm.detalles.find((d: any) => d.productoId === producto.id);
    if (existe) {
      existe.cantidad += this.detalleNuevo.cantidad;
    } else {
      this.ventaForm.detalles.push({
        productoId: producto.id,
        descripcion: producto.descripcion,
        precioVenta: producto.precioVenta,
        cantidad: this.detalleNuevo.cantidad,
        subtotal: producto.precioVenta * this.detalleNuevo.cantidad
      });
    }
    this.detalleNuevo = { productoId: null, cantidad: 1 };
    this.actualizarPago();
  }

  eliminarDetalle(index: number): void {
    this.ventaForm.detalles.splice(index, 1);
    this.actualizarPago();
  }

  actualizarPago(): void {
    this.pagoNuevo.monto = this.getTotal();
  }

  getTotal(): number {
    return this.ventaForm.detalles.reduce((sum: number, d: any) =>
      sum + (d.precioVenta * d.cantidad), 0);
  }

guardar(): void {
    if (!this.ventaForm.clienteId) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Selecciona un cliente' });
      return;
    }
    if (this.ventaForm.detalles.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Agrega al menos un producto' });
      return;
    }

    this.loading = true;
    const usuario = this.authService.getUsuario();

    const venta = {
      cliente: { id: this.ventaForm.clienteId },
      usuario: { id: usuario.id },
      detalles: this.ventaForm.detalles.map((d: any) => ({
        producto: { id: d.productoId },
        cantidad: d.cantidad
      })),
      pagos: [{
        monto: this.pagoNuevo.monto,
        metodoPago: this.pagoNuevo.metodoPago
      }]
    };

    console.log('JSON enviado:', JSON.stringify(venta));

    this.ventaService.crear(venta).subscribe({
      next: (res) => {
        console.log('Respuesta:', res);
        this.messageService.add({ severity: 'success', summary: '✅ Venta realizada', detail: 'La venta fue registrada exitosamente' });
        this.dialogVisible = false;
        this.cargarDatos();
        this.loading = false;
      },
      error: (err) => {
        console.log('Error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la venta' });
        this.loading = false;
      }
    });
  }

  descargarBoleta(id: string): void {
    this.ventaService.descargarBoleta(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleta-${id.substring(0, 8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  anular(id: string): void {
    if (confirm('¿Estás seguro de anular esta venta?')) {
      this.ventaService.anular(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Venta anulada' });
          this.cargarDatos();
        }
      });
    }
  }

  getClienteNombre(clienteId: string): string {
    return this.clientes.find(c => c.id === clienteId)?.nombre || '-';
  }
}
