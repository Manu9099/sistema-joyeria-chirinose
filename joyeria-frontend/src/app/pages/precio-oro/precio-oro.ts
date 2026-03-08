import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrecioOroService } from '../../core/services/precio-oro.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-precio-oro',
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
  templateUrl: './precio-oro.html',
  styleUrl: './precio-oro.css'
})
export class PrecioOroComponent implements OnInit {

  precioActual: any = null;
  historial: any[] = [];
  dialogVisible: boolean = false;
  loading: boolean = false;

  precioForm: any = {
    valorPorGramo: null
  };

  // Para el gráfico
  maxPrecio: number = 1;

  constructor(
    private precioOroService: PrecioOroService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.precioOroService.obtenerUltimo().subscribe(precio => {
      this.precioActual = precio;
    });

    this.precioOroService.listarTodos().subscribe(historial => {
      this.historial = historial.reverse().slice(0, 20);
      this.maxPrecio = Math.max(...this.historial.map(p => Number(p.valorPorGramo)), 1);
    });
  }

  abrirDialog(): void {
    this.precioForm = { valorPorGramo: this.precioActual?.valorPorGramo || null };
    this.dialogVisible = true;
  }

  guardar(): void {
    if (!this.precioForm.valorPorGramo || this.precioForm.valorPorGramo <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Ingresa un precio válido' });
      return;
    }

    this.loading = true;
    this.precioOroService.registrar({ valorPorGramo: this.precioForm.valorPorGramo }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Precio del oro actualizado' });
        this.dialogVisible = false;
        this.cargarDatos();
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el precio' });
        this.loading = false;
      }
    });
  }

  getVariacion(): number {
    if (this.historial.length < 2) return 0;
    const actual = Number(this.historial[0].valorPorGramo);
    const anterior = Number(this.historial[1].valorPorGramo);
    return ((actual - anterior) / anterior) * 100;
  }

  getBarHeight(valor: number): number {
    return (Number(valor) / this.maxPrecio) * 100;
  }

  getPrecioQuilates(quilates: number): number {
    if (!this.precioActual) return 0;
    return Number(this.precioActual.valorPorGramo) * (quilates / 24);
  }
}