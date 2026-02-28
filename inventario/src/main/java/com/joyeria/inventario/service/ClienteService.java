package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.Cliente;
import java.util.List;
import java.util.Optional;

public interface ClienteService {
    Cliente crear(Cliente cliente);
    List<Cliente> listarTodos();
    List<Cliente> listarActivos();
    Optional<Cliente> buscarPorId(String id);
    List<Cliente> buscarPorNombre(String nombre);
    Cliente actualizar(String id, Cliente cliente);
    void eliminar(String id);
}