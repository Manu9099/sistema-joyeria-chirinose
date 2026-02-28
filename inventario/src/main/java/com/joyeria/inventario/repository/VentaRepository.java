package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.EstadoVenta;
import com.joyeria.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, String> {
    List<Venta> findByClienteId(String clienteId);
    List<Venta> findByUsuarioId(String usuarioId);
    List<Venta> findByEstado(EstadoVenta estado);
}