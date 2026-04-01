const fs = require('fs');
const path = require('path');

// ============================================================================
// SERVICIO DE SUBIDA DE IMÁGENES (LOCAL - RAILWAY)
// ============================================================================

// --- Configuración Local ---
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ⚠️ IMPORTANTE: usar siempre dominio público en producción
const LOCAL_BASE_URL =
  process.env.PUBLIC_URL
    ? `${process.env.PUBLIC_URL}/uploads`
    : 'http://localhost:4000/uploads';

// --- Guardado Local ---
const uploadToLocal = async (fileBuffer, originalName) => {
  const uniqueName =
    Date.now() +
    '-' +
    Math.round(Math.random() * 1e9) +
    path.extname(originalName);

  const destination = path.join(UPLOADS_DIR, uniqueName);

  fs.writeFileSync(destination, fileBuffer);

  return {
    url: `${LOCAL_BASE_URL}/${uniqueName}`,
    filename: uniqueName,
    originalname: originalName,
  };
};

// --- Función Principal ---
const uploadFile = async (file) => {
  // 🔥 FORZAMOS LOCAL (sin cloudinary)
  const STORAGE_MODE = process.env.STORAGE_MODE || 'local';

  if (STORAGE_MODE === 'local') {
    return await uploadToLocal(file.buffer, file.originalname);
  }

  // fallback (por si alguien cambia env)
  return await uploadToLocal(file.buffer, file.originalname);
};

module.exports = {
  uploadFile,
};
