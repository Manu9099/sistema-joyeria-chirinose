# ✦ Sistema de Gestión de Joyería

Sistema completo de gestión para joyerías con backend Spring Boot, frontend Angular y despliegue con Docker.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-green?style=flat-square&logo=springboot)
![Angular](https://img.shields.io/badge/Angular-17-red?style=flat-square&logo=angular)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker)

---

## 📸 Vista General

Sistema completo con autenticación JWT, gestión de inventario, ventas con boletas PDF, control de precio del oro y reportes con exportación CSV.

---

## 🚀 Tecnologías

### Backend
- **Java 21** + **Spring Boot 4**
- **Spring Security** + **JWT** (HMAC-SHA512)
- **PostgreSQL 16** + **Hibernate / JPA**
- **iText 5** para generación de PDFs
- **Logback** para logs profesionales

### Frontend
- **Angular 17** (Standalone Components)
- **PrimeNG** + **TailwindCSS**
- **HTTPS** con certificados SSL (mkcert)
- **Nginx** como proxy reverso

### DevOps
- **Docker** + **Docker Compose**
- Variables de entorno con `.env`
- Volúmenes persistentes para PostgreSQL

---

## 📦 Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| 🔐 **Autenticación** | Login con JWT, recordarme 7 días |
| 📦 **Productos** | CRUD completo con control de stock |
| 🛒 **Ventas** | Registro de ventas con boleta PDF |
| 👥 **Clientes** | Gestión con validación DNI y teléfono |
| 🚚 **Proveedores** | Gestión de proveedores |
| ✦ **Precio del Oro** | Historial y calculadora por quilates |
| 📊 **Reportes** | Estadísticas y exportación CSV |
| 👤 **Usuarios** | Gestión de roles (Admin/Usuario) |
| 🔔 **Notificaciones** | Alertas de bajo stock en tiempo real |
| 👤 **Perfil** | Edición de perfil y cambio de contraseña |

---

## 🏗️ Estructura del Proyecto

```
joyeria/
├── docker-compose.yml
├── .env
├── .gitignore
├── inventario/                 ← Backend Spring Boot
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/joyeria/
│       ├── controller/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       ├── security/
│       ├── config/
│       └── util/
└── joyeria-frontend/           ← Frontend Angular
    ├── Dockerfile
    ├── nginx.conf
    ├── ssl/
    └── src/app/
        ├── core/
        │   ├── guards/
        │   ├── interceptors/
        │   └── services/
        ├── layout/
        │   ├── sidebar/
        │   └── navbar/
        └── pages/
            ├── auth/
            ├── dashboard/
            ├── productos/
            ├── ventas/
            ├── clientes/
            ├── proveedores/
            ├── precio-oro/
            ├── reportes/
            ├── usuarios/
            └── perfil/
```

---

## ⚙️ Instalación y Configuración

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [mkcert](https://github.com/FiloSottile/mkcert) para SSL local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/joyeria.git
cd joyeria
```

### 2. Configurar variables de entorno
Crea el archivo `.env` en la raíz:
```env
# Base de datos
POSTGRES_DB=joyeria
POSTGRES_USER=postgres
POSTGRES_PASSWORD=TU_PASSWORD

# Backend
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura
JWT_EXPIRATION=86400000
DDL_AUTO=update

# Puertos
BACKEND_PORT=8080
FRONTEND_PORT=8443
```

### 3. Configurar SSL
```bash
# Instalar mkcert
winget install FiloSottile.mkcert   # Windows
brew install mkcert                  # Mac

# Generar certificados
mkcert -install
cd joyeria-frontend/ssl
mkcert localhost 127.0.0.1
```

### 4. Levantar el sistema
```bash
docker-compose up --build -d
```

### 5. Acceder al sistema
```
https://localhost:8443
```

---

## 👤 Usuarios por defecto

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@joyeria.com | admin123 | ADMIN |
| vendedor@joyeria.com | vendedor123 | USUARIO |

---

## 🐳 Comandos Docker

```bash
# Iniciar el sistema
docker-compose up -d

# Detener el sistema
docker-compose down

# Reconstruir después de cambios
docker-compose up --build -d

# Ver logs del backend
docker logs joyeria-backend -f

# Ver logs del frontend
docker logs joyeria-frontend -f

# Eliminar volúmenes (borra la BD)
docker-compose down -v
```

---

## 🔌 API REST

Base URL: `http://localhost:8080/api`

### Autenticación
```
POST /auth/login        → Login
POST /auth/registro     → Registro
```

### Recursos principales
```
GET/POST   /productos
GET/POST   /ventas
GET/POST   /clientes
GET/POST   /proveedores
GET/POST   /precio-oro
GET        /ventas/{id}/boleta    → Descarga PDF
GET/PUT    /usuarios/perfil
PUT        /usuarios/cambiar-password
```

> Todos los endpoints excepto `/auth/**` requieren header:
> `Authorization: Bearer <token>`

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

---

<div align="center">
  Construido con ❤️ usando Spring Boot + Angular + Docker
</div>
