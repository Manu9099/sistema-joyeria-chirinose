package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.Producto;
import com.joyeria.inventario.repository.ProductoRepository;
import com.joyeria.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

@Service

public class ProductoServiceImpl implements ProductoService {
    @Autowired
    private  ProductoRepository productoRepository;

    @Override
    public Producto crear(Producto producto) {
        producto.setId(UUID.randomUUID().toString());
        return productoRepository.save(producto);
    }

    @Override
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    @Override
    public List<Producto> listarActivos() {
        return productoRepository.findByActivoTrue();
    }

    @Override
    public Optional<Producto> buscarPorId(String id) {
        return productoRepository.findById(id);
    }

    @Override
    public Optional<Producto> buscarPorCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo);
    }

    @Override
    public Producto actualizar(String id, Producto producto) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecioCompra(producto.getPrecioCompra());
        existente.setPrecioVenta(producto.getPrecioVenta());
        existente.setPesoGramos(producto.getPesoGramos());
        existente.setQuilates(producto.getQuilates());
        existente.setStockActual(producto.getStockActual());
        existente.setActivo(producto.getActivo());
        existente.setFotoUrl(producto.getFotoUrl());
        return productoRepository.save(existente);
    }

    @Override
    public void eliminar(String id) {
        productoRepository.deleteById(id);
    }
}