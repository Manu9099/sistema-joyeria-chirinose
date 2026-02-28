package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProveedorRepository extends JpaRepository<Proveedor, String> {
    List<Proveedor> findByActivoTrue();
}