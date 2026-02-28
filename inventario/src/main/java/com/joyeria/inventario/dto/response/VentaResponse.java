package com.joyeria.inventario.dto.response;

import com.joyeria.inventario.entity.EstadoVenta;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VentaResponse {
    private String id;
    private String mensaje;
    private EstadoVenta estado;
    private BigDecimal total;
    private LocalDateTime fecha;
    private String clienteNombre;
    private String vendedorNombre;

    public VentaResponse(String id, String mensaje, EstadoVenta estado,
                         BigDecimal total, LocalDateTime fecha,
                         String clienteNombre, String vendedorNombre) {
        this.id = id;
        this.mensaje = mensaje;
        this.estado = estado;
        this.total = total;
        this.fecha = fecha;
        this.clienteNombre = clienteNombre;
        this.vendedorNombre = vendedorNombre;
    }

    public String getId() { return id; }
    public String getMensaje() { return mensaje; }
    public EstadoVenta getEstado() { return estado; }
    public BigDecimal getTotal() { return total; }
    public LocalDateTime getFecha() { return fecha; }
    public String getClienteNombre() { return clienteNombre; }
    public String getVendedorNombre() { return vendedorNombre; }
}