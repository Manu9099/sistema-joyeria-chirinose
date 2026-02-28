package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.*;
import com.joyeria.inventario.repository.ProductoRepository;
import com.joyeria.inventario.repository.VentaRepository;
import com.joyeria.inventario.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class VentaServiceImpl implements VentaService {
    private static final Logger log = LoggerFactory.getLogger(VentaServiceImpl.class);
    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    @Transactional
    public Venta crear(Venta venta) {
        log.info("Creando venta para cliente: {}", venta.getCliente().getId());
        venta.setId(UUID.randomUUID().toString());

        if (venta.getDetalles() == null || venta.getDetalles().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un producto");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStockActual() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getDescripcion());
            }

            producto.setStockActual(producto.getStockActual() - detalle.getCantidad());
            productoRepository.save(producto);

            detalle.setId(UUID.randomUUID().toString());
            detalle.setVenta(venta);
            detalle.setPrecioUnitario(producto.getPrecioVenta());
            detalle.setSubtotal(producto.getPrecioVenta()
                    .multiply(BigDecimal.valueOf(detalle.getCantidad())));

            total = total.add(detalle.getSubtotal());
        }

        venta.setTotal(total);
        venta.setEstado(EstadoVenta.PENDIENTE);

        if (venta.getPagos() != null && !venta.getPagos().isEmpty()) {
            for (Pago pago : venta.getPagos()) {
                pago.setId(UUID.randomUUID().toString());
                pago.setVenta(venta);
            }
            BigDecimal totalPagado = venta.getPagos().stream()
                    .map(Pago::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (totalPagado.compareTo(total) >= 0) {
                venta.setEstado(EstadoVenta.PAGADO);
            }
        }
        log.info("Venta creada exitosamente con ID: {} total: {}", venta.getId(), venta.getTotal());
        return ventaRepository.save(venta);
    }

    @Override
    public List<Venta> listarTodas() {
        return ventaRepository.findAll();
    }

    @Override
    public Optional<Venta> buscarPorId(String id) {
        return ventaRepository.findById(id);
    }

    @Override
    public List<Venta> listarPorCliente(String clienteId) {
        return ventaRepository.findByClienteId(clienteId);
    }

    @Override
    @Transactional
    public Venta anular(String id) {
        log.warn("Anulando venta ID: {}", id);
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        if (venta.getEstado() == EstadoVenta.ANULADO) {
            throw new RuntimeException("La venta ya está anulada");
        }

        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            producto.setStockActual(producto.getStockActual() + detalle.getCantidad());
            productoRepository.save(producto);
        }
        log.warn("Venta anulada: {}", id);
        venta.setEstado(EstadoVenta.ANULADO);
        return ventaRepository.save(venta);
    }
}