package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    Producto crear(Producto producto);
    List<Producto> listarTodos();
    List<Producto> listarActivos();
    Optional<Producto> buscarPorId(String id);
    Optional<Producto> buscarPorCodigo(String codigo);
    Producto actualizar(String id, Producto producto);
    void eliminar(String id);
}