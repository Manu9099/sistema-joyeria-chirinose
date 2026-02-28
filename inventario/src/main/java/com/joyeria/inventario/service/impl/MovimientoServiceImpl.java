package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.Movimiento;
import com.joyeria.inventario.entity.Producto;
import com.joyeria.inventario.entity.TipoMovimiento;
import com.joyeria.inventario.repository.MovimientoRepository;
import com.joyeria.inventario.repository.ProductoRepository;
import com.joyeria.inventario.service.MovimientoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

@Service

public class MovimientoServiceImpl implements MovimientoService {


    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    @Transactional
    public Movimiento registrar(Movimiento movimiento) {
        Producto producto = productoRepository.findById(movimiento.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (movimiento.getTipo() == TipoMovimiento.INGRESO) {
            producto.setStockActual(producto.getStockActual() + movimiento.getCantidad());
        } else {
            if (producto.getStockActual() < movimiento.getCantidad()) {
                throw new RuntimeException("Stock insuficiente");
            }
            producto.setStockActual(producto.getStockActual() - movimiento.getCantidad());
        }

        productoRepository.save(producto);
        movimiento.setId(UUID.randomUUID().toString());
        return movimientoRepository.save(movimiento);
    }

    @Override
    public List<Movimiento> listarTodos() {
        return movimientoRepository.findAll();
    }

    @Override
    public Optional<Movimiento> buscarPorId(String id) {
        return movimientoRepository.findById(id);
    }

    @Override
    public List<Movimiento> listarPorProducto(String productoId) {
        return movimientoRepository.findByProductoId(productoId);
    }

    @Override
    public List<Movimiento> listarPorCliente(String clienteId) {
        return movimientoRepository.findByClienteId(clienteId);
    }
}
