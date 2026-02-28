package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.Proveedor;
import com.joyeria.inventario.repository.ProductoRepository;
import com.joyeria.inventario.repository.ProveedorRepository;
import com.joyeria.inventario.service.ProveedorService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ProveedorServiceImpl implements ProveedorService {


    @Autowired
    private  ProveedorRepository proveedorRepository;

    @Override
    public Proveedor crear(Proveedor proveedor) {
        proveedor.setId(UUID.randomUUID().toString());
        return proveedorRepository.save(proveedor);
    }

    @Override
    public List<Proveedor> listarTodos() {
        return proveedorRepository.findAll();
    }

    @Override
    public List<Proveedor> listarActivos() {
        return proveedorRepository.findByActivoTrue();
    }

    @Override
    public Optional<Proveedor> buscarPorId(String id) {
        return proveedorRepository.findById(id);
    }

    @Override
    public Proveedor actualizar(String id, Proveedor proveedor) {
        Proveedor existente = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        existente.setNombre(proveedor.getNombre());
        existente.setContacto(proveedor.getContacto());
        existente.setTelefono(proveedor.getTelefono());
        existente.setEmail(proveedor.getEmail());
        existente.setDireccion(proveedor.getDireccion());
        existente.setActivo(proveedor.getActivo());
        return proveedorRepository.save(existente);
    }

    @Override
    public void eliminar(String id) {
        proveedorRepository.deleteById(id);
    }
}