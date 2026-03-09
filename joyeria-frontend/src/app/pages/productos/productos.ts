import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TagModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  busqueda: string = '';
  dialogVisible: boolean = false;
  editando: boolean = false;
  loading: boolean = false;

  productoForm: any = {
    codigo: '',
    descripcion: '',
    precioCompra: null,
    precioVenta: null,
    pesoGramos: null,
    quilates: 24,
    stockActual: 0
  };

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }
 selectedFile: File | null = null;
  previewUrl: string | null = null;

  // ✅ Para mostrar imagen (si fotoUrl ya viene como "/uploads/...")
fotoSrc(producto: any): string | null {
  if (!producto?.fotoUrl) return null;
  return this.productoService.getFotoUrl(producto.fotoUrl);
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];
    this.previewUrl = URL.createObjectURL(this.selectedFile);
  }

  limpiarFotoLocal(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  // ✅ Subir foto (solo cuando ya existe ID)
subirFotoProducto(): void {
  if (!this.editando || !this.productoForm?.id) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Primero guarda',
      detail: 'Debes guardar el producto antes de subir la foto.'
    });
    return;
  }
  if (!this.selectedFile) return;

  this.productoService.subirFoto(this.productoForm.id, this.selectedFile).subscribe({
    next: (r) => {
      this.productoForm.fotoUrl = r.fotoUrl;
      this.previewUrl = this.productoService.getFotoUrl(r.fotoUrl);

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Foto subida correctamente'
      });

      this.cargarProductos();
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo subir la foto'
      });
    }
  });
}

  eliminarFotoProducto(): void {
    if (!this.productoForm?.id) return;

    this.productoService.eliminarFoto(this.productoForm.id).subscribe({
      next: () => {
        this.productoForm.fotoUrl = null;
        this.limpiarFotoLocal();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Foto eliminada'
        });
        this.cargarProductos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la foto'
        });
      }
    });
  }

  cargarProductos(): void {
    this.productoService.listarTodos().subscribe(productos => {
      this.productos = productos;
      this.productosFiltrados = productos;
    });
  }

  buscar(): void {
    this.productosFiltrados = this.productos.filter(p =>
      p.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirDialogNuevo(): void {
    this.editando = false;
    this.productoForm = {
      codigo: '',
      descripcion: '',
      precioCompra: null,
      precioVenta: null,
      pesoGramos: null,
      quilates: 24,
      stockActual: 0
    };
    this.dialogVisible = true;
  }

abrirDialogEditar(producto: any): void {
  this.editando = true;
  this.productoForm = { ...producto };
  this.dialogVisible = true;
  this.previewUrl = producto?.fotoUrl
    ? this.productoService.getFotoUrl(producto.fotoUrl)
    : null;
  this.selectedFile = null;
}

guardar(): void {
 if (!this.formularioValido()) return; // ✅ doble seguro
  this.loading = true;


  this.loading = true;

  const onFinishOk = (msg: string) => {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
    this.dialogVisible = false;
    this.cargarProductos();
    this.loading = false;
    this.limpiarFotoLocal();
  };

  const onFinishError = (msg: string) => {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    this.loading = false;
  };

  const subirFotoSiCorresponde = (productoId: string, okMsg: string) => {
    // Si no hay foto seleccionada, terminamos normal
    if (!this.selectedFile) {
      onFinishOk(okMsg);
      return;
    }

    this.productoService.subirFoto(productoId, this.selectedFile).subscribe({
      next: (r) => {
        // actualiza el form/preview por si quieres
        this.productoForm.fotoUrl = r.fotoUrl;
        this.previewUrl = r.fotoUrl;
        onFinishOk(okMsg + ' y foto subida');
      },
      error: () => {
        // producto ya quedó guardado; la foto falló
        this.messageService.add({
          severity: 'warn',
          summary: 'Producto guardado',
          detail: 'Se guardó el producto, pero falló la subida de la foto.'
        });
        this.dialogVisible = false;
        this.cargarProductos();
        this.loading = false;
        this.limpiarFotoLocal();
      }
    });
  };

  if (this.editando) {
    // EDITAR: primero actualiza, luego si hay archivo sube foto
    this.productoService.actualizar(this.productoForm.id, this.productoForm).subscribe({
      next: () => {
        subirFotoSiCorresponde(this.productoForm.id, 'Producto actualizado correctamente');
      },
      error: () => onFinishError('No se pudo actualizar el producto')
    });

  } else {
    // CREAR: crea y usa el id retornado para subir foto
    this.productoService.crear(this.productoForm).subscribe({
      next: (created) => {
        // normal: created.id
        const productoId = created?.id ?? created?.data?.id ?? created?.producto?.id;

        if (!productoId) {
          // si tu backend NO devuelve id, igual cerramos y recargamos
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto creado correctamente (sin ID en respuesta, no se pudo subir foto automáticamente)'
          });
          this.dialogVisible = false;
          this.cargarProductos();
          this.loading = false;
          this.limpiarFotoLocal();
          return;
        }

        // ahora sí: subir foto si existe
        subirFotoSiCorresponde(productoId, 'Producto creado correctamente');
      },
      error: () => onFinishError('No se pudo crear el producto')
    });
  }
}

  eliminar(id: string): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto eliminado correctamente'
          });
          this.cargarProductos();
        }
      });
    }
  }

  getStockSeverity(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock <= 3) return 'warn';
    return 'success';
  }
errorPrecios: boolean = false;

validarPrecios(): void {
  const compra = this.productoForm.precioCompra ?? 0;
  const venta = this.productoForm.precioVenta ?? 0;
  this.errorPrecios = venta < compra;
}

formularioValido(): boolean {
  const f = this.productoForm;

  // Campos requeridos
  if (!f.codigo || !f.descripcion) return false;

  // Sin negativos
  if ((f.precioCompra ?? 0) < 0) return false;
  if ((f.precioVenta ?? 0) < 0) return false;
  if ((f.pesoGramos ?? 0) < 0) return false;
  if ((f.stockActual ?? 0) < 0) return false;
  if ((f.quilates ?? 0) < 0) return false;

  // Precio venta >= precio compra
  if ((f.precioVenta ?? 0) < (f.precioCompra ?? 0)) return false;

  return true;
}

}
