const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: { error: 'Demasiados intentos de inicio de sesión, intente nuevamente más tarde.' }
});

router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { stores: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verify password. Note: seed users or old users might have plaintext passwords if they weren't hashed.
        // For a real app, always use bcrypt.compare. Since we just created password, we will mock for now or use bcrypt.
        let isValid = false;
        if (user.password) {
            // If our password starts with $2 it's bcrypt
            if (user.password.startsWith('$2')) {
                isValid = await bcrypt.compare(password, user.password);
            } else {
                isValid = (password === user.password);
            }
        }

        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role },
            stores: user.stores
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error durante el login' });
    }
});

// Get current user info middleware check
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { stores: true }
        });

        res.json({ user, stores: user.stores });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
