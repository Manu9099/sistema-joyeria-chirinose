package com.joyeria.inventario.config;

import com.joyeria.inventario.entity.*;
import com.joyeria.inventario.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PrecioOroRepository precioOroRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Solo carga datos si la BD está vacía
        if (usuarioRepository.count() > 0) return;

        // USUARIOS
        Usuario admin = new Usuario();
        admin.setId(UUID.randomUUID().toString());
        admin.setNombre("Administrador");
        admin.setEmail("admin@joyeria.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRol("ADMIN");
        admin.setActivo(true);
        usuarioRepository.save(admin);

        Usuario vendedor = new Usuario();
        vendedor.setId(UUID.randomUUID().toString());
        vendedor.setNombre("Juan Vendedor");
        vendedor.setEmail("vendedor@joyeria.com");
        vendedor.setPassword(passwordEncoder.encode("vendedor123"));
        vendedor.setRol("USUARIO");
        vendedor.setActivo(true);
        usuarioRepository.save(vendedor);

        // PROVEEDORES
        Proveedor proveedor = new Proveedor();
        proveedor.setId(UUID.randomUUID().toString());
        proveedor.setNombre("Oro Andino SAC");
        proveedor.setContacto("Carlos Quispe");
        proveedor.setTelefono("999111222");
        proveedor.setEmail("oroandino@gmail.com");
        proveedor.setDireccion("Av. La Marina 456");
        proveedor.setActivo(true);
        proveedorRepository.save(proveedor);

        // PRODUCTOS
        Producto producto1 = new Producto();
        producto1.setId(UUID.randomUUID().toString());
        producto1.setCodigo("JOY001");
        producto1.setDescripcion("Anillo de Oro 24K");
        producto1.setPrecioCompra(new BigDecimal("150.00"));
        producto1.setPrecioVenta(new BigDecimal("250.00"));
        producto1.setPesoGramos(new BigDecimal("5.50"));
        producto1.setQuilates(24);
        producto1.setStockActual(10);
        producto1.setActivo(true);
        producto1.setProveedor(proveedor);
        productoRepository.save(producto1);

        Producto producto2 = new Producto();
        producto2.setId(UUID.randomUUID().toString());
        producto2.setCodigo("JOY002");
        producto2.setDescripcion("Collar de Oro 18K");
        producto2.setPrecioCompra(new BigDecimal("200.00"));
        producto2.setPrecioVenta(new BigDecimal("350.00"));
        producto2.setPesoGramos(new BigDecimal("8.00"));
        producto2.setQuilates(18);
        producto2.setStockActual(5);
        producto2.setActivo(true);
        producto2.setProveedor(proveedor);
        productoRepository.save(producto2);

        Producto producto3 = new Producto();
        producto3.setId(UUID.randomUUID().toString());
        producto3.setCodigo("JOY003");
        producto3.setDescripcion("Pulsera de Oro 14K");
        producto3.setPrecioCompra(new BigDecimal("120.00"));
        producto3.setPrecioVenta(new BigDecimal("200.00"));
        producto3.setPesoGramos(new BigDecimal("4.20"));
        producto3.setQuilates(14);
        producto3.setStockActual(8);
        producto3.setActivo(true);
        producto3.setProveedor(proveedor);
        productoRepository.save(producto3);

        // CLIENTES
        Cliente cliente1 = new Cliente();
        cliente1.setId(UUID.randomUUID().toString());
        cliente1.setNombre("María García");
        cliente1.setDocumento("45678901");
        cliente1.setTelefono("987654321");
        cliente1.setEmail("maria@gmail.com");
        cliente1.setActivo(true);
        clienteRepository.save(cliente1);

        Cliente cliente2 = new Cliente();
        cliente2.setId(UUID.randomUUID().toString());
        cliente2.setNombre("Pedro Rodríguez");
        cliente2.setDocumento("12345678");
        cliente2.setTelefono("912345678");
        cliente2.setEmail("pedro@gmail.com");
        cliente2.setActivo(true);
        clienteRepository.save(cliente2);

        // PRECIO ORO
        PrecioOro precioOro = new PrecioOro();
        precioOro.setId(UUID.randomUUID().toString());
        precioOro.setValorPorGramo(new BigDecimal("65.50"));
        precioOroRepository.save(precioOro);

        System.out.println("✅ Datos de prueba cargados exitosamente!");
    }
}