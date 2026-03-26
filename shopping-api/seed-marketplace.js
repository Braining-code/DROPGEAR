// seed-marketplace.js — 5 tiendas con fotos reales
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function upsertUser(email) {
    const ex = await prisma.user.findUnique({ where: { email } });
    if (ex) return ex;
    return prisma.user.create({ data: { email, password: await bcrypt.hash('provider1234', 10), role: 'provider' } });
}

async function upsertStore(data) {
    const ex = await prisma.store.findUnique({ where: { slug: data.slug } });
    if (ex) return prisma.store.update({ where: { slug: data.slug }, data });
    return prisma.store.create({ data });
}

async function upsertProduct(data) {
    const ex = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (ex) return prisma.product.update({ where: { slug: data.slug }, data });
    return prisma.product.create({ data });
}

const J = (v) => JSON.stringify(v);

// Unsplash helper — returns a direct CDN URL
const img = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format&fit=crop`;

async function main() {
    console.log('\n🛍️  Seeding marketplace...\n');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1. VOLT RIDE — Movilidad eléctrica
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const voltUser = await upsertUser('hola@voltride.com.ar');
    const volt = await upsertStore({
        name: 'Volt Ride', slug: 'volt-ride', verified: true, active: true,
        primaryColor: '#00C896', bgColor: '#0A0E14', fontId: 'syne', userId: voltUser.id,
    });

    // Monopatín eléctrico Dualtron Thunder 2
    await upsertProduct({
        name: 'Dualtron Thunder 2', slug: 'dualtron-thunder-2',
        category: 'Monopatines Eléctricos',
        tagline: 'El rey de la movilidad urbana. 6640W de pura potencia.',
        description: 'Motor dual de 6640W, batería de 72V 35Ah, suspensión hidráulica de doble émbolo, frenos hidráulicos Zoom y pantalla TFT a color. Autonomía 120km. Para quienes no aceptan límites.',
        price: 4200000, subPrice: 3700000, layout: 'full', fontId: 'syne',
        primaryColor: '#00C896', bgColor: '#0A0E14',
        // Monopatín eléctrico urbano
        heroImageUrl: img('1558618666-fcd25c85cd64'),
        image2Url: img('1622737133809-d95047b9e673', 900),
        image3Url: img('1473506839233-189405a2da83', 900),
        image4Url: img('1571068316344-75bc76f77890', 900),
        status: 'activo', featuredOrder: 1, storeId: volt.id,
        seoH2: 'Dualtron Thunder 2 — El monopatín eléctrico más potente del mundo',
        seoBody: 'El Dualtron Thunder 2 redefine lo que un scooter eléctrico puede hacer.\nCon 6640W de potencia combinada y suspensión hidráulica de alta gama, dominás cualquier terreno.\nBatería de 72V con autonomía real de hasta 120km en modo ECO.\nFreno hidráulico trasero y delantero para detención de emergencia segura a alta velocidad.',
        badges: J(['Motor Dual 6640W', 'Autonomía 120km', 'Frenos Hidráulicos', 'Pantalla TFT', 'IP54 Resistente al agua']),
        stats: J([{ value: '6640W', label: 'Potencia' }, { value: '120km', label: 'Autonomía' }, { value: '75km/h', label: 'Vel. Máx.' }, { value: '72V', label: 'Batería' }]),
        faqs: J([
            { q: '¿Necesita registro o licencia?', a: 'En Argentina no se requiere licencia especial para monopatines eléctricos. Siempre usá casco y equipo de protección.' },
            { q: '¿Cuánto tarda la carga completa?', a: 'Con el cargador estándar: 8-10hs. Con el cargador rápido opcional: 4-5hs.' },
            { q: '¿Tiene garantía?', a: '12 meses por defectos de fabricación. Cobertura nacional con técnicos certificados.' },
        ]),
    });

    await upsertProduct({
        name: 'Dualtron Storm 2', slug: 'dualtron-storm-2',
        category: 'Monopatines Eléctricos',
        tagline: 'Potencia contenida. Control total. El equilibrio perfecto.',
        description: 'Motor dual de 5000W, 85km/h de velocidad máxima, control de crucero, pantalla TFT full-color y luces LED integradas. La opción premium para el commuter exigente.',
        price: 2950000, subPrice: 2600000, layout: 'split', fontId: 'syne',
        primaryColor: '#00C896', bgColor: '#0A0E14',
        heroImageUrl: img('1622737133809-d95047b9e673'),
        image2Url: img('1558618666-fcd25c85cd64', 900),
        image3Url: img('1571068316344-75bc76f77890', 900),
        status: 'activo', featuredOrder: 2, storeId: volt.id,
        seoH2: 'Dualtron Storm 2 — Velocidad premium para la ciudad moderna',
        seoBody: 'El Storm 2 es el monopatín ideal para quienes quieren alto rendimiento sin sacrificar practicidad.\nPliega en segundos, sube en ascensores y llega a 85km/h cuando abrís la ruta.\nControlá todo desde la pantalla TFT: modo, velocidad, autonomía restante y temperatura del motor.',
        badges: J(['Motor 5000W', '85km/h Vel. Máx.', 'Control de Crucero', 'Plegable Premium', 'Luces LED']),
        stats: J([{ value: '5000W', label: 'Potencia' }, { value: '90km', label: 'Autonomía' }, { value: '85km/h', label: 'Vel. Máx.' }, { value: '35kg', label: 'Peso' }]),
        faqs: J([
            { q: '¿Es apto para subidas pronunciadas?', a: 'Sí, con doble motor puede subir pendientes de hasta 45°.' },
            { q: '¿Qué incluye la entrega?', a: 'Monopatín, cargador, manual, kit de herramientas básico y bolso de transporte.' },
        ]),
    });

    await upsertProduct({
        name: 'Casco Pro Rider V2', slug: 'casco-pro-rider-v2',
        category: 'Seguridad',
        tagline: 'Certificado CE. Porque lo que protegés no tiene precio.',
        description: 'Casco integral con lente tintado anti-UV, ventilación activa con 8 canales, interior desmontable lavable y certificación CE EN 1078.',
        price: 185000, layout: 'split', fontId: 'syne',
        primaryColor: '#00C896', bgColor: '#0A0E14',
        heroImageUrl: img('1558618047-3c8c76ca7d13'),
        status: 'activo', featuredOrder: 15, storeId: volt.id,
        badges: J(['Certificado CE', 'Lente Anti-UV', 'Interior Lavable', '8 Canales Ventilación']),
        stats: J([{ value: 'CE EN1078', label: 'Certificación' }, { value: '680g', label: 'Peso' }, { value: 'S-XL', label: 'Tallas' }, { value: 'ABS', label: 'Material' }]),
        faqs: J([{ q: '¿Tiene visera intercambiable?', a: 'Sí, incluye lente transparente y tintado. Repuestos disponibles en nuestro local.' }]),
    });

    await upsertProduct({
        name: 'Kit Iluminación Ride 360°', slug: 'kit-iluminacion-ride-360',
        category: 'Accesorios',
        tagline: 'Sé visible de noche. Sin miedo.',
        description: 'Luz delantera 1200 lúmenes + trasera con detección de frenado automático + luces laterales RGB. Instalación sin herramientas. Resistente al agua IPX5.',
        price: 68000, layout: 'minimal', fontId: 'syne',
        primaryColor: '#00C896', bgColor: '#0A0E14',
        heroImageUrl: img('1473506839233-189405a2da83'),
        status: 'activo', featuredOrder: 16, storeId: volt.id,
        badges: J(['1200 Lúmenes', 'Freno Automático', 'RGB Lateral', 'IPX5 Impermeable']),
        stats: J([{ value: '1200lm', label: 'Luminosidad' }, { value: 'IPX5', label: 'Protección' }, { value: '8hs', label: 'Batería' }, { value: 'USB-C', label: 'Carga' }]),
        faqs: J([{ q: '¿Es compatible con todos los modelos?', a: 'Sí, el sistema de sujeción universal es compatible con cualquier monopatín.' }]),
    });
    console.log('✓ Volt Ride — 4 productos');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2. BINARY LABS — Gaming & Computación + iPhone
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const binaryUser = await upsertUser('hola@binarylabs.com.ar');
    const binary = await upsertStore({
        name: 'Binary Labs', slug: 'binary-labs', verified: true, active: true,
        primaryColor: '#7C3AED', bgColor: '#09090B', fontId: 'bebas', userId: binaryUser.id,
    });

    // iPhone 15 Pro Max
    await upsertProduct({
        name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max',
        category: 'Smartphones',
        tagline: 'Titanio. A17 Pro. 5x Zoom. El iPhone más pro de la historia.',
        description: 'Chasis de titanio de grado aeroespacial, chip A17 Pro con GPU de 6 núcleos, cámara principal 48MP con zoom 5x, Dynamic Island y USB-C 3.0. 256GB.',
        price: 2800000, subPrice: 2550000, layout: 'split', fontId: 'bebas',
        primaryColor: '#7C3AED', bgColor: '#09090B',
        heroImageUrl: img('1592899677977-9c10ca588bbd'),
        image2Url: img('1510557880182-3d4d3cba35a5', 900),
        image3Url: img('1511707171634-5f897ff02aa9', 900),
        image4Url: img('1565849904461-04a58ad377e0', 900),
        status: 'activo', featuredOrder: 3, storeId: binary.id,
        seoH2: 'iPhone 15 Pro Max — La experiencia Apple definitiva en Argentina',
        seoBody: 'El iPhone 15 Pro Max es el smartphone más avanzado de Apple con su diseño de titanio de grado aeroespacial.\nEl chip A17 Pro es el primero en proceso de 3nm — 20% más rápido y 50% más eficiente que la generación anterior.\nCámara de 48MP con zoom óptico 5x y modo ProRes video en 4K/60fps.',
        badges: J(['Titanio Aeroespacial', 'A17 Pro Chip', 'Cámara 48MP 5x Zoom', '256GB', 'USB-C 3.0', 'Dynamic Island']),
        stats: J([{ value: 'A17 Pro', label: 'Chip' }, { value: '48MP', label: 'Cámara' }, { value: '5x', label: 'Zoom Óptico' }, { value: '256GB', label: 'Storage' }]),
        faqs: J([
            { q: '¿Es liberado de fábrica?', a: 'Sí, es versión internacional desbloqueada. Funciona con cualquier operadora argentina (Claro, Personal, Movistar).' },
            { q: '¿Incluye cargador?', a: 'Incluye cable USB-C a USB-C. El cargador de 20W se vende por separado (como en Apple Store oficial).' },
            { q: '¿Tiene garantía?', a: '12 meses de garantía técnica con soporte en Buenos Aires. AppleCare disponible.' },
        ]),
    });

    await upsertProduct({
        name: 'Alienware Aurora R16', slug: 'alienware-aurora-r16',
        category: 'PCs Gaming',
        tagline: 'La PC gaming definitiva. RTX 4090. Sin excusas.',
        description: 'Intel Core i9-14900KF, NVIDIA GeForce RTX 4090 24GB GDDR6X, 64GB DDR5 5600MHz, SSD NVMe 2TB Gen4. Refrigeración líquida 360mm.',
        price: 9800000, subPrice: 8900000, layout: 'full', fontId: 'bebas',
        primaryColor: '#7C3AED', bgColor: '#09090B',
        heroImageUrl: img('1593652988951-7b636f798a99'),
        image2Url: img('1593642632559-0c6d3fc62b89', 900),
        image3Url: img('1612287889822-38a3c53a5e96', 900),
        status: 'activo', featuredOrder: 4, storeId: binary.id,
        seoH2: 'Alienware Aurora R16 — El poder definitivo para gaming de alto nivel',
        seoBody: 'Construida para dominar los títulos más exigentes del mercado.\nRTX 4090 con 24GB de VRAM para resolución 4K y ray tracing en máximos sin concesiones.\nChasis Alienware con gestión térmica de doble cámara y luces AlienFX personalizables.',
        badges: J(['RTX 4090 24GB', 'i9-14900KF', '64GB DDR5', '2TB NVMe Gen4', 'Líquida 360mm', 'Garantía 2 años']),
        stats: J([{ value: 'RTX 4090', label: 'GPU' }, { value: 'i9-14900KF', label: 'CPU' }, { value: '64GB DDR5', label: 'RAM' }, { value: '300fps', label: '4K Gaming' }]),
        faqs: J([
            { q: '¿Viene lista para usar?', a: 'Sí, incluye Windows 11 Pro con drivers y software Alienware preinstalados.' },
            { q: '¿Qué garantía tiene?', a: '2 años de garantía on-site (el técnico va a tu domicilio). Soporte 24/7.' },
        ]),
    });

    await upsertProduct({
        name: 'LG UltraGear 27" OLED 240Hz', slug: 'lg-ultragear-27-oled',
        category: 'Monitores',
        tagline: 'OLED 4K a 240Hz. El monitor que no sabías que necesitabas.',
        description: 'Panel OLED 4K, 240Hz, 0.03ms de tiempo de respuesta, G-Sync y AMD FreeSync Premium Pro. DCI-P3 99% de cobertura de color.',
        price: 1850000, subPrice: 1650000, layout: 'split', fontId: 'bebas',
        primaryColor: '#7C3AED', bgColor: '#09090B',
        heroImageUrl: img('1527443224154-c4a3942d3acf'),
        image2Url: img('1593642632559-0c6d3fc62b89', 900),
        status: 'activo', featuredOrder: 5, storeId: binary.id,
        badges: J(['OLED 4K', '240Hz', '0.03ms', 'G-Sync + FreeSync', 'HDR 1000', 'USB-C 90W']),
        stats: J([{ value: '3840×2160', label: 'Resolución' }, { value: '240Hz', label: 'Refresh' }, { value: '0.03ms', label: 'Response' }, { value: 'DCI P3 99%', label: 'Color' }]),
        faqs: J([
            { q: '¿Compatible con PS5 y Xbox?', a: 'Sí, mediante HDMI 2.1. Muestra 4K@120Hz desde consolas.' },
            { q: '¿El panel OLED sufre burn-in?', a: 'LG ofrece cobertura específica por burn-in en los primeros 3 años.' },
        ]),
    });

    await upsertProduct({
        name: 'Keychron Q1 Pro Mechanical', slug: 'keychron-q1-pro',
        category: 'Teclados',
        tagline: 'Aluminio CNC. Triple conectividad. Sin compromisos.',
        description: 'Compact 75%, cuerpo de aluminio CNC macizo, switches hot-swappable, RGB por tecla, Bluetooth 5.1 / USB-C / 2.4GHz.',
        price: 420000, layout: 'split', fontId: 'bebas',
        primaryColor: '#7C3AED', bgColor: '#09090B',
        heroImageUrl: img('1618384887929-16ec33fab9ef'),
        image2Url: img('1587829741301-dc798b83add3', 900),
        status: 'activo', featuredOrder: 6, storeId: binary.id,
        badges: J(['Aluminio CNC', 'Hot-Swap', 'Triple Modo', 'RGB Per-Key', 'Gasket Mount']),
        stats: J([{ value: '75%', label: 'Layout' }, { value: '2.4GHz/BT/USB', label: 'Conectividad' }, { value: 'Gasket', label: 'Montaje' }, { value: '4000mAh', label: 'Batería' }]),
        faqs: J([
            { q: '¿Se pueden cambiar los switches?', a: 'Sí, es hot-swappable. Podés poner cualquier switch de 3 o 5 pines sin soldadura.' },
        ]),
    });

    await upsertProduct({
        name: 'Logitech G Pro X Superlight 2', slug: 'logitech-gpro-superlight-2',
        category: 'Mouse Gamer',
        tagline: '60g. Sensor HERO 2. Inalámbrico. Perfección.',
        description: 'El mouse wireless más liviano para gaming competitivo. Sensor HERO 2 con 32000 DPI, 60g de peso, LIGHTSPEED a 1ms de latencia.',
        price: 195000, layout: 'minimal', fontId: 'bebas',
        primaryColor: '#7C3AED', bgColor: '#09090B',
        heroImageUrl: img('1527864550417-7fd91fc51a46'),
        status: 'activo', featuredOrder: 7, storeId: binary.id,
        badges: J(['60g Ultra-Liviano', '32000 DPI', '1ms LIGHTSPEED', '95hs Batería', 'PTFE Premium']),
        stats: J([{ value: '60g', label: 'Peso' }, { value: '32K DPI', label: 'Sensor' }, { value: '1ms', label: 'Latencia' }, { value: '95hs', label: 'Batería' }]),
        faqs: J([{ q: '¿Es simétrico?', a: 'Diseñado para diestros, forma ergonómica standard.' }]),
    });

    await upsertProduct({
        name: 'SteelSeries Arctis Nova Pro', slug: 'steelseries-arctis-nova-pro',
        category: 'Auriculares',
        tagline: 'Hi-Fi gaming. ANC. 44hs. El audio que merecés.',
        description: 'Drivers de titanio de 40mm, cancelación activa de ruido, DAC USB-C incluido, batería de 44hs con sistema dual de baterías intercambiables.',
        price: 385000, layout: 'split', fontId: 'bebas',
        primaryColor: '#7C3AED', bgColor: '#09090B',
        heroImageUrl: img('1505740420928-5e560c06d30e'),
        image2Url: img('1484704849700-f032a568e944', 900),
        status: 'activo', featuredOrder: 8, storeId: binary.id,
        badges: J(['Drivers Titanio', 'ANC Activa', '44hs Batería', 'DAC USB-C Incluido', 'Hi-Res Audio']),
        stats: J([{ value: '40mm Ti', label: 'Drivers' }, { value: '44hs', label: 'Batería' }, { value: 'ANC + Ambiente', label: 'Modos' }, { value: '2.4GHz/BT/USB', label: 'Conexión' }]),
        faqs: J([
            { q: '¿Es compatible con PS5/Xbox?', a: 'Sí, mediante USB-C directo o con el DAC incluido.' },
            { q: '¿Cómo funciona la batería dual?', a: 'Incluye dos baterías. Mientras usás una, cargás la otra.' },
        ]),
    });
    console.log('✓ Binary Labs — 6 productos (incl. iPhone 15 Pro Max)');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3. MANCHESTER ELECTRICS — Electrodomésticos reales
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const manchUser = await upsertUser('hola@manchesterelectrics.com.ar');
    const manch = await upsertStore({
        name: 'Manchester Electrics', slug: 'manchester-electrics', verified: true, active: true,
        primaryColor: '#E35B1A', bgColor: '#FAFAF8', fontId: 'dm', userId: manchUser.id,
    });

    // Air Fryer — foto real de air fryer (canasta negra + comida)
    await upsertProduct({
        name: 'Air Fryer Manchester Pro 8L', slug: 'air-fryer-manchester-pro-8l',
        category: 'Air Fryers',
        tagline: 'El Air Fryer más grande del hogar argentino. 8 litros.',
        description: '8 litros de capacidad para cocinar para toda la familia. Pantalla táctil TFT, 12 programas preconfigurados, función de doble zona, temperatura desde 80°C a 220°C. 2400W.',
        price: 195000, subPrice: 175000, layout: 'split', fontId: 'dm',
        primaryColor: '#E35B1A', bgColor: '#FAFAF8',
        heroImageUrl: img('1648783285820-f8b5bc0df8b3'),
        image2Url: img('1612286308716-33c9f2f71e16', 900),
        image3Url: img('1594179047519-f347310d3322', 900),
        status: 'activo', featuredOrder: 9, storeId: manch.id,
        seoH2: 'Air Fryer Manchester Pro 8L — Cocina sano para toda la familia',
        seoBody: 'La forma más inteligente de cocinar es con aire caliente circulante a alta velocidad.\n80% menos aceite que la fritura tradicional sin sacrificar el crocante.\n12 programas para papas, pollo, pescado, repostería, deshidratado y más.',
        badges: J(['8L Capacidad', '12 Programas', 'Doble Zona', 'Pantalla TFT', 'Garantía 2 años', 'Sin BPA']),
        stats: J([{ value: '8L', label: 'Capacidad' }, { value: '2400W', label: 'Potencia' }, { value: '12', label: 'Programas' }, { value: '220°C', label: 'Temp. Máx.' }]),
        faqs: J([
            { q: '¿Para cuántas personas rinde?', a: 'Con 8 litros podés cocinar para 5-6 personas cómodamente.' },
            { q: '¿La canasta va al lavavajillas?', a: 'Sí, 100% apta para lavavajillas. Revestimiento cerámico antiadherente.' },
        ]),
    });

    // Pava Gooseneck — kettle eléctrica real para café
    await upsertProduct({
        name: 'Pava Eléctrica Gooseneck Pro', slug: 'pava-electrica-gooseneck-pro',
        category: 'Pavas Eléctricas',
        tagline: 'Temperatura exacta para el café perfecto cada vez.',
        description: 'Acero inoxidable 304, control de temperatura de 60°C a 100°C por grado, pico cuello de cisne para vertido preciso, pantalla LED, función "hold" 60 minutos. 1000W.',
        price: 98000, layout: 'minimal', fontId: 'dm',
        primaryColor: '#E35B1A', bgColor: '#FAFAF8',
        heroImageUrl: img('1495474472287-4d71bcdd2085'),
        image2Url: img('1459755486867-638154d4b5b4', 900),
        image3Url: img('1442512595331-8f22949d4552', 900),
        status: 'activo', featuredOrder: 10, storeId: manch.id,
        badges: J(['Control °C Exacto', 'Pico Cuello Cisne', 'Hold 60 min', 'Acero 304', 'Display LED']),
        stats: J([{ value: '60-100°C', label: 'Temperatura' }, { value: '1.0L', label: 'Capacidad' }, { value: '1000W', label: 'Potencia' }, { value: '60min', label: 'Hold' }]),
        faqs: J([
            { q: '¿Para qué métodos de café sirve?', a: 'Ideal para V60, Chemex, AeroPress, prensa francesa y matcha.' },
            { q: '¿Se apaga sola?', a: 'Sí, apagado automático al alcanzar la temperatura objetivo.' },
        ]),
    });

    // Selladora al Vacío
    await upsertProduct({
        name: 'Selladora al Vacío Manchester V2', slug: 'selladora-vacio-manchester-v2',
        category: 'Sellado al Vacío',
        tagline: 'Conservá hasta 5 veces más. Come fresco siempre.',
        description: 'Sellado en 5 segundos, compatible con bolsas reutilizables, función marinar en 10 minutos. Incluye 20 bolsas starter y manguera para recipientes.',
        price: 145000, layout: 'split', fontId: 'dm',
        primaryColor: '#E35B1A', bgColor: '#FAFAF8',
        heroImageUrl: img('1585515320310-259814833e62'),
        image2Url: img('1542223189-67a03fa0f0bd', 900),
        status: 'activo', featuredOrder: 11, storeId: manch.id,
        badges: J(['Sellado 5seg.', 'Marinar 10min', '5x Más Conservación', '20 Bolsas Incluidas', 'Doble Sello']),
        stats: J([{ value: '5 seg.', label: 'Sellado' }, { value: '10 min', label: 'Marinado' }, { value: '5x', label: 'Conservación' }, { value: '110kPa', label: 'Vacío' }]),
        faqs: J([
            { q: '¿Funciona con bolsas de otras marcas?', a: 'Sí, compatible con cualquier bolsa termoselladable.' },
            { q: '¿Se puede usar para sous-vide?', a: 'Sí, sellás al vacío y cocinás a temperatura controlada en agua.' },
        ]),
    });

    // Tostadora
    await upsertProduct({
        name: 'Tostadora 4 Ranuras Manchester', slug: 'tostadora-manchester-4-ranuras',
        category: 'Tostadoras',
        tagline: 'Tostadas perfectas para toda la familia. Todos los días.',
        description: 'Ranuras extra-anchas para pan artesanal grueso, 7 niveles de tostado, bandeja recoge-migas desmontable, función descongelar + recalentar. Acero inoxidable cepillado.',
        price: 89000, layout: 'minimal', fontId: 'dm',
        primaryColor: '#E35B1A', bgColor: '#FAFAF8',
        heroImageUrl: img('1484723091739-30a097e8f929'),
        image2Url: img('1568901346375-23c9450c58cd', 900),
        status: 'activo', featuredOrder: 12, storeId: manch.id,
        badges: J(['4 Ranuras Extra-Anchas', '7 Niveles', 'Descongelar/Recalentar', 'Acero Inoxidable', 'Garantía 2 años']),
        stats: J([{ value: '4', label: 'Ranuras' }, { value: '7', label: 'Niveles' }, { value: '1800W', label: 'Potencia' }, { value: '3.8cm', label: 'Ancho ranura' }]),
        faqs: J([{ q: '¿Entra pan artesanal grueso?', a: 'Sí, las ranuras de 3.8cm aceptan panes artesanales, pan de campo y baguettes.' }]),
    });
    console.log('✓ Manchester Electrics — 4 productos');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4. FUEGO NATIVO — Kamado (Horno Japonés Cerámico)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const fuegoUser = await upsertUser('hola@fuegonativo.com.ar');
    const fuego = await upsertStore({
        name: 'Fuego Nativo', slug: 'fuego-nativo', verified: true, active: true,
        primaryColor: '#B54A18', bgColor: '#1C1208', fontId: 'cormorant', userId: fuegoUser.id,
    });

    // Kamado Joe — horno japonés cerámico
    await upsertProduct({
        name: 'Kamado Joe Classic III', slug: 'kamado-joe-classic-iii',
        category: 'Hornos Japoneses Cerámicos',
        tagline: 'El horno japonés que cambia cómo cocinás para siempre.',
        description: 'El Kamado es un horno japonés milenario de cerámica. Versión 18" con sistema SlōRoller para convección indirecta perfecta. Fuma, asa, hace pizza napolitana y cocción lenta en un solo equipo. Garantía de por vida en el cuerpo cerámico.',
        price: 1850000, subPrice: 1650000, layout: 'full', fontId: 'cormorant',
        primaryColor: '#B54A18', bgColor: '#1C1208',
        // Horno de carbón cerámico con fuego
        heroImageUrl: img('1555939594-58d7cb561ad1'),
        image2Url: img('1513104890138-7c749659a591', 900),
        image3Url: img('1544025162-d76538086938', 900),
        image4Url: img('1467003909585-2f8a72700288', 900),
        status: 'activo', featuredOrder: 13, storeId: fuego.id,
        seoH2: 'Kamado Joe Classic III — El horno japonés de cerámica para el asador argentino',
        seoBody: 'El Kamado es un horno japonés de 3000 años de antigüedad, originario de Asia, que llegó a Occidente.\nLa cerámica retiene el calor de forma incomparable: alcanzá 400°C para pizza napolitana en 90 segundos.\nO bajá a 95°C por 16 horas para un pulled pork que se deshace solo.\nGarantía de por vida en el cuerpo de cerámica.',
        badges: J(['Cerámica 18"', 'Horno Japonés Milenario', 'SlōRoller Incluido', 'Termómetro Fundición', 'Garantía de Por Vida', 'Multicocción']),
        stats: J([{ value: '95-400°C', label: 'Temperatura' }, { value: '18"', label: 'Diámetro' }, { value: '700cm²', label: 'Superficie' }, { value: 'Vida', label: 'Garantía' }]),
        faqs: J([
            { q: '¿Qué es un Kamado?', a: 'Es un horno japonés milenario de cerámica de alta temperatura. El nombre "kamado" significa "lugar del fuego" en japonés. Se usa en Japón desde hace 3000 años.' },
            { q: '¿Para cuántas personas rinde?', a: 'Con 18" podés cocinar para 6-8 personas. Pizza entera, piezas grandes de carne o verduras.' },
            { q: '¿Qué combustible usa?', a: 'Carbón de calidad (recomendamos Binchotan o carbón de madera dura). No usa gas ni electricidad.' },
        ]),
    });

    await upsertProduct({
        name: 'Kit Pizza Kamado Completo', slug: 'kit-pizza-kamado',
        category: 'Accesorios Kamado',
        tagline: 'Pizza napolitana a 400°C en tu jardín.',
        description: 'Piedra de cordierita 38cm + deflector de calor doble + pala de madera de mango largo + termómetro infrarrojo instantáneo.',
        price: 290000, layout: 'split', fontId: 'cormorant',
        primaryColor: '#B54A18', bgColor: '#1C1208',
        heroImageUrl: img('1513104890138-7c749659a591'),
        image2Url: img('1555939594-58d7cb561ad1', 900),
        status: 'activo', featuredOrder: 14, storeId: fuego.id,
        badges: J(['Piedra Cordierita 38cm', 'Deflector Doble', 'Pala Mango Largo', 'Termómetro Infrarrojo']),
        stats: J([{ value: '400°C', label: 'Temp. Pizza' }, { value: '38cm', label: 'Diámetro' }, { value: '4 piezas', label: 'Kit' }, { value: '90seg.', label: 'Cocción' }]),
        faqs: J([{ q: '¿Compatible con otros Kamados?', a: 'Diseñado para Kamado Joe 18". Con adaptadores funciona con Big Green Egg Medium y Large.' }]),
    });

    await upsertProduct({
        name: 'Set Utensilios Grillmaster Pro', slug: 'set-utensilios-grillmaster-pro',
        category: 'Utensilios',
        tagline: 'Las herramientas que merece tu horno de autor.',
        description: 'Set de 5 piezas: espátula 50cm, pinza de trabajo 45cm, tenedor de asado 50cm, pincel de silicona y cepillo helicoidal. Mango de nogal negro.',
        price: 125000, layout: 'split', fontId: 'cormorant',
        primaryColor: '#B54A18', bgColor: '#1C1208',
        heroImageUrl: img('1504674900247-0877df9cc836'),
        status: 'activo', featuredOrder: 17, storeId: fuego.id,
        badges: J(['Acero Inox 304', 'Mango Nogal', '5 Piezas', 'Apto Lavavajillas']),
        stats: J([{ value: 'Inox 304', label: 'Material' }, { value: '50cm', label: 'Largo' }, { value: '5', label: 'Piezas' }, { value: 'Nogal', label: 'Mango' }]),
        faqs: J([{ q: '¿Viene con estuche?', a: 'Sí, incluye estuche de cuero sintético con cierre magnético.' }]),
    });

    await upsertProduct({
        name: 'Carbón Premium Binchotan Japonés', slug: 'carbon-premium-binchotan',
        category: 'Carbón y Combustibles',
        tagline: 'El carbón japonés que usan los mejores del planeta.',
        description: 'Binchotan de roble blanco Ubame-gashi de Wakayama, Japón. Quema limpia sin humo ni olor, temperatura estable por 4-5 horas. 3kg en caja premium.',
        price: 48000, layout: 'minimal', fontId: 'cormorant',
        primaryColor: '#B54A18', bgColor: '#1C1208',
        heroImageUrl: img('1467003909585-2f8a72700288'),
        status: 'activo', featuredOrder: 18, storeId: fuego.id,
        badges: J(['Roble Ubame-gashi', 'Sin Humo ni Olor', '4-5hs Quema', 'Origen Japón', 'Premium Grade']),
        stats: J([{ value: '800°C', label: 'Temperatura' }, { value: '4-5hs', label: 'Duración' }, { value: 'Cero', label: 'Humo' }, { value: '3kg', label: 'Contenido' }]),
        faqs: J([{ q: '¿Cómo se enciende el Binchotan?', a: 'Requiere encendido con soplete de gas directo por 15-20 minutos. No enciende con papel.' }]),
    });
    console.log('✓ Fuego Nativo — 4 productos');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5. GOURMET DEL OESTE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let gourmetUser = await prisma.user.findUnique({ where: { email: 'hola@gourmetdeloeste.com' } });
    if (!gourmetUser) gourmetUser = await upsertUser('hola@gourmetdeloeste.com');
    const gourmet = await upsertStore({
        name: 'Gourmet del Oeste', slug: 'gourmet-del-oeste', verified: true, active: true,
        primaryColor: '#C8472B', bgColor: '#F7F3EC', fontId: 'playfair', userId: gourmetUser.id,
    });

    await upsertProduct({
        name: 'Aceite de Oliva Gran Reserva', slug: 'aceite-oliva-gran-reserva',
        category: 'Aceites Extra Virgen',
        tagline: 'Primera prensa en frío. 0.12% de acidez. Medalla de Oro.',
        description: 'Elaborado con aceitunas Arbequina, Manzanilla y Picual de finca propia en Valle de Uco, Mendoza. Cosechadas en su punto exacto de madurez. Medalla de Oro AVPA Paris 2024.',
        price: 18500, subPrice: 15800, layout: 'split', fontId: 'playfair',
        primaryColor: '#C8472B', bgColor: '#F7F3EC',
        heroImageUrl: img('1474979266404-7eaacbcd87c5'),
        image2Url: img('1596040033229-a9821ebd058d', 900),
        image3Url: img('1518779578993-ec3be5976e29', 900),
        status: 'activo', featuredOrder: 15, storeId: gourmet.id,
        seoH2: 'Gran Reserva — El aceite extra virgen más premiado de Mendoza',
        seoBody: 'Elaborado con las mejores aceitunas de finca propia en el Valle de Uco, a 1200 metros de altura.\n0.12% de acidez, índice de peróxidos menor a 8 mEq/kg. El estándar más alto.\nFresco, herbáceo con notas de almendra verde y tomate.',
        badges: J(['0.12% Acidez', 'Primera Prensa en Frío', 'Medalla Oro AVPA Paris', 'Finca Propia', 'Sin Aditivos']),
        stats: J([{ value: '0.12%', label: 'Acidez' }, { value: '480mg/kg', label: 'Polifenoles' }, { value: '2024', label: 'Cosecha' }, { value: '500ml', label: 'Botella' }]),
        faqs: J([
            { q: '¿Cuánto dura una vez abierto?', a: 'Hasta 3 meses en lugar fresco y oscuro.' },
            { q: '¿Se puede usar para cocción?', a: 'Sí, tiene punto de humo de 190°C. Pero brilla en crudo.' },
        ]),
    });

    await upsertProduct({
        name: 'Kit Gourmet BBQ', slug: 'kit-gourmet-bbq',
        category: 'Kits Gourmet',
        tagline: 'El complemento perfecto para tu horno de autor.',
        description: 'Aceite de oliva fumado en frío + chimichurri reserva artesanal + fleur de sel patagónica + mermelada de Malbec. En estuche de madera.',
        price: 65000, subPrice: 58000, layout: 'full', fontId: 'playfair',
        primaryColor: '#C8472B', bgColor: '#F7F3EC',
        heroImageUrl: img('1504674900247-0877df9cc836'),
        image2Url: img('1474979266404-7eaacbcd87c5', 900),
        status: 'activo', featuredOrder: 19, storeId: gourmet.id,
        badges: J(['4 Productos Premium', 'Estuche Madera', 'Ideal como Regalo', 'Sin Conservantes']),
        stats: J([{ value: '4', label: 'Productos' }, { value: 'Artesanal', label: 'Elaboración' }, { value: 'Madera', label: 'Estuche' }, { value: '100%', label: 'Natural' }]),
        faqs: J([{ q: '¿Viene envuelto para regalo?', a: 'Sí, con lazo y tarjeta personalizable sin costo adicional.' }]),
    });

    await upsertProduct({
        name: 'Frutos Secos Selección Premium', slug: 'frutos-secos-seleccion-premium',
        category: 'Frutos Secos',
        tagline: 'Nueces, almendras y pistachos de primera calidad.',
        description: 'Mix curado: nueces de Mendoza (W320), almendras Natural de California y pistachos iraníes sin sal. Sin aditivos. Envasado al vacío, 500g.',
        price: 28500, layout: 'minimal', fontId: 'playfair',
        primaryColor: '#C8472B', bgColor: '#F7F3EC',
        heroImageUrl: img('1508615039623-a25605d2b022'),
        status: 'activo', featuredOrder: 20, storeId: gourmet.id,
        badges: J(['Sin Sal Agregada', 'Sin Aditivos', 'Vacío Industrial', '3 Variedades Premium']),
        stats: J([{ value: '500g', label: 'Contenido' }, { value: '0', label: 'Aditivos' }, { value: '3', label: 'Variedades' }, { value: '6 meses', label: 'Duración' }]),
        faqs: J([{ q: '¿Son aptos para celíacos?', a: 'Sí, procesados en planta sin gluten. Aptos para celíacos y veganos.' }]),
    });
    console.log('✓ Gourmet del Oeste — 3 productos');

    console.log('\n✅ Seed completo!\n');
    console.log('  21 productos en 5 tiendas\n');
    console.log('  iPhone 15 Pro Max → http://localhost:3000/p/iphone-15-pro-max');
    console.log('  Dualtron Thunder  → http://localhost:3000/p/dualtron-thunder-2');
    console.log('  Kamado Joe        → http://localhost:3000/p/kamado-joe-classic-iii');
    console.log('  Air Fryer         → http://localhost:3000/p/air-fryer-manchester-pro-8l\n');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
