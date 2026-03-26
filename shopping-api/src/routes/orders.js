const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Admin: Get all orders
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { product: { include: { store: true } } }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching all orders' });
    }
});

// Get orders based on store/provider
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { product: true }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Create an order (fake checkout)
router.post('/', async (req, res) => {
    try {
        const { productId, qty, customerName, customerEmail } = req.body;
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const total = (product.price || 0) * (qty || 1);

        const order = await prisma.order.create({
            data: {
                productId,
                qty: parseInt(qty) || 1,
                total,
                customerName: customerName || 'Cliente Invitado',
                customerEmail: customerEmail || 'test@test.com',
                status: 'enviado'
            }
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating order' });
    }
});

module.exports = router;
