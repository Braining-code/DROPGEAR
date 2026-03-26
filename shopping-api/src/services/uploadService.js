const fs = require('fs');
const path = require('path');

// ============================================================================
// SERVICIO DE SUBIDA DE IMÁGENES (UPLOAD SERVICE)
// ============================================================================
// Actualmente configurado para: LOCAL DISK STORAGE (Railway Volume / PC)
// Pendiente de migración a: CLOUDINARY / AWS S3
// ============================================================================

// --- Configuración Local (Activa) ---
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const LOCAL_BASE_URL = process.env.PUBLIC_URL || 'http://localhost:4000/uploads';

// Adaptador 1: Guardado Local (El que estamos usando ahora)
const uploadToLocal = async (fileBuffer, originalName) => {
  const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(originalName);
  const destination = path.join(UPLOADS_DIR, uniqueName);
  
  fs.writeFileSync(destination, fileBuffer);
  
  return {
    url: `${LOCAL_BASE_URL}/${uniqueName}`,
    filename: uniqueName,
    originalname: originalName
  };
};

// Adaptador 2: Guardado Nube (Cloudinary)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'dropgear',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          filename: result.public_id,
          originalname: originalName
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// --- Función Principal ---
const uploadFile = async (file) => {
  // Para produccion (Railway), el modo base ahora es 'cloudinary'
  const STORAGE_MODE = process.env.STORAGE_MODE || 'cloudinary'; // 'local' | 'cloudinary'

  if (STORAGE_MODE === 'cloudinary') {
    return await uploadToCloudinary(file.buffer, file.originalname);
  }

  return await uploadToLocal(file.buffer, file.originalname);
};

module.exports = {
  uploadFile
};
