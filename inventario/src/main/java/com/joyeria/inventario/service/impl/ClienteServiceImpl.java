package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.Cliente;
import com.joyeria.inventario.repository.ClienteRepository;
import com.joyeria.inventario.service.ClienteService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public Cliente crear(Cliente cliente) {
        cliente.setId(UUID.randomUUID().toString());
        return clienteRepository.save(cliente);
    }

    @Override
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @Override
    public List<Cliente> listarActivos() {
        return clienteRepository.findByActivoTrue();
    }

    @Override
    public Optional<Cliente> buscarPorId(String id) {
        return clienteRepository.findById(id);
    }

    @Override
    public List<Cliente> buscarPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public Cliente actualizar(String id, Cliente cliente) {
        Cliente existente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        existente.setNombre(cliente.getNombre());
        existente.setDocumento(cliente.getDocumento());
        existente.setTelefono(cliente.getTelefono());
        existente.setEmail(cliente.getEmail());
        existente.setActivo(cliente.getActivo());
        return clienteRepository.save(existente);
    }

    @Override
    public void eliminar(String id) {
        clienteRepository.deleteById(id);
    }
}