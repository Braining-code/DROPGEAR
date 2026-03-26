DROP GEAR — Plataforma E-Commerce Multi-Tienda
Marketplace de productos de calidad verificada. Compra directa, sin intermediarios, con páginas de aterrizaje dinámicas personalizadas por cada proveedor.

🚀 Estado Actual del Proyecto (PRODUCCIÓN LISTA)
Actualmente, el código cuenta con la arquitectura Core, UI/UX y Hardening de Producción completados. Los motores de renderizado de la tienda pública, gestión de catálogo por proveedores y panel automático de administración están listos para su despliegue en contenedores efímeros (Railway).

✨ Funcionalidades Destacadas
Aterrizaje Dinámico de Productos: Páginas personalizadas con Layouts estructurales (Split, Full, Minimal), colores de acento y tipografías premium (DM Sans, Playfair, Syne).
Guest Checkout Dinámico: Flujo de compra por contrareembolso/coordinación de pago súper optimizado y veloz, manejado por un CartContext global y subidas asíncronas de órdenes.
Gestión Integral de Galería a la Nube: Sistema de subida de imágenes conectado nativamente a Cloudinary (vía multer-storage-cloudinary), descartando por completo el almacenamiento local.
Sistema de Blogging (Marketing): Procesador Markdown CMS para publicar artículos y noticias visible desde la tienda principal.
🛠️ Stack Tecnológico Delineado para Railway
El ecosistema es un monorepo manejado por pnpm compuesto por los siguientes servicios:

Módulo	Tecnología	Variables Clave Requeridas
Marketplace Público	React + Vite	VITE_API_URL apuntando al backend público.
Provider Dashboard	React + Vite	VITE_API_URL apuntando al backend público.
Admin Panel	React + Vite	VITE_API_URL apuntando al backend público.
API REST Backend	Node.js + Express	ALLOWED_ORIGINS para validación CORS.
Motor de Base de Datos	Prisma + PostgreSQL	DATABASE_URL vinculada a DB remota.
⚙️ Reglas de Despliegue Actual (Hardening Aplicado)
Variables de Entorno Activas:

Todo llamado estático hacia localhost fue erradicado. Los frontends leen VITE_API_URL.
El Backend lee de manera dinámica process.env.PORT y escucha explícitamente en IP 0.0.0.0.
Posee un endpoint de latido (GET /health) en la raíz del API.
Inicialización e Idempotencia (Prisma):

El motor principal ya no es SQLite, es nativamente PostgreSQL.
Los scripts iniciales (

seed.js
) están construidos con bloques condicionales (Upsert o find-and-skip) siendo 100% idempotentes (seguros de correr múltiples veces en los deploys).
🚧 Hoja de Ruta (Roadmap) Restante
✅ (COMPLETADO) Migración Efectiva del Storage a Cloud (Cloudinary). ✅ (COMPLETADO) Escalamiento de SQL (Migración total a PostgreSQL). ✅ (COMPLETADO) Flujo MVP de Cajas y Carrito Sin-Registro.

 Pasarela de Pagos Transaccional (MercadoPago): Reemplazar el método de "Pago a Coordinar" actual por firmas JWT y webhooks formales.
 Gestor de Envíos y Logística: Lógica en panel para asignar la guía de correo.
 Emailing Transaccional: Incorporar SendGrid o Resend para confirmación de órdenes al cliente y recuperación de claves.
(Sabiendo que esta es mi documentación final, por favor dame instrucciones explícitas de qué Comandos debe ejecutar Railway para construir y servir cada frontend Vite de forma estática).
