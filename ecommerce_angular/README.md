# Ecommerce Fullstack — Frontend

Aplicación de comercio electrónico desarrollada con **Angular 22**, que consume una API REST construida con **Spring Boot**. El sistema contempla el ciclo completo de una tienda en línea: navegación de productos, gestión de carrito, proceso de checkout, historial de órdenes, confirmación de cuenta por correo electrónico y un panel de administración con control total sobre el catálogo y los pedidos.

---

## Tabla de contenidos

- [Descripcion general](#descripcion-general)
- [Tecnologias y decisiones de arquitectura](#tecnologias-y-decisiones-de-arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modulo de autenticacion](#modulo-de-autenticacion)
- [Proteccion de rutas](#proteccion-de-rutas)
- [Flujo de compra](#flujo-de-compra)
- [Panel de administracion](#panel-de-administracion)
- [Comunicacion con el backend](#comunicacion-con-el-backend)
- [Puesta en marcha](#puesta-en-marcha)

---

## Descripcion general

La aplicacion distingue dos perfiles de usuario:

- **Usuario autenticado**: puede explorar el catalogo, agregar productos al carrito, completar una orden con direccion y telefono, y consultar su historial de pedidos con sus estados actualizados en tiempo real.
- **Administrador**: accede a un panel exclusivo desde el cual puede crear, editar y eliminar productos, cargar imagenes asociadas a cada uno, y gestionar el estado de todas las ordenes registradas en el sistema.

Ambos perfiles conviven en la misma aplicacion, separados por guardias de ruta y roles decodificados del token JWT emitido por el servidor.

---

## Tecnologias y decisiones de arquitectura

| Tecnologia | Version | Rol en el proyecto |
|---|---|---|
| Angular | 22 | Framework principal |
| Angular Signals | nativo | Estado reactivo sin RxJS en la capa de UI |
| RxJS | nativo | Comunicacion HTTP y composicion de observables |
| Angular Router | nativo | Navegacion y lazy loading de modulos |
| Reactive Forms | nativo | Formularios con validacion declarativa |
| JWT (client-side) | — | Autenticacion stateless, decodificacion manual del payload |

**Signals como estado reactivo**: en lugar de servicios basados en `BehaviorSubject`, el estado local de cada componente se gestiona con `signal()` y `computed()`. Esto reduce la verbosidad del codigo y permite que Angular optimice el ciclo de deteccion de cambios de forma granular.

**Lazy loading**: las rutas protegidas (`/carrito`, `/checkout`, `/ordenes`, `/admin`) se cargan bajo demanda con `loadComponent`. El bundle inicial que el usuario descarga es minimo; los modulos de administracion solo se transfieren si el usuario posee el rol correspondiente.

**Interceptor JWT**: un `HttpInterceptorFn` funcional adjunta automaticamente el token de autorizacion a cada peticion HTTP saliente, sin necesidad de gestionar cabeceras de forma manual en cada servicio.

---

## Estructura del proyecto

```
src/app/
|-- components/
|   `-- navbar/              # Barra de navegacion global con badge de carrito
|-- guards/
|   |-- auth.guard.ts        # Protege rutas que requieren sesion activa
|   `-- admin.guard.ts       # Protege rutas que requieren rol ADMIN
|-- interceptors/
|   `-- jwt.interceptors.ts  # Adjunta el Bearer token a cada peticion HTTP
|-- models/                  # Interfaces TypeScript que espejan los DTOs del backend
|-- pages/
|   |-- productos/           # Catalogo paginado de productos
|   |-- producto-detalle/    # Ficha de producto con comentarios y puntuaciones
|   |-- carrito/             # Gestion del carrito de compras
|   |-- checkout/            # Formulario de envio y confirmacion de orden
|   |-- ordenes/             # Historial de pedidos del usuario
|   |-- login/               # Inicio de sesion
|   |-- registro/            # Registro de nueva cuenta
|   |-- confirmar-email/     # Verificacion de cuenta por codigo de correo
|   `-- admin/
|       |-- admin.ts         # Layout con sidebar de navegacion del panel
|       |-- productos/       # CRUD completo de productos con carga de imagenes
|       `-- ordenes/         # Vista y actualizacion de estado de todas las ordenes
`-- services/                # Capa de acceso a la API REST
```

---

## Modulo de autenticacion

El proceso de autenticacion sigue el siguiente flujo:

1. El usuario se registra con email y contraseña. El backend genera un codigo de confirmacion y lo envia por correo.
2. El usuario ingresa el codigo en la pagina `/confirmar-email`. La cuenta queda activa.
3. Al iniciar sesion, el backend emite un **JWT**. El frontend lo almacena en `localStorage`, decodifica el payload de forma manual (`base64` sobre el segundo segmento) y extrae el `email` y el `rol` (`ROLE_USER` / `ROLE_ADMIN`).
4. La sesion se persiste entre recargas: `AuthService` inicializa su `signal` leyendo `localStorage` en el momento de construccion del servicio.
5. Al cerrar sesion, se eliminan el token y los datos del usuario de `localStorage` y se limpia el estado local del carrito.

---

## Proteccion de rutas

| Ruta | Guard aplicado | Comportamiento si no cumple |
|---|---|---|
| `/carrito` | `authGuard` | Redirige a `/login` |
| `/checkout` | `authGuard` | Redirige a `/login` |
| `/ordenes` | `authGuard` | Redirige a `/login` |
| `/admin/**` | `adminGuard` | Sin sesion: `/login`. Con sesion sin rol ADMIN: `/productos` |

El `adminGuard` distingue dos casos de acceso no autorizado: un usuario no autenticado que intenta acceder directamente por URL, y un usuario autenticado sin privilegios suficientes. Cada caso recibe una redireccion diferente.

---

## Flujo de compra

```
[Catalogo] --> [Detalle de producto] --> [Agregar al carrito]
                                                |
                                         [Carrito]
                                                |
                                         [Checkout]
                                     (direccion + telefono)
                                                |
                                     [Orden creada en backend]
                                                |
                            [Historial de ordenes] (orden nueva destacada)
```

El `CarritoService` utiliza `forkJoin` para enriquecer cada item del carrito con los datos completos del producto correspondiente, realizando las peticiones en paralelo. El total y la cantidad de items son valores `computed` que se recalculan automaticamente ante cualquier cambio en el signal de items.

---

## Panel de administracion

Accesible en `/admin` exclusivamente para usuarios con rol `ADMIN`. Cuenta con una barra lateral de navegacion propia que diferencia visualmente esta seccion del resto de la aplicacion.

**Gestion de productos**

- Creacion y edicion de productos mediante un formulario reactivo con validaciones.
- Carga de imagen asociada mediante `FormData` con un `Blob` JSON para el objeto producto.
- La tabla de productos resalta en tiempo real la fila del producto que esta siendo editado.
- Eliminacion con confirmacion previa del navegador.

**Gestion de ordenes**

- Vista de todas las ordenes registradas en el sistema con datos del usuario, direccion y total calculado.
- Actualizacion de estado (`PREPARANDO`, `ENTREGANDO`, `ENTREGADO`, `CANCELADO`) mediante un `select` vinculado con `ngModel`. Cada cambio dispara una peticion `PATCH` al backend y actualiza unicamente la orden afectada en el signal, sin recargar la lista completa.

---

## Comunicacion con el backend

El backend debe estar corriendo en `http://localhost:8080`. Todos los servicios apuntan a esa URL base.

| Servicio | Endpoints principales |
|---|---|
| `AuthService` | `POST /api/auth/login`, `/registrar`, `/confirmar-email` |
| `ProductoService` | `GET /api/productos`, `GET /api/productos/:id`, `POST`, `PUT`, `DELETE` |
| `CarritoService` | `GET /api/carrito`, `POST /api/carrito/agregar`, `DELETE /api/carrito/:id` |
| `OrdenService` | `POST /api/ordenes`, `GET /api/ordenes/mis-ordenes`, `GET /api/ordenes/todas`, `PATCH /api/ordenes/:id/estado` |
| `ComentarioService` | `GET /api/comentarios/:productoId`, `POST /api/comentarios/:productoId` |

---

## Puesta en marcha

**Requisitos**

- Node.js 18 o superior
- Angular CLI 22

**Instalacion de dependencias**

```bash
npm install
```

**Servidor de desarrollo**

```bash
ng serve
```

La aplicacion estara disponible en `http://localhost:4200`. Es necesario que el backend Spring Boot este activo en el puerto `8080` antes de interactuar con cualquier funcionalidad que requiera datos.

**Build de produccion**

```bash
ng build
```

Los artefactos compilados se generan en el directorio `dist/`. El build de produccion aplica optimizaciones de tree-shaking, minificacion y lazy loading automatico sobre las rutas configuradas.

---

> Proyecto desarrollado como parte de un sistema fullstack. El repositorio del backend (Spring Boot + Spring Security + JPA) se encuentra en el directorio hermano `ecommerce_spring` del mismo monorepo.
