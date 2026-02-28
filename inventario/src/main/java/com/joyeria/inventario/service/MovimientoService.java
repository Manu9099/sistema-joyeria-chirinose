package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.Movimiento;
import java.util.List;
import java.util.Optional;


public interface MovimientoService {
    Movimiento registrar(Movimiento movimiento);
    List<Movimiento> listarTodos();
    Optional<Movimiento> buscarPorId(String id);
    List<Movimiento> listarPorProducto(String productoId);
    List<Movimiento> listarPorCliente(String clienteId);
}