package com.joyeria.inventario.controller;

import com.joyeria.inventario.entity.PrecioOro;
import com.joyeria.inventario.service.PrecioOroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/precio-oro")
@CrossOrigin(origins = "*")
public class PrecioOroController {

    @Autowired
    private PrecioOroService precioOroService;

    @GetMapping
    public List<PrecioOro> listarTodos() {
        return precioOroService.listarTodos();
    }

    @GetMapping("/ultimo")
    public ResponseEntity<PrecioOro> obtenerUltimo() {
        return precioOroService.obtenerUltimo()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PrecioOro> registrar(@RequestBody PrecioOro precioOro) {
        return ResponseEntity.ok(precioOroService.registrar(precioOro));
    }
}