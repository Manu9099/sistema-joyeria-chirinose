package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.Movimiento;
import com.joyeria.inventario.entity.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, String> {
    List<Movimiento> findByProductoId(String productoId);
    List<Movimiento> findByUsuarioId(String usuarioId);
    List<Movimiento> findByClienteId(String clienteId);
    List<Movimiento> findByTipo(TipoMovimiento tipo);
}
