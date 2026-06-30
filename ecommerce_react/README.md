# Ecommerce Fullstack

Este proyecto representa una tienda en línea moderna, construida con React, TypeScript y Vite, pensada para ofrecer una experiencia de compra completa desde la navegación del catálogo hasta el proceso de pago y la gestión administrativa.

No es solo una interfaz bonita: es una aplicación con arquitectura de frontend clara, rutas protegidas, contexto global para autenticación y carrito, y una experiencia pensada para que el usuario se sienta inmerso desde el primer clic.

## Características principales

- Catálogo de productos con vista detallada
- Carrito de compras dinámico y persistente en la sesión del usuario
- Proceso de checkout con flujo orientado a la conversión
- Historial de órdenes para usuarios autenticados
- Sistema de login y registro con manejo de autenticación
- Panel administrativo para gestionar productos y órdenes
- Diseño modular con componentes reutilizables y estilos por componente
- Comunicación con un backend REST mediante Axios

## Tecnologías utilizadas

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS Modules para estilos encapsulados

## Estructura del proyecto

- src/components: componentes reutilizables de la interfaz
- src/pages: vistas principales de la aplicación
- src/context: manejo de autenticación y carrito con React Context
- src/services: integración con la API del backend
- src/types: modelos y tipos compartidos
- src/hooks: lógica reutilizable de formularios y estado

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre la aplicación en tu navegador en la URL que indique Vite.

## Scripts disponibles

- npm run dev: inicia el entorno de desarrollo
- npm run build: compila la aplicación para producción
- npm run preview: previsualiza el build generado
- npm run lint: ejecuta la revisión de código con ESLint

## Estado del proyecto

Este frontend está preparado para funcionar junto a un backend REST que expone productos, autenticación, carrito, órdenes y gestión administrativa. La arquitectura está organizada para escalar con facilidad y mantener una base sólida para futuras mejoras.

## Motivación

La idea detrás de este proyecto no era solo construir un ecommerce básico, sino demostrar cómo combinar una interfaz moderna, experiencia de usuario cuidada y una organización de código profesional en una sola aplicación.

