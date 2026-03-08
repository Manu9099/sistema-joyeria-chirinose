package com.joyeria.inventario.storage;

import com.joyeria.inventario.entity.Producto;
import com.joyeria.inventario.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.Instant;
import java.util.Locale;

@Service
public class ProductoFotoStorageService {

    private final ProductoRepository productoRepository;
    private final Path productosDir;

    public ProductoFotoStorageService(
            ProductoRepository productoRepository,
            @Value("${app.upload.productos-dir:uploads/productos}") String productosDir
    ) {
        this.productoRepository = productoRepository;
        this.productosDir = Paths.get(productosDir).toAbsolutePath().normalize();
    }

    public String guardarFoto(String productoId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Archivo vacío");
        }

        // Validación básica de tipo (evita subir cualquier cosa)
        String contentType = (file.getContentType() == null) ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        String ext = switch (contentType) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> null;
        };
        if (ext == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se permiten imágenes JPG/PNG/WEBP");
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        try {
            Files.createDirectories(productosDir);

            // Nombre simple y seguro: {productoId}_{epochMillis}.ext
            String safeName = productoId + "_" + Instant.now().toEpochMilli() + ext;
            Path target = productosDir.resolve(safeName).normalize();

            // Evita path traversal
            if (!target.startsWith(productosDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de archivo inválido");
            }

            // Guarda el archivo
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }

            // (Opcional) si ya tenía foto, podrías borrarla aquí.
            // Lo dejamos simple por ahora.

            String fotoUrl = "/uploads/productos/" + safeName;
            producto.setFotoUrl(fotoUrl);
            productoRepository.save(producto);

            return fotoUrl;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar la imagen");
        }
    }

    public void eliminarFoto(String productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        String fotoUrl = producto.getFotoUrl();
        if (fotoUrl != null && fotoUrl.startsWith("/uploads/productos/")) {
            String fileName = fotoUrl.substring("/uploads/productos/".length());
            Path target = productosDir.resolve(fileName).normalize();
            if (target.startsWith(productosDir)) {
                try {
                    Files.deleteIfExists(target);
                } catch (IOException ignored) {
                    // si no se puede borrar, igual limpiamos el campo
                }
            }
        }

        producto.setFotoUrl(null);
        productoRepository.save(producto);
    }
}
