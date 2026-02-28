package com.joyeria.inventario.service.impl;

import com.joyeria.inventario.entity.PrecioOro;
import com.joyeria.inventario.repository.PrecioOroRepository;
import com.joyeria.inventario.repository.ProveedorRepository;
import com.joyeria.inventario.service.PrecioOroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
@Service
public class PrecioOroServiceImpl implements PrecioOroService {


    @Autowired
    private PrecioOroRepository precioOroRepository;
    @Override
    public PrecioOro registrar(PrecioOro precioOro) {
        precioOro.setId(UUID.randomUUID().toString());
        return precioOroRepository.save(precioOro);
    }

    @Override
    public Optional<PrecioOro> obtenerUltimo() {
        return precioOroRepository.findTopByOrderByCreatedAtDesc();
    }

    @Override
    public List<PrecioOro> listarTodos() {
        return precioOroRepository.findAll();
    }
}