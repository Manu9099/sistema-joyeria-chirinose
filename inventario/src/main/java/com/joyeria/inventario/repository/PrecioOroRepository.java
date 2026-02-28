package com.joyeria.inventario.repository;

import com.joyeria.inventario.entity.PrecioOro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PrecioOroRepository extends JpaRepository<PrecioOro, String> {
    Optional<PrecioOro> findTopByOrderByCreatedAtDesc();
}