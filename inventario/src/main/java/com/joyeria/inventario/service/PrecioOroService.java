package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.PrecioOro;
import java.util.List;
import java.util.Optional;

public interface PrecioOroService {
    PrecioOro registrar(PrecioOro precioOro);
    Optional<PrecioOro> obtenerUltimo();
    List<PrecioOro> listarTodos();
}