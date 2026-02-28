package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, String> {
    Optional<Producto> findByCodigo(String codigo);
    List<Producto> findByActivoTrue();
    List<Producto> findByProveedorId(String proveedorId);
    boolean existsByCodigo(String codigo);
}