import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto';
import { VentaService } from '../../core/services/venta';
import { ClienteService } from '../../core/services/cliente';
import { AuthService } from '../../core/services/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  today = new Date();
  totalProductos = 0;
  totalVentas = 0;
  totalClientes = 0;
  ventasHoy = 0;
  ingresosMes = 0;
  ingresosTotales = 0;
  ultimasVentas: any[] = [];
  productosBajoStock: any[] = [];
  ventasPorMes: any[] = [];
  maxVentas = 1;

  meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
Math = Math;
  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

cargarEstadisticas(): void {
  this.productoService.listarTodos().subscribe({
    next: (productos) => {
      const listaProductos = Array.isArray(productos) ? productos : [];
      this.totalProductos = listaProductos.length;
      this.productosBajoStock = listaProductos.filter(p => (p?.stockActual ?? 0) <= 3);
    },
    error: (err) => {
      console.error('Error cargando productos:', err);
      this.totalProductos = 0;
      this.productosBajoStock = [];
    }
  });

  this.ventaService.listarTodas().subscribe({
    next: (ventas) => {
      const listaVentas = Array.isArray(ventas) ? ventas : [];
      const activas = listaVentas.filter(v => v?.estado !== 'ANULADO');

      this.totalVentas = activas.length;

      const hoy = new Date().toDateString();
      this.ventasHoy = activas.filter(v =>
        v?.createdAt && new Date(v.createdAt).toDateString() === hoy
      ).length;

      const mesActual = new Date().getMonth();
      const ventasMes = activas.filter(v =>
        v?.createdAt && new Date(v.createdAt).getMonth() === mesActual
      );

      this.ingresosMes = ventasMes.reduce((sum, v) => sum + Number(v?.total ?? 0), 0);
      this.ingresosTotales = activas.reduce((sum, v) => sum + Number(v?.total ?? 0), 0);

      this.ultimasVentas = [...activas].reverse().slice(0, 5);

      const datos = this.meses.map((mes) => ({
        mes,
        total: 0,
        cantidad: 0
      }));

      activas.forEach(v => {
        if (v?.createdAt) {
          const mes = new Date(v.createdAt).getMonth();
          if (mes >= 0 && mes < 12) {
            datos[mes].total += Number(v?.total ?? 0);
            datos[mes].cantidad += 1;
          }
        }
      });

      this.ventasPorMes = datos;
      this.maxVentas = Math.max(...datos.map(d => d.total), 1);
    },
    error: (err) => {
      console.error('Error cargando ventas:', err);
      this.totalVentas = 0;
      this.ventasHoy = 0;
      this.ingresosMes = 0;
      this.ingresosTotales = 0;
      this.ultimasVentas = [];
      this.ventasPorMes = [];
      this.maxVentas = 1;
    }
  });

  this.clienteService.listarTodos().subscribe({
    next: (clientes) => {
      const listaClientes = Array.isArray(clientes) ? clientes : [];
      this.totalClientes = listaClientes.length;
    },
    error: (err) => {
      console.error('Error cargando clientes:', err);
      this.totalClientes = 0;
    }
  });
}

getBarHeight(total: number): number {
  if (!this.maxVentas || this.maxVentas <= 0) return 0;
  return (total / this.maxVentas) * 100;
}
}