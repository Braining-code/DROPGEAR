const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public home: only active products from active stores, sorted by featuredOrder
router.get('/public', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                status: 'activo',
                store: { active: true, verified: true }
            },
            include: { store: { select: { name: true, slug: true, verified: true, primaryColor: true } } },
            orderBy: [
                { featuredOrder: 'asc' },
                { createdAt: 'desc' },
            ],
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching public products' });
    }
});

// Admin: reorder products on the home page
router.put('/reorder', async (req, res) => {
    try {
        const { items } = req.body; // [{ id, order }]
        if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
        await Promise.all(
            items.map(({ id, order }) =>
                prisma.product.update({ where: { id }, data: { featuredOrder: order } })
            )
        );
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: 'Error reordering products' });
    }
});

// Get all products (internal/provider use)
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { store: true },
            orderBy: { featuredOrder: 'asc' },
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});


// Get a specific product by slug
router.get('/:slug', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug },
            include: { store: true },
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        // Block access if the store is not active
        if (!product.store?.active) {
            return res.status(403).json({ error: 'Esta tienda aún no ha sido aprobada.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { name, category, price, storeId, ...restData } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Check if store exists, if not we could use a default one for local dev
        let targetStoreId = storeId;
        if (!targetStoreId) {
            const store = await prisma.store.findFirst();
            if (!store) return res.status(400).json({ error: 'No stores available' });
            targetStoreId = store.id;
        }

        const validFields = ['subPrice', 'tagline', 'description', 'layout', 'fontId', 'primaryColor', 'bgColor', 'heroImageUrl', 'image2Url', 'image3Url', 'image4Url', 'videoUrl', 'videoTitle', 'videoSub', 'videoMode', 'gallery', 'seoH2', 'seoBody', 'status', 'badges', 'stats', 'faqs'];
        const otherData = {};
        for (const k of validFields) {
            if (restData[k] !== undefined) otherData[k] = restData[k];
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                slug,
                category,
                price: parseInt(price) || 0,
                storeId: targetStoreId,
                ...otherData
            }
        });
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating product' });
    }
});

// Update a product — only allow known Product fields
const PRODUCT_FIELDS = [
    'name', 'category', 'tagline', 'description', 'price', 'subPrice',
    'layout', 'fontId', 'primaryColor', 'bgColor', 'status', 'featuredOrder',
    'heroImageUrl', 'image2Url', 'image3Url', 'image4Url', 'gallery',
    'videoUrl', 'videoMode', 'videoPosterUrl', 'videoTitle', 'videoSub',
    'seoH2', 'seoBody', 'badges', 'stats', 'faqs',
];

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const raw = req.body;

        // Filter to only valid schema fields
        const updateData = {};
        for (const key of PRODUCT_FIELDS) {
            if (raw[key] !== undefined && raw[key] !== null) {
                updateData[key] = raw[key];
            }
            // Allow explicit null for image fields (to clear them)
            if (['heroImageUrl', 'image2Url', 'image3Url', 'image4Url', 'videoUrl'].includes(key) && raw[key] === null) {
                updateData[key] = null;
            }
        }

        if (updateData.price !== undefined) updateData.price = parseInt(updateData.price) || 0;
        if (updateData.subPrice !== undefined) updateData.subPrice = parseInt(updateData.subPrice) || null;

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
        });
        res.json(product);
    } catch (error) {
        console.error('[PUT /products/:id] Error:', error.message);
        res.status(500).json({ error: 'Error updating product', detail: error.message });
    }
});

module.exports = router;
