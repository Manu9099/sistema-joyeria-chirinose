package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.Proveedor;
import java.util.List;
import java.util.Optional;

public interface ProveedorService {
    Proveedor crear(Proveedor proveedor);
    List<Proveedor> listarTodos();
    List<Proveedor> listarActivos();
    Optional<Proveedor> buscarPorId(String id);
    Proveedor actualizar(String id, Proveedor proveedor);
    void eliminar(String id);
}