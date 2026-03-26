const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hr
    max: 5, // 5 registrations per IP
    message: { error: 'Límite de registros alcanzado. Intentá nuevamente más tarde.' }
});

// Get a single store with stats (for provider dashboard)
router.get('/', async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            include: { products: { include: { orders: true } } }
        });
        if (!stores.length) return res.json(null);

        const store = stores[0]; // Simple local dev defaulting
        let totalRevenue = 0;
        let totalOrders = 0;

        store.products.forEach(p => {
            p.orders.forEach(o => { totalRevenue += o.total; totalOrders += 1; });
        });

        res.json({
            ...store,
            stats: { revenue: totalRevenue, orders: totalOrders, visits: 1840, conversion: 1.74 }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching store info' });
    }
});

// Admin: Get all stores
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stores' });
    }
});

// Register a new store (from web landing)
router.post('/register', registerLimiter, async (req, res) => {
    try {
        const { name, email, password, cuit, razonSocial, telefono, website } = req.body;

        // Honeypot: if bot filled 'website', silently succeed and do nothing
        if (website) {
            return res.json({ status: 'ok', msg: 'Registro detectado (bot silenciado)' });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({ data: { email, password: hashedPassword, role: 'provider' } });
        }

        // Generate unique slug (append number if taken)
        let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let slug = baseSlug;
        let counter = 1;
        while (await prisma.store.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        const store = await prisma.store.create({
            data: {
                name,
                slug,
                cuit,
                razonSocial,
                telefono,
                active: false,
                verified: false,
                userId: user.id
            }
        });

        res.json(store);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe una tienda con ese nombre o email. Probá con otro nombre.' });
        }
        res.status(500).json({ error: 'Error al registrar la tienda. Intentá nuevamente.' });
    }
});

// Admin: Approve store
router.put('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
    try {
        const store = await prisma.store.update({
            where: { id: req.params.id },
            data: { active: true, verified: true }
        });
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: 'Error approving store' });
    }
});

// Admin: Deactivate store
router.put('/:id/deactivate', requireAuth, requireAdmin, async (req, res) => {
    try {
        const store = await prisma.store.update({
            where: { id: req.params.id },
            data: { active: false }
        });
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: 'Error deactivating store' });
    }
});

module.exports = router;
