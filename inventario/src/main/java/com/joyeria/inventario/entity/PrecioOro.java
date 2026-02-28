package com.joyeria.inventario.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "precio_oro", indexes = @Index(columnList = "createdAt"))
public class PrecioOro {

    @Id
    private String id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPorGramo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public BigDecimal getValorPorGramo() { return valorPorGramo; }
    public void setValorPorGramo(BigDecimal valorPorGramo) { this.valorPorGramo = valorPorGramo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}