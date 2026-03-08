package com.joyeria.inventario.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Permite servir archivos subidos en runtime (p.ej. fotos) desde el filesystem.
 *
 * Ej:
 *   /uploads/productos/xxx.jpg  ->  {app.upload.base-dir}/productos/xxx.jpg
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${app.upload.base-dir:uploads}")
    private String uploadBaseDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path basePath = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
        String location = basePath.toUri().toString();
        // Asegura que termine en "/" para que Spring lo trate como directorio
        if (!location.endsWith("/")) location = location + "/";

        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(location)
                .setCachePeriod(3600);
    }
}
