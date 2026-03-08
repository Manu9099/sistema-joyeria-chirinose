import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/sidebar/sidebar')
      .then(m => m.SidebarComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/productos/productos')
          .then(m => m.ProductosComponent)
      },
      {
        path: 'ventas',
        loadComponent: () => import('./pages/ventas/ventas')
          .then(m => m.VentasComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/clientes/clientes')
          .then(m => m.ClientesComponent)
      },
      {
  path: 'proveedores',
  loadComponent: () => import('./pages/proveedores/proveedores')
    .then(m => m.ProveedoresComponent)
},
{
  path: 'reportes',
  loadComponent: () => import('./pages/reportes/reportes')
    .then(m => m.ReportesComponent)
},
{
  path: 'precio-oro',
  loadComponent: () => import('./pages/precio-oro/precio-oro')
    .then(m => m.PrecioOroComponent)
},
{
  path: 'perfil',
  loadComponent: () => import('./pages/perfil/perfil')
    .then(m => m.PerfilComponent)
},
{
  path: 'usuarios',
  loadComponent: () => import('./pages/usuarios/usuarios')
    .then(m => m.UsuariosComponent),
  canActivate: [authGuard]
},
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];