package com.joyeria.inventario.controller;

import com.joyeria.inventario.entity.Movimiento;
import com.joyeria.inventario.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "*")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;

    @GetMapping
    public List<Movimiento> listarTodos() {
        return movimientoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> buscarPorId(@PathVariable String id) {
        return movimientoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/producto/{productoId}")
    public List<Movimiento> listarPorProducto(@PathVariable String productoId) {
        return movimientoService.listarPorProducto(productoId);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Movimiento> listarPorCliente(@PathVariable String clienteId) {
        return movimientoService.listarPorCliente(clienteId);
    }

    @PostMapping
    public ResponseEntity<Movimiento> registrar(@RequestBody Movimiento movimiento) {
        return ResponseEntity.ok(movimientoService.registrar(movimiento));
    }
}