package com.joyeria.inventario.controller;

import com.joyeria.inventario.dto.response.VentaResponse;
import com.joyeria.inventario.entity.Venta;
import com.joyeria.inventario.service.VentaService;
import com.joyeria.inventario.util.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaService ventaService;
    @Autowired
    private PdfService pdfService;
    @GetMapping
    public List<Venta> listarTodas() {
        return ventaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable String id) {
        return ventaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Venta> listarPorCliente(@PathVariable String clienteId) {
        return ventaService.listarPorCliente(clienteId);
    }

    @PostMapping
    public ResponseEntity<VentaResponse> crear(@RequestBody Venta venta) {
        Venta ventaCreada = ventaService.crear(venta);
        VentaResponse response = new VentaResponse(
                ventaCreada.getId(),
                "✅ Venta realizada exitosamente",
                ventaCreada.getEstado(),
                ventaCreada.getTotal(),
                ventaCreada.getCreatedAt(),
                ventaCreada.getCliente().getNombre(),
                ventaCreada.getUsuario().getNombre()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/anular")
    public ResponseEntity<Venta> anular(@PathVariable String id) {
        return ResponseEntity.ok(ventaService.anular(id));
    }

    @GetMapping("/{id}/boleta")
    public ResponseEntity<byte[]> descargarBoleta(@PathVariable String id) {
        try {
            Venta venta = ventaService.buscarPorId(id)
                    .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
            byte[] pdf = pdfService.generarBoletaVenta(venta);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=boleta-" + id.substring(0, 8) + ".pdf")
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}