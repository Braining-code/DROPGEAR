# DROP GEAR — Plataforma E-Commerce Multi-Tienda

> Marketplace de productos de calidad verificada. Compra directa, sin intermediarios, con páginas de aterrizaje dinámicas personalizadas por cada proveedor.

## 🚀 Estado Actual del Proyecto (MVP)

Actualmente, el proyecto cuenta con la **arquitectura Core y UI/UX completada al 80%**. 
Los motores de renderizado de la tienda pública, gestión de catálogo por proveedores y panel automático de administración están sólidos y en fase operativa para desarrollo.

### ✨ Funcionalidades Destacadas (Implementadas)
*   **Aterrizaje Dinámico de Productos**: Las páginas de productos no son genéricas. Cada proveedor puede elegir entre distintos Layouts estructurales (`Split`, `Full`, `Minimal`), personalizar los colores de acento y fondos, y aplicar familias tipográficas premium (`DM Sans`, `Playfair`, `Syne`, etc.).
*   **Soporte Multimedia y SEO**: Módulo principal (hero) del producto que soporta redacción para posicionamiento SEO y el anclaje nativo de un **Video Interactivo** introductorio.
*   **Gestión Integral de Galería**: Sistema fluido de subida múltiple de imágenes integrado asíncronamente con la API.
*   **Arquitectura de Upload Adaptable**: El guardado de archivos de los proveedores, implementado con un *Adapter Pattern* (`UploadService.js`), corre actualmente en *Modo Local* (listo para Railway Volumes / VPS). Posee la estructura armada y bloqueada en código para activar de inmediato **Cloudinary o AWS S3** inyectando sus credenciales.
*   **Sistema de Blogging (Marketing)**: Completo procesador Markdown CMS para que dueños y administradores publiquen artículos y noticias.

---

## 🛠️ Stack Tecnológico

El ecosistema es un monorepo hiper-enlazado utilizando *Turborepo* y manejado por `pnpm`.

| Módulo | Tecnología | Puerto | Descripción |
|---|---|---|---|
| **Marketplace Público** | React + Vite | `3000` | Front-end donde clientes exploran y compran. |
| **Provider Dashboard** | React + Vite | `3001` | Panel B2B para carga de contenido visual y de stock. |
| **Admin Panel** | React + Vite | `3002` | Panel superior para auditoría de plataformas. |
| **API REST Backend** | Node.js + Express | `4000` | Rutas de procesamiento y servicios orquestados. |
| **Motor de Base de Datos** | Prisma ORM + SQLite | `—` | Almacenamiento veloz de DEV. Fácil de escalar a PostgreSQL. |

---

## ⚙️ Primeros Pasos (Arranque Local)

Se requiere tener instalado [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io).

### 1. Variables de Entorno
Copia y configura las credenciales falsas/bases en la rama de la API:
```bash
cd shopping-api
cp .env.example .env
```
*(Puedes dejar los valores predeterminados de desarrollo para testear rápido).*

### 2. Iniciar y Poblar Base de Datos (Prisma)
Para estructurar las tablas y precargar la data ficticia (incluyendo al usuario administrador):
```bash
cd shopping-api
npx prisma db push          # Construye el esqueleto relacional en SQLite
node prisma/seed.js         # Genera el super-admin
node seed-marketplace.js    # Rellena escaparate con tiendas de ejemplo
```

### 3. Levantar la Flota (Concurrencia)
Desde la **raíz absoluta del directorio (`/shopping`)**, instala y ejecuta:
```bash
pnpm install
pnpm dev
```
> Esto levantará paralelamente los 3 puertos del front-end y el nodemon del back-end con HMR activo.

---

## 🔐 Autenticación de Desarrollo

Para ingresar directamente al BackOffice Administrativo (`localhost:3002`):
*   **Usuario Base:** `admin@dropgear.store` 
*   **Contraseña:** `dropgearadmin`

*(Cámbiese al pasar a infraestructura viva. Nuevos proveedores crean su cuenta mediante `/register` en el portal).*

---

## 🚧 Hoja de Ruta (Roadmap) hacia Producción

Las siguientes integraciones conforman el 20% bloqueante ("motor duro") requerido para su despliegue seguro al público:

- [ ] **Pasarela de Pagos Transaccional (ej. MercadoPago Checkout Pro)**: Implementación de enrutamiento al portal de pago y captura de firmas (webhooks).
- [ ] **Gestor de Envíos y Logística**: Lógica sólida en panel para asignar estados de seguimiento (`Preparando`, `En transito`) a las guías de correos privados.
- [ ] **Seguridad e Identidad**: Confirmación de emails cruzados y recuperación de claves JWT (Forgot Password / SendGrid).
- [ ] **Migración Efectiva del Storage a Cloud**: Sustituir el volumen local habilitando la variable `STORAGE_MODE=cloudinary` o S3.
- [ ] **Escalamiento de SQL**: Transicionar Prisma a motor PostgreSQL hospedado (Supabase/Railway/Neon).
