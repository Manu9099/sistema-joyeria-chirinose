package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, String> {
    List<DetalleVenta> findByVentaId(String ventaId);
}