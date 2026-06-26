# Ecommerce Spring — Backend API REST

API REST de alto rendimiento para una plataforma de comercio electrónico, construida sobre **Spring Boot 3.4.5** con Java 17. Arquitectura en capas, autenticación stateless mediante JWT, control de acceso por roles y notificaciones por correo electrónico integradas desde el primer día.

---

## Tecnologías y dependencias principales

| Tecnología | Versión | Propósito |
|---|---|---|
| Java | 17 | Lenguaje principal |
| Spring Boot | 3.4.5 | Framework base |
| Spring Security | — | Autenticación y autorización |
| Spring Data JPA | — | Capa de persistencia |
| MySQL | — | Motor de base de datos relacional |
| JJWT | 0.9.1 | Generación y validación de tokens JWT |
| MapStruct | 1.6.3 | Mapeo de entidades a DTOs |
| Lombok | — | Reducción de código boilerplate |
| Spring Mail | — | Envío de correos transaccionales |
| Bean Validation | — | Validación de datos de entrada |
| Maven | — | Gestión de dependencias y construcción |

---

## Arquitectura del proyecto

```
src/main/java/com/ecommerce/
├── config/          # Seguridad JWT, CORS y filtros de autenticación
├── controller/      # Controladores REST (Auth, Producto, Carrito, Orden, Comentario)
├── dto/             # Objetos de transferencia de datos
├── exception/       # Manejo global de excepciones
├── mapper/          # Conversores MapStruct entre entidades y DTOs
├── model/           # Entidades JPA (Usuario, Producto, Carrito, Orden, Comentario)
├── repositories/    # Repositorios Spring Data JPA
└── service/         # Lógica de negocio y servicios de dominio
```

---

## Funcionalidades

### Autenticacion y usuarios
- Registro de usuarios con validación de datos
- Confirmación de email mediante código de verificación
- Inicio de sesión con generación de token JWT (validez: 24 horas)
- Cambio de contraseña para usuarios autenticados
- Roles de sistema: `USER` y `ADMIN`

### Catalogo de productos
- CRUD completo de productos (restringido a `ADMIN`)
- Carga y almacenamiento de imágenes (hasta 10 MB)
- Listado paginado (10 productos por página por defecto)
- Consulta pública de productos sin autenticación

### Carrito de compras
- Gestión del carrito por usuario autenticado
- Adición, actualización y eliminación de ítems
- Validación de stock en tiempo real

### Gestión de ordenes
- Creación de órdenes a partir del carrito activo
- Ciclo de vida de la orden: `PREPARANDO → ENTREGANDO → ENTREGADO / CANCELADO`
- Notificación por correo electrónico al confirmar la orden
- Consulta de órdenes propias para usuarios y de todas las órdenes para administradores

### Comentarios
- Publicación y gestión de reseñas por producto

---

## Seguridad

El sistema implementa un esquema de seguridad stateless basado en JSON Web Tokens:

- Todas las sesiones son sin estado (no se almacena contexto en servidor)
- Las contraseñas se almacenan con hash `BCrypt`
- El filtro `JwtAuthenticationFilter` intercepta y valida cada solicitud entrante
- El control de acceso se aplica a nivel de método mediante `@PreAuthorize`
- CORS configurado para el cliente Angular en `http://localhost:4200`

Rutas públicas:
```
GET  /api/productos/**
POST /api/auth/login
POST /api/auth/registrar
POST /api/auth/confirmar-email
```

---

## Requisitos previos

- Java 17 o superior
- Maven 3.8+
- MySQL 8+
- Cuenta en Mailtrap (u otro servidor SMTP compatible)

---

## Configuracion del entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```properties
DATASOURCE_URL=jdbc:mysql://localhost:3306/nombre_base_de_datos
DATASOURCE_USERNAME=usuario_mysql
DATASOURCE_PASSWORD=contrasena_mysql
JWT_SECRET=clave_secreta_jwt
MAIL_PASSWORD=contrasena_smtp
```

---

## Ejecucion del proyecto

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd ecommerce_spring

# Compilar y ejecutar
./mvnw spring-boot:run
```

La API quedará disponible en: `http://localhost:8080`

---

## Endpoints principales

| Metodo | Ruta | Acceso | Descripcion |
|---|---|---|---|
| `POST` | `/api/auth/registrar` | Público | Registro de nuevo usuario |
| `POST` | `/api/auth/login` | Público | Autenticación y obtención de token |
| `POST` | `/api/auth/confirmar-email` | Público | Validación de cuenta por código |
| `POST` | `/api/auth/cambiar-password` | Autenticado | Cambio de contraseña |
| `GET` | `/api/productos` | Público | Listado paginado de productos |
| `GET` | `/api/productos/{id}` | Público | Detalle de producto |
| `POST` | `/api/productos` | ADMIN | Crear producto con imagen |
| `PUT` | `/api/productos/{id}` | ADMIN | Actualizar producto |
| `DELETE` | `/api/productos/{id}` | ADMIN | Eliminar producto |
| `GET` | `/api/carrito` | Autenticado | Consultar carrito |
| `POST` | `/api/ordenes` | Autenticado | Crear orden desde el carrito |
| `GET` | `/api/ordenes/usuario` | Autenticado | Ordenes del usuario |
| `GET` | `/api/ordenes` | ADMIN | Todas las ordenes |
| `PUT` | `/api/ordenes/{id}/estado` | ADMIN | Actualizar estado de orden |

---

## Estructura de la base de datos

Las entidades principales y sus relaciones:

- `Usuario` — base del sistema de autenticación, implementa `UserDetails`
- `Producto` — catálogo con imagen y control de stock
- `Carrito` / `CarritoItem` — relación uno a uno con usuario, uno a muchos con ítems
- `Orden` / `OrdenItem` — historial de compras con estado del ciclo de vida
- `Comentario` — reseñas asociadas a productos y usuarios

El esquema se gestiona automáticamente con la estrategia `ddl-auto=update`.

---

## Licencia

Este proyecto se distribuye con fines educativos y de demostración.
