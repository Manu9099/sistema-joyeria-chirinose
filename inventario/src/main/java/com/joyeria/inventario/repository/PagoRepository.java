package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, String> {
    List<Pago> findByVentaId(String ventaId);
}