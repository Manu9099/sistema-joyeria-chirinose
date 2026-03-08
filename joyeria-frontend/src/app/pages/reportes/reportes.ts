import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../core/services/venta';
import { ProductoService } from '../../core/services/producto';
import { ClienteService } from '../../core/services/cliente';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit {

  ventas: any[] = [];
  productos: any[] = [];
  clientes: any[] = [];

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  ventasFiltradas: any[] = [];

  // Stats
  totalIngresos: number = 0;
  totalVentas: number = 0;
  ticketPromedio: number = 0;
  ventasHoy: number = 0;
  ventasMes: number = 0;

  // Rankings
  productosMasVendidos: any[] = [];
  clientesFrecuentes: any[] = [];

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaInicio = primerDiaMes.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ventaService.listarTodas().subscribe(ventas => {
      this.ventas = ventas.filter(v => v.estado !== 'ANULADO');
      this.clienteService.listarTodos().subscribe(clientes => {
        this.clientes = clientes;
        this.productoService.listarTodos().subscribe(productos => {
          this.productos = productos;
          this.aplicarFiltros();
        });
      });
    });
  }

  aplicarFiltros(): void {
    let filtradas = [...this.ventas];

    if (this.fechaInicio) {
      filtradas = filtradas.filter(v =>
        new Date(v.createdAt) >= new Date(this.fechaInicio)
      );
    }

    if (this.fechaFin) {
      const fin = new Date(this.fechaFin);
      fin.setHours(23, 59, 59);
      filtradas = filtradas.filter(v => new Date(v.createdAt) <= fin);
    }

    this.ventasFiltradas = filtradas;
    this.calcularStats();
    this.calcularRankings();
  }

  calcularStats(): void {
    this.totalVentas = this.ventasFiltradas.length;
    this.totalIngresos = this.ventasFiltradas.reduce((sum, v) => sum + Number(v.total), 0);
    this.ticketPromedio = this.totalVentas > 0 ? this.totalIngresos / this.totalVentas : 0;

    const hoy = new Date().toDateString();
    this.ventasHoy = this.ventas.filter(v =>
      new Date(v.createdAt).toDateString() === hoy
    ).length;

    const mes = new Date().getMonth();
    this.ventasMes = this.ventas.filter(v =>
      new Date(v.createdAt).getMonth() === mes
    ).length;
  }

  calcularRankings(): void {
    // Productos más vendidos
    const conteoProductos: any = {};
    this.ventasFiltradas.forEach(venta => {
      if (venta.detalles) {
        venta.detalles.forEach((d: any) => {
          const id = d.producto?.id;
          const nombre = d.producto?.descripcion || 'Desconocido';
          if (!conteoProductos[id]) {
            conteoProductos[id] = { nombre, cantidad: 0, ingresos: 0 };
          }
          conteoProductos[id].cantidad += d.cantidad;
          conteoProductos[id].ingresos += Number(d.subtotal);
        });
      }
    });

    this.productosMasVendidos = Object.values(conteoProductos)
      .sort((a: any, b: any) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // Clientes frecuentes
    const conteoClientes: any = {};
    this.ventasFiltradas.forEach(venta => {
      const id = venta.cliente?.id;
      const nombre = venta.cliente?.nombre || 'Desconocido';
      if (!conteoClientes[id]) {
        conteoClientes[id] = { nombre, compras: 0, total: 0 };
      }
      conteoClientes[id].compras += 1;
      conteoClientes[id].total += Number(venta.total);
    });

    this.clientesFrecuentes = Object.values(conteoClientes)
      .sort((a: any, b: any) => b.compras - a.compras)
      .slice(0, 5);
  }

  getVentasPorMes(): any[] {
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const datos = meses.map((mes, i) => ({
      mes,
      total: 0,
      cantidad: 0
    }));

    this.ventas.forEach(v => {
      const mes = new Date(v.createdAt).getMonth();
      datos[mes].total += Number(v.total);
      datos[mes].cantidad += 1;
    });

    return datos;
  }

  getMaxVentas(): number {
    return Math.max(...this.getVentasPorMes().map(m => m.total), 1);
  }

  exportarCSV(): void {
    const headers = ['Boleta', 'Cliente', 'Total', 'Estado', 'Fecha'];
    const rows = this.ventasFiltradas.map(v => [
      v.id?.substring(0, 8).toUpperCase(),
      v.cliente?.nombre || '-',
      v.total,
      v.estado,
      new Date(v.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas-${this.fechaInicio}-${this.fechaFin}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}