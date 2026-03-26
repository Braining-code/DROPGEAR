const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Slugify helper
function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ── GET /api/blog — public listing (published only) ───────────────────────────
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, title: true, slug: true, excerpt: true,
                thumbnailUrl: true, coverUrl: true, createdAt: true,
                author: { select: { email: true, role: true } },
            },
        });
        res.json(posts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error cargando posts' });
    }
});

// ── GET /api/blog/all — admin: todos (publicados + borradores) ────────────────
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, title: true, slug: true, excerpt: true,
                thumbnailUrl: true, coverUrl: true, published: true, createdAt: true,
                author: { select: { email: true } },
            },
        });
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: 'Error cargando posts' });
    }
});

// ── GET /api/blog/:slug — public single post ────────────────────────────────
router.get('/:slug', async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { slug: req.params.slug },
            include: { author: { select: { email: true } } },
        });
        // Allow access only if published
        if (!post || !post.published) return res.status(404).json({ error: 'Post no encontrado' });
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: 'Error cargando post' });
    }
});

// ── GET /api/blog/draft/:id — fetch any post for editing (admin) ───
router.get('/draft/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const post = await prisma.post.findUnique({ where: { id: req.params.id } });
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });

        res.json(post);
    } catch (e) {
        res.status(500).json({ error: 'Error cargando post' });
    }
});

// ── POST /api/blog — create post (admin) ─────────────────────────
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    const { title, excerpt, content, thumbnailUrl, coverUrl, published } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Título y contenido requeridos' });

    let slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    try {
        const post = await prisma.post.create({
            data: {
                title, slug, excerpt: excerpt || null,
                content, thumbnailUrl: thumbnailUrl || null, coverUrl: coverUrl || null,
                published: !!published,
                authorId: req.user.id,
            },
        });
        res.status(201).json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error creando post' });
    }
});

// ── PUT /api/blog/:id — editar post (admin) ──────────
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { title, excerpt, content, thumbnailUrl, coverUrl, published } = req.body;
    try {
        const postCheck = await prisma.post.findUnique({ where: { id: req.params.id } });
        if (!postCheck) return res.status(404).json({ error: 'Post no encontrado' });

        const data = {};
        if (title !== undefined) { data.title = title; data.slug = slugify(title); }
        if (excerpt !== undefined) data.excerpt = excerpt;
        if (content !== undefined) data.content = content;
        if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;
        if (coverUrl !== undefined) data.coverUrl = coverUrl;
        if (published !== undefined) data.published = !!published;

        const post = await prisma.post.update({ where: { id: req.params.id }, data });
        res.json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error actualizando post' });
    }
});

// ── DELETE /api/blog/:id — admin: eliminar post ──────────────────────────────
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const postCheck = await prisma.post.findUnique({ where: { id: req.params.id } });
        if (!postCheck) return res.status(404).json({ error: 'Post no encontrado' });
        await prisma.post.delete({ where: { id: req.params.id } });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: 'Error eliminando post' });
    }
});

module.exports = router;
