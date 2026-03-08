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
    this.productoService.listarTodos().subscribe(productos => {
      this.totalProductos = productos.length;
      this.productosBajoStock = productos.filter(p => p.stockActual <= 3);
    });

    this.ventaService.listarTodas().subscribe(ventas => {
      const activas = ventas.filter(v => v.estado !== 'ANULADO');
      this.totalVentas = activas.length;

      const hoy = new Date().toDateString();
      this.ventasHoy = activas.filter(v =>
        new Date(v.createdAt).toDateString() === hoy
      ).length;

      const mesActual = new Date().getMonth();
      const ventasMes = activas.filter(v => new Date(v.createdAt).getMonth() === mesActual);
      this.ingresosMes = ventasMes.reduce((sum, v) => sum + Number(v.total), 0);
      this.ingresosTotales = activas.reduce((sum, v) => sum + Number(v.total), 0);

      this.ultimasVentas = [...activas].reverse().slice(0, 5);

      // Gráfico por mes
      const datos = this.meses.map((mes, i) => ({
        mes,
        total: 0,
        cantidad: 0
      }));
      activas.forEach(v => {
        const mes = new Date(v.createdAt).getMonth();
        datos[mes].total += Number(v.total);
        datos[mes].cantidad += 1;
      });
      this.ventasPorMes = datos;
      this.maxVentas = Math.max(...datos.map(d => d.total), 1);
    });

    this.clienteService.listarTodos().subscribe(clientes => {
      this.totalClientes = clientes.length;
    });
  }

  getBarHeight(total: number): number {
    return (total / this.maxVentas) * 100;
  }
}