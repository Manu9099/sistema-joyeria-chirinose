package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.Usuario;
import com.joyeria.inventario.repository.UsuarioRepository;
import com.joyeria.inventario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

@Service

public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private  UsuarioRepository usuarioRepository;

    @Override
    public Usuario crear(Usuario usuario) {
        usuario.setId(UUID.randomUUID().toString());
        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> buscarPorId(String id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario actualizar(String id, Usuario usuario) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        existente.setNombre(usuario.getNombre());
        existente.setEmail(usuario.getEmail());
        existente.setRol(usuario.getRol());
        existente.setActivo(usuario.getActivo());
        return usuarioRepository.save(existente);
    }

    @Override
    public void eliminar(String id) {
        usuarioRepository.deleteById(id);
    }
}