package com.joyeria.inventario.service;

import com.joyeria.inventario.entity.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    Usuario crear(Usuario usuario);
    List<Usuario> listarTodos();
    Optional<Usuario> buscarPorId(String id);
    Optional<Usuario> buscarPorEmail(String email);
    Usuario actualizar(String id, Usuario usuario);
    void eliminar(String id);
}