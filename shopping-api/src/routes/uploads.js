const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../services/uploadService');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname || mimetype) cb(null, true);
    else cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif) y videos (mp4, mov).'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// POST /api/uploads — sube un archivo y devuelve la URL (Local o Cloud)
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });
        
        // Pasa el búfer del archivo al servicio agnóstico
        const result = await uploadFile(req.file);
        res.json(result);
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Fallo al procesar o subir el archivo.' });
    }
});

module.exports = router;
