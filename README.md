# Ecommerce Full Stack

Aplicación de comercio electrónico con arquitectura cliente-servidor, compuesta por un backend REST con Spring Boot y un frontend SPA con React + TypeScript.

## Estructura del proyecto

```
ecomerce/
├── ecommerce_spring/   # Backend – Spring Boot 3 + MySQL
└── ecommerce_react/    # Frontend – React 18 + Vite + TypeScript
```

---

## Tecnologías

### Backend (`ecommerce_spring`)
| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.4.5 |
| Spring Security + JWT | jjwt 0.9.1 |
| Spring Data JPA | — |
| MySQL Connector | — |
| MapStruct | 1.6.3 |
| Lombok | — |
| Spring Mail | — |

### Frontend (`ecommerce_react`)
| Tecnología | Versión |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| React Router DOM | 7 |
| Axios | 1 |

---

## Funcionalidades principales

- Registro de usuarios con confirmación por correo electrónico (Mailtrap)
- Autenticación con JWT (roles `USER` / `ADMIN`)
- Catálogo de productos con paginación
- Detalle de producto con comentarios y calificaciones
- Carrito de compras persistente
- Proceso de checkout con dirección y teléfono de envío
- Historial de órdenes por usuario
- Panel de administración: CRUD de productos y gestión de pedidos

---

## Requisitos previos

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

## Configuración y ejecución

### Backend

1. Crear la base de datos:
```sql
CREATE DATABASE ecommerce_spring;
```

2. Configurar `ecommerce_spring/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_spring
spring.datasource.username=<usuario>
spring.datasource.password=<contraseña>

jwt.secret=<clave_secreta>
jwt.expiration=86400000

spring.mail.host=<smtp_host>
spring.mail.port=<smtp_port>
spring.mail.username=<smtp_usuario>
spring.mail.password=<smtp_contraseña>
```

3. Ejecutar:
```bash
cd ecommerce_spring
./mvnw spring-boot:run
```

El servidor queda disponible en `http://localhost:8080`.

### Frontend

```bash
cd ecommerce_react
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`. Las llamadas a `/api` se redirigen automáticamente al backend mediante el proxy de Vite.

---

## Endpoints principales de la API

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/registro` | Registro de usuario | Público |
| POST | `/api/auth/login` | Inicio de sesión | Público |
| POST | `/api/auth/confirmar` | Confirmación de email | Público |
| GET | `/api/productos` | Listar productos | Público |
| GET | `/api/productos/{id}` | Detalle de producto | Público |
| GET/POST/DELETE | `/api/carrito/**` | Gestión del carrito | USER |
| POST | `/api/ordenes` | Crear orden | USER |
| GET | `/api/ordenes/usuario` | Órdenes del usuario | USER |
| GET/PUT | `/api/ordenes/admin/**` | Gestión de órdenes | ADMIN |
| POST/PUT/DELETE | `/api/productos/**` | CRUD productos | ADMIN |
| GET/POST | `/api/comentarios/**` | Comentarios | USER |

---

## Estructura del backend

```
com.ecommerce/
├── config/        # SecurityConfig, JwtAuthenticationFilter
├── controller/    # AuthController, ProductoController, CarritoController, OrdenController, ComentarioController
├── dto/           # Objetos de transferencia de datos
├── exception/     # Manejo global de errores
├── mapper/        # MapStruct mappers
├── model/         # Entidades JPA (Usuario, Producto, Carrito, Orden, Comentario)
├── repositories/  # Spring Data repositories
└── service/       # Lógica de negocio + EmailService + JwtService
```

---

## Estructura del frontend

```
src/
├── components/    # Navbar, ProductoCard, CarritoItem, OrdenCard, ComentarioList, rutas protegidas, panel admin
├── context/       # AuthContext, CarritoContext
├── hooks/         # useForm
├── pages/         # LoginPage, RegistroPage, ProductosPage, ProductoDetallePage, CarritoPage, CheckoutPage, OrdenesPage, AdminPage
├── services/      # api (axios), auth, productos, carrito, ordenes, comentarios
└── types/         # Definiciones TypeScript
```

---

## Variables de entorno sensibles

> **No subir al repositorio** los valores reales de `application.properties`. Utilizar variables de entorno o un archivo `.env` ignorado por `.gitignore`.

Valores a proteger:
- `spring.datasource.password`
- `jwt.secret`
- `spring.mail.username` / `spring.mail.password`
