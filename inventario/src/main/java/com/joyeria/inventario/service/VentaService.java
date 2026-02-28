package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.Venta;
import java.util.List;
import java.util.Optional;

public interface VentaService {
    Venta crear(Venta venta);
    List<Venta> listarTodas();
    Optional<Venta> buscarPorId(String id);
    List<Venta> listarPorCliente(String clienteId);
    Venta anular(String id);
}