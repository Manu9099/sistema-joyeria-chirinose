import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { PrecioOroService } from '../../core/services/precio-oro.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../core/services/producto';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements  OnInit{
  precioOro: number = 0;


  notificaciones: any[] = [];
  mostrarNotificaciones: boolean = false;

menuItems = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', rol: 'ALL' },
  { label: 'Productos', icon: 'pi pi-box', route: '/productos', rol: 'ALL' },
  { label: 'Ventas', icon: 'pi pi-shopping-cart', route: '/ventas', rol: 'ALL' },
  { label: 'Clientes', icon: 'pi pi-users', route: '/clientes', rol: 'ALL' },
  { label: 'Proveedores', icon: 'pi pi-truck', route: '/proveedores', rol: 'ALL' },
  { label: 'Precio del Oro', icon: 'pi pi-chart-line', route: '/precio-oro', rol: 'ALL' },
  { label: 'Reportes', icon: 'pi pi-chart-bar', route: '/reportes', rol: 'ALL' },
  { label: 'Usuarios', icon: 'pi pi-users', route: '/usuarios', rol: 'ADMIN' },
];

  constructor(
    public authService: AuthService,
    private precioOroService: PrecioOroService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarPrecioOro();
     this.cargarNotificaciones();
  }

    cargarNotificaciones(): void {
    this.productoService.listarTodos().subscribe({
      next: (productos) => {
        this.notificaciones = productos.filter(p => p.stockActual <= 3 && p.activo);
      },
      error: () => this.notificaciones = []
    });
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }
  
  cargarPrecioOro(): void {
    this.precioOroService.obtenerUltimo().subscribe({
      next: (precio) => this.precioOro = precio?.valorPorGramo || 0,
      error: () => this.precioOro = 0
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getUsuario() {
    return this.authService.getUsuario();
  }
}