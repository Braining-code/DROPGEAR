const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
    console.log('Seeding data...');

    // ── 1. Admin user (idempotent) ───────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dropgear.store';
    const adminPass = process.env.ADMIN_PASSWORD || 'dropgearadmin';

    let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!adminUser) {
        const hashedAdmin = await bcrypt.hash(adminPass, 10);
        adminUser = await prisma.user.create({
            data: { email: adminEmail, password: hashedAdmin, role: 'admin' }
        });
        console.log(`✓ Admin creado → ${adminEmail} / ${adminPass}`);
    } else {
        console.log(`ℹ Admin ya existe → ${adminEmail}`);
    }

    // ── 2. Provider demo eliminado — registrar nuevos proveedores desde /register
    // ── 3. Store demo (idempotent) ───────────────────────────────────────────
    const existingStore = await prisma.store.findUnique({ where: { slug: 'gourmet-del-oeste' } });
    if (existingStore) {
        console.log('ℹ Tienda demo ya existe → /gourmet-del-oeste');
    } else {
        await prisma.store.create({
            data: {
                name: 'Gourmet del Oeste',
                slug: 'gourmet-del-oeste',
                verified: true,
                active: true,
                userId: adminUser.id,
                products: {
                    create: [
                        {
                            name: 'Gran Reserva Single Estate',
                            slug: 'gran-reserva',
                            category: 'Aceite de Oliva Extra Virgen',
                            tagline: 'Cosecha limitada de 2.400 botellas. Finca propia en Mendoza.',
                            description: 'Elaborado en frío a 18°C, con aceitunas arbequinas recolectadas a mano. Acidez: 0.12%. Polifenoles: 480 mg/kg.',
                            price: 8900,
                            subPrice: 7565,
                            layout: 'split',
                            fontId: 'dm',
                            primaryColor: '#C8472B',
                            bgColor: '#F7F3EC',
                            heroImageUrl: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=900&q=85',
                            videoUrl: '',
                            videoMode: 'video',
                            seoH2: 'Aceite de oliva extra virgen de Mendoza: del árbol a tu mesa',
                            seoBody: 'El Gran Reserva Single Estate es un aceite extra virgen producido a 1.100 metros en Mendoza. Acidez 0.12%, 480 mg/kg de polifenoles.\nElaborado exclusivamente con aceitunas arbequinas cosechadas a mano. Extracción en frío a 18°C preserva antioxidantes y aromas.\nIdeal en crudo sobre ensaladas, carnes y pescados. También como regalo gourmet premium.',
                            status: 'activo',
                        },
                        {
                            name: 'Malbec Reserva 2022',
                            slug: 'malbec-reserva-2022',
                            category: 'Vino Tinto',
                            tagline: 'Añejado en barricas de roble francés durante 12 meses.',
                            price: 6200,
                            layout: 'full',
                            fontId: 'playfair',
                            primaryColor: '#6B2D8B',
                            bgColor: '#1A0A2E',
                            heroImageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80',
                            status: 'activo',
                        },
                        {
                            name: 'Aceto Balsámico Añejo',
                            slug: 'aceto-balsamico',
                            category: 'Condimentos',
                            tagline: 'Añejado 12 años en barriles de madera.',
                            price: 4500,
                            layout: 'minimal',
                            fontId: 'cormorant',
                            primaryColor: '#2A4A2A',
                            bgColor: '#F5F2EE',
                            heroImageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&q=80',
                            status: 'activo',
                        }
                    ]
                }
            }
        });
        console.log('✓ Tienda demo creada → Gourmet del Oeste');
    }

    // ── 4. Blog posts demo (idempotent) ──────────────────────────────────────
    const existingPostsCount = await prisma.post.count();
    if (existingPostsCount > 0) {
        console.log(`ℹ Ya existen ${existingPostsCount} posts en el blog.`);
    } else {
        await prisma.post.createMany({
            data: [
                {
                    title: 'Top 5 Teclados Mecánicos Custom en 2026',
                    slug: 'top-5-teclados-mecanicos-custom-2026',
                    excerpt: 'Descubrí cuáles son los mejores teclados mecánicos customizados para armar el setup definitivo este año.',
                    content: '<h1>Top 5 Teclados Mecánicos Custom en 2026</h1><p>El mundo de los teclados mecánicos sigue evolucionando. En Drop Gear probamos los switches más codiciados del momento...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Auriculares In-Ear vs Over-Ear: ¿Cuál elegir para gaming competitivo?',
                    slug: 'in-ear-vs-over-ear-gaming',
                    excerpt: 'Analizamos las métricas de sonido, confort y precisión espacial para definir qué formato domina en los esports.',
                    content: '<h1>Auriculares In-Ear vs Over-Ear</h1><p>Históricamente, los over-ear han dominado el gaming, pero cada vez más pros cambian a in-ears (IEMs). ¿Por qué?</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1628205401986-e7e0d37e0c4f?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Mouse ultraligero: Guía de compra definitiva',
                    slug: 'mouse-ultraligero-guia-de-compra',
                    excerpt: 'Menos peso, más precisión. Todo lo que necesitas saber antes de comprar un mouse por debajo de los 60 gramos.',
                    content: '<h1>Mouse ultraligero: Guía de compra</h1><p>Los tiempos de los mouses pesados terminaron. Hoy la agilidad lo es todo...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1615663245857-ac931145a15a?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Armando el Setup Minimalista Perfecto',
                    slug: 'armando-el-setup-minimalista-perfecto',
                    excerpt: 'Menos es más. Componentes clave, manejo de cables e iluminación para un escritorio limpio y profesional.',
                    content: '<h1>Setup Minimalista</h1><p>Un espacio libre de distracciones aumenta la productividad y el enfoque...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Switches lineales vs táctiles: El debate infinito',
                    slug: 'switches-lineales-vs-tactiles',
                    excerpt: '¿Suavidad absoluta o feedback preciso? Comparamos los switches más populares del mercado actual.',
                    content: '<h1>Switches: Lineales vs Táctiles</h1><p>Gateron Yellows, Cherry MX Browns, Holy Pandas... la elección es personal, pero aquí te damos la teoría...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1511467687858-23d9ba7145b2?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Mousepads técnicos: Velocidad vs Control',
                    slug: 'mousepads-tecnicos-velocidad-vs-control',
                    excerpt: 'No cualquier pad sirve para cualquier juego. Aprende a elegir la superficie ideal para tu estilo de juego.',
                    content: '<h1>Mousepads Técnicos</h1><p>Las texturas cordura, superficies de vidrio y tela micro-tejida ofrecen distintas fricciones dinámicas y estáticas...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1612282130134-4b534b8c6e26?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Monitores OLED en el escritorio: ¿Valen la pena?',
                    slug: 'monitores-oled-escritorio',
                    excerpt: 'Probamos las últimas pantallas OLED orientadas al gaming para comprobar si el riesgo de burn-in justifica sus increíbles colores.',
                    content: '<h1>Monitores OLED en el escritorio</h1><p>Contraste infinito e inmersión total. La era OLED ha llegado a los monitores de PC...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Micrófonos USB vs XLR para streamers',
                    slug: 'microfonos-usb-vs-xlr',
                    excerpt: '¿Conviene la practicidad del USB o invertir en una interfaz de audio y micrófono XLR?',
                    content: '<h1>Micrófonos USB vs XLR</h1><p>La calidad de audio es fundamental para crear contenido...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Sillas ergonómicas recomendadas para 2026',
                    slug: 'sillas-ergonomicas-2026',
                    excerpt: 'Deja de usar tu silla gamer tipo racing y cuida tu espalda con estas alternativas premium de malla.',
                    content: '<h1>Sillas ergonómicas</h1><p>Las largas horas frente al monitor requieren un soporte lumbar adecuado. Adiós al cuero sintético caluroso...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                },
                {
                    title: 'Cómo mantener limpio tu Gear',
                    slug: 'como-mantener-limpio-tu-gear',
                    excerpt: 'Guía práctica para limpiar sensores, keycaps, mousepads y pantallas sin dañar tus dispositivos.',
                    content: '<h1>Cuidado y Limpieza del Gear</h1><p>El polvo, la grasa y el uso diario degradan los materiales. Te enseñamos a usar isopropílico de manera segura...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1584433305355-9cb73387fc61?w=800&q=80',
                    published: true,
                    authorId: adminUser.id,
                }
            ]
        });
        console.log('✓ 10 Posts de blog demo creados');
    }

    console.log('\n✅ Seed completado.');
    console.log('──────────────────────────────────────────');
    console.log(`Admin:    ${adminEmail}  /  ${adminPass}`);
    console.log('──────────────────────────────────────────');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
