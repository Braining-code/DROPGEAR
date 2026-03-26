import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL || `${API}`;


const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Syne:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Bebas+Neue&display=swap');`;
const FONT_MAP = {
  dm: "'DM Sans', sans-serif",
  playfair: "'Playfair Display', serif",
  syne: "'Syne', sans-serif",
  cormorant: "'Cormorant Garamond', serif",
  bebas: "'Bebas Neue', sans-serif",
};

// ─────────────────────────────────────────────────────────────────────────────
// DROP GEAR
// ─────────────────────────────────────────────────────────────────────────────
const dropgear = {
  name: "DROP GEAR",
  primaryColor: "#080808",
  accentColor: "#E8321A",
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const storeConfig = {
  name: "Gourmet del Oeste",
  primaryColor: "#C8472B",
  secondaryColor: "#F7F3EC",
  inkColor: "#1A1410",
  mutedColor: "#8A7A6A",
  lightColor: "#E8E0D4",
  darkBg: "#111009",
  fontDisplay: "Georgia, 'Times New Roman', serif",
  fontBody: "sans-serif",
  verified: true,
  rating: 4.9,
  sales: "1.200+",
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA — reemplazá estas URLs con las reales
// ─────────────────────────────────────────────────────────────────────────────
const media = {
  // Hero: botella de aceite, fondo oscuro, vertical
  heroImage: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=900&q=85",
  // Video placeholder: aceite dorado cayendo
  videoPoster: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1400&q=85",
  // Galería secundaria
  gallery: [
    "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=500&q=80", // olivos campo
    "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=500&q=80", // aceite macro
    "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80",   // botella+olivas
  ],
  // Store strip productos
  storeImages: [
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80",
    "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400&q=80",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────────────
const product = {
  brand: "Maison Verdú",
  category: "Aceite de Oliva Extra Virgen",
  name: "Gran Reserva\nSingle Estate",
  tagline: "Cosecha limitada de 2.400 botellas. Finca propia en Mendoza.",
  description: "Elaborado en frío a 18°C, con aceitunas arbequinas recolectadas a mano. Acidez: 0.12%. Polifenoles: 480 mg/kg.",
  price: "$8.900",
  installments: "3 cuotas sin interés de $2.967",
  subscriptionPrice: "$7.565",
  subscriptionDiscount: "15%",
  stats: [
    { value: "0.12%", label: "Acidez" },
    { value: "480", label: "mg/kg polifenoles" },
    { value: "2024", label: "Cosecha" },
    { value: "500ml", label: "Botella" },
  ],
  badges: ["Certificación orgánica", "Envío en 48hs", "Devolución sin cargo"],
  seoText: {
    h2: "Aceite de oliva extra virgen de Mendoza: del árbol a tu mesa",
    body: [
      "El Gran Reserva Single Estate de Maison Verdú es un aceite de oliva extra virgen de alta gama, producido en una finca propia ubicada a 1.100 metros sobre el nivel del mar en la región de Mendoza, Argentina. Con una acidez de apenas 0.12% y un contenido de polifenoles de 480 mg/kg, se posiciona entre los aceites más saludables y complejos del mercado latinoamericano.",
      "A diferencia de los aceites industriales, este producto se elabora exclusivamente con aceitunas arbequinas cosechadas a mano en su punto óptimo de maduración. El proceso de extracción en frío, realizado a menos de 18°C, preserva los compuestos antioxidantes, los aromas frutados y el perfil sensorial característico de la variedad.",
      "Cada botella forma parte de una cosecha anual limitada, garantizando trazabilidad completa desde el árbol hasta el hogar del consumidor. Ideal para uso en crudo sobre ensaladas, carnes, pescados y panes artesanales.",
    ],
  },
  faqs: [
    { q: "¿Cuánto tarda en llegar?", a: "Despachamos dentro de las 24hs hábiles. El envío tarda entre 2 y 5 días hábiles según destino. Para CABA y GBA, envío express en 24hs." },
    { q: "¿Cómo sé que es realmente artesanal?", a: "Cada botella tiene un número de serie. Podés rastrear de qué árbol provienen las aceitunas escaneando el QR del packaging." },
    { q: "¿Qué pasa si no me gusta?", a: "Devolución sin cargo dentro de los 30 días. Te reintegramos el 100% del importe, sin preguntas." },
    { q: "¿Puedo regalarlo?", a: "Sí. Al finalizar la compra podés agregar tarjeta personalizada y packaging de regalo sin costo adicional." },
    { q: "¿Qué es la suscripción?", a: "Recibís una botella cada 2 meses con 15% de descuento permanente. Podés pausar o cancelar cuando quieras." },
  ],
};

const storeProductsFallback = [
  { name: "Malbec Reserva 2022", price: "$6.200" },
  { name: "Mermelada de Higo Artesanal", price: "$2.800" },
  { name: "Aceto Balsámico Añejo", price: "$4.500" },
  { name: "Queso de Cabra Curado", price: "$3.900" },
  { name: "Sal Patagónica Ahumada", price: "$1.800" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Hero: always starts visible — no observer needed, it's always above the fold
function useInViewHero() {
  const ref = useRef(null);
  return [ref, true]; // always visible
}

// Detect if a hex color is dark (luminance < 0.35)
function isDarkColor(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  let cleanHex = hex.slice(1);
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
  if (cleanHex.length !== 6) return false;
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const toLinear = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum < 0.35;
}

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const CheckIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={dropgear.accentColor}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);

const storeConfigDefault = storeConfig;

// ─────────────────────────────────────────────────────────────────────────────
// DROP GEAR BAR
// ─────────────────────────────────────────────────────────────────────────────
function ShoppingBar({ storeName, verified }) {
  const { cart, openCart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: dropgear.primaryColor, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 44, boxShadow: `0 1px 0 rgba(232,50,26,0.2)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "2px", textTransform: "uppercase", textShadow: `0 0 12px ${dropgear.accentColor}88` }}>
          DROP<span style={{ color: dropgear.accentColor, textShadow: `0 0 18px ${dropgear.accentColor}` }}>GEAR</span>
        </span>
        <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", borderLeft: "1px solid rgba(255,255,255,0.12)", paddingLeft: 16, display: "flex", alignItems: "center", gap: 5 }}>
          <ShieldIcon /> Productos Verificados
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Vendido por</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{storeName || storeConfig.name}</span>
        {verified && (
          <span style={{ fontFamily: "sans-serif", fontSize: 9, fontWeight: 700, color: dropgear.accentColor, border: `1px solid ${dropgear.accentColor}`, padding: "1px 6px", borderRadius: 3, letterSpacing: "0.5px" }}>VERIFICADO</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 12 }}>
          <UserIcon /> Mi cuenta
        </button>
        <button onClick={openCart} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 12, position: "relative" }}>
          <CartIcon />
          {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: dropgear.accentColor, color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>}
          Carrito
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE NAV
// ─────────────────────────────────────────────────────────────────────────────
function StoreNav({ onBuy, C, storeName, verified, rating, sales }) {
  // Convert C.secondaryColor to rgba for the sticky nav (with high opacity)
  const navBg = C.secondaryColor.startsWith('#')
    ? `${C.secondaryColor}F5`  // hex + alpha F5 = ~96% opaque
    : C.secondaryColor;
  return (
    <div style={{ position: "sticky", top: 44, zIndex: 90, background: navBg, backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px", borderBottom: `1px solid ${C.lightColor}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: C.fontDisplay, fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px", color: C.inkColor }}>{storeName || storeConfig.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <StarIcon />
          <span style={{ fontFamily: "sans-serif", fontSize: 11, color: C.mutedColor, fontWeight: 500 }}>{rating || storeConfig.rating} · {sales || storeConfig.sales} ventas</span>
        </div>
      </div>
      <button style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, background: C.primaryColor, color: "#fff", padding: "9px 22px", borderRadius: 6, border: "none", cursor: "pointer" }} onClick={onBuy}>
        Comprar ahora
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function ProviderLandingFull() {
  const { slug } = useParams();
  const [dbProduct, setDbProduct] = useState(null);

  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/products/${slug}`)
      .then(async res => {
        if (res.status === 403) {
          const d = await res.json();
          setLoadError(d.error || 'Esta tienda aún no está disponible.');
          return null;
        }
        if (!res.ok) { setLoadError('Producto no encontrado.'); return null; }
        return res.json();
      })
      .then(data => { if (data && !data.error) setDbProduct(data); })
      .catch(() => setLoadError('No se pudo conectar con el servidor.'));
  }, [slug]);

  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [subMode, setSubMode] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [storeProducts, setStoreProducts] = useState(storeProductsFallback);
  const videoRef = useRef(null);

  const [heroRef, heroIn] = useInViewHero();
  const [statsRef, statsIn] = useInView(0.2);
  const [seoRef, seoIn] = useInView(0.1);
  const [storeRef, storeIn] = useInView(0.1);
  const [faqRef, faqIn] = useInView(0.1);

  // Load other products from the same store whenever dbProduct resolves
  useEffect(() => {
    if (!dbProduct?.storeId) return;
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(all => {
        const others = all
          .filter(p => p.storeId === dbProduct.storeId && p.id !== dbProduct.id && p.status === 'activo')
          .slice(0, 5);
        if (others.length > 0) setStoreProducts(others.map(p => ({
          name: p.name,
          price: `$${Number(p.price).toLocaleString('es-AR')}`,
          image: p.heroImageUrl || null,
          slug: p.slug,
        })));
      })
      .catch(() => { });
  }, [dbProduct?.storeId, dbProduct?.id]);

  if (loadError) return (
    <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Tienda no disponible</h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>{loadError}</p>
        <a href="/" style={{ background: '#E8321A', color: '#fff', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 0 20px #E8321A66' }}>Volver al inicio</a>
      </div>
    </div>
  );

  if (!dbProduct) return <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#0A0A0A', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando tienda certificada...</div>;

  const layout = dbProduct.layout || "split";
  const dbFont = FONT_MAP[dbProduct.fontId] || storeConfig.fontDisplay;

  // Detect if bg is dark → use light text; if light → use dark text
  const bgHex = dbProduct.bgColor || storeConfig.secondaryColor;
  const darkBg = isDarkColor(bgHex);

  const C = {
    ...storeConfig,
    primaryColor: dbProduct.primaryColor || storeConfig.primaryColor,
    secondaryColor: bgHex,
    fontDisplay: dbFont,
    // inkColor: white for dark bg or full layout, dark for light bg
    inkColor: (layout === "full" || darkBg) ? "#FFFFFF" : "#1A1410",
    bodyColor: (layout === "full" || darkBg) ? "rgba(255,255,255,0.85)" : "#3A322C",
    mutedColor: (layout === "full" || darkBg) ? "rgba(255,255,255,0.6)" : "#8A7A6A",
    lightColor: (layout === "full" || darkBg) ? "rgba(255,255,255,0.15)" : "#E8E0D4",
  };

  const parsedBadges = (() => {
    try { return dbProduct.badges ? JSON.parse(dbProduct.badges) : null; } catch { return null; }
  })();
  const parsedStats = (() => {
    try { return dbProduct.stats ? JSON.parse(dbProduct.stats) : null; } catch { return null; }
  })();
  const parsedFaqs = (() => {
    try { return dbProduct.faqs ? JSON.parse(dbProduct.faqs) : null; } catch { return null; }
  })();

  const productData = {
    ...product,
    id: dbProduct.id,
    name: dbProduct.name || product.name,
    category: dbProduct.category || product.category,
    tagline: dbProduct.tagline || product.tagline,
    description: dbProduct.description || product.description,
    price: `$${dbProduct.price.toLocaleString()}`,
    subscriptionPrice: `$${(dbProduct.subPrice || Math.round(dbProduct.price * 0.85)).toLocaleString()}`,
    badges: parsedBadges || ["Calidad Premium", "Envío Seguro", "Garantía Incluida"],
    stats: parsedStats || [
      { value: "Premium", label: "Calidad" },
      { value: "24hs", label: "Despacho" },
      { value: "30 días", label: "Garantía" },
      { value: "1 año", label: "Soporte" },
    ],
    faqs: parsedFaqs || [
      { q: "¿Cuánto tarda en llegar?", a: "Despachamos dentro de las 24hs hábiles a todo el país." },
      { q: "¿Qué pasa si no me gusta?", a: "Devolución sin cargo dentro de los 30 días." },
    ],
    seoH2: dbProduct.seoH2 || product.seoText.h2,
    seoBody: dbProduct.seoBody || product.seoText.body.join('\n'),
  };

  const handleBuy = () => {
    addToCart(productData, qty);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false); }
      else { videoRef.current.play(); setVideoPlaying(true); }
    }
  };

  // Galería: hero + imágenes de DB + fallback
  const dbGalleryArray = (() => {
    try { return dbProduct.gallery ? JSON.parse(dbProduct.gallery) : []; } catch { return []; }
  })();
  const dbGallery = [...new Set([dbProduct.image2Url, dbProduct.image3Url, dbProduct.image4Url, ...dbGalleryArray].filter(Boolean))];
  const allImages = [
    dbProduct.heroImageUrl || media.heroImage,
    ...(dbGallery.length > 0 ? dbGallery : media.gallery),
  ];

  return (
    <>
      <style>{FONT_IMPORT}</style>
      <div style={{ fontFamily: C.fontDisplay, background: C.secondaryColor, color: C.inkColor, minHeight: "100vh", overflowX: "hidden" }}>

        <ShoppingBar storeName={dbProduct?.store?.name} verified={dbProduct?.store?.verified} />

        <div style={{ paddingTop: 44 }}>
          <StoreNav onBuy={handleBuy} C={C} storeName={dbProduct?.store?.name} verified={dbProduct?.store?.verified} />
        </div>

        {/* ══════════════════════════════════════════════════════════
            LAYOUT: SPLIT — 50% foto | 50% contenido
        ══════════════════════════════════════════════════════════ */}
        {layout === "split" && (
          <section ref={heroRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 108px)", opacity: heroIn ? 1 : 0, transition: "opacity 0.8s" }}>

            {/* Columna imagen */}
            <div style={{ position: "relative", background: C.secondaryColor, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
              <img
                src={allImages[activeImg]}
                alt={productData.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
              {/* Galería pequeña lateral */}
              <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 24, scrollbarWidth: "none" }}>
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                {allImages.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 86, height: 86, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: activeImg === i ? `3px solid ${C.primaryColor}` : `2px solid ${C.lightColor}`, flexShrink: 0, transition: "border-color 0.2s", background: "#fff" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", opacity: activeImg === i ? 1 : 0.6 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Columna contenido */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 56px 72px 52px", background: C.secondaryColor, overflowY: "auto" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: C.primaryColor, marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 24, height: 1, background: C.primaryColor, display: "inline-block" }} />
                {productData.category}
              </span>
              <h1 style={{ fontFamily: C.fontDisplay, fontSize: dbProduct.fontId === "bebas" ? 68 : 52, fontWeight: 700, lineHeight: 1.04, letterSpacing: dbProduct.fontId === "bebas" ? "1px" : "-2px", marginBottom: 16, whiteSpace: "pre-line", color: C.inkColor, transform: heroIn ? "translateY(0)" : "translateY(20px)", opacity: heroIn ? 1 : 0, transition: "transform 0.8s 0.2s cubic-bezier(0.16,1,0.3,1),opacity 0.8s 0.2s" }}>
                {productData.name}
              </h1>
              <p style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 600, color: C.primaryColor, lineHeight: 1.65, marginBottom: 10, maxWidth: 400 }}>{productData.tagline}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.bodyColor, lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>{productData.description}</p>
              <div style={{ width: 40, height: 1, background: C.lightColor, marginBottom: 24 }} />
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: C.fontDisplay, fontSize: 44, fontWeight: 700, letterSpacing: "-2px", display: "block", marginBottom: 4, color: C.inkColor }}>{subMode ? productData.subscriptionPrice : productData.price}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 12, color: C.mutedColor }}>{productData.installments}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 11, color: C.mutedColor, letterSpacing: "1px", textTransform: "uppercase" }}>Cantidad</span>
                <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.lightColor}`, borderRadius: 6, overflow: "hidden" }}>
                  <button style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 300, background: "transparent", border: "none", cursor: "pointer", padding: "5px 12px", color: C.inkColor }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, padding: "5px 14px", borderLeft: `1px solid ${C.lightColor}`, borderRight: `1px solid ${C.lightColor}` }}>{qty}</span>
                  <button style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 300, background: "transparent", border: "none", cursor: "pointer", padding: "5px 12px", color: C.inkColor }} onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                <button style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, background: C.primaryColor, color: "#fff", border: "none", borderRadius: 8, padding: "14px 32px", cursor: "pointer", flexShrink: 0, transition: "background 0.3s" }} onClick={handleBuy}>
                  {subMode ? "Suscribirme" : "Agregar al carrito"}
                </button>
                <button style={{ fontFamily: "sans-serif", fontSize: 13, background: "transparent", color: C.inkColor, border: `1.5px solid ${C.lightColor}`, borderRadius: 8, padding: "14px 20px", cursor: "pointer" }}
                  onClick={() => window.open(`https://wa.me/?text=Hola, me interesa ${encodeURIComponent(productData.name)}`, "_blank")}>
                  💬 Consultar
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {productData.badges.map((b, i) => (
                  <span key={i} style={{ fontFamily: "sans-serif", fontSize: 11, color: "#6A5E52", background: "rgba(26,20,16,0.06)", padding: "5px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                    <CheckIcon color={C.primaryColor} />{b}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            LAYOUT: FULL — Foto a pantalla completa con overlay
        ══════════════════════════════════════════════════════════ */}
        {layout === "full" && (
          <section ref={heroRef} style={{ position: "relative", minHeight: "calc(100vh - 108px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: heroIn ? 1 : 0, transition: "opacity 0.8s", overflow: "hidden" }}>
            {/* Fondo foto */}
            <img
              src={allImages[activeImg]}
              alt={productData.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
            />
            {/* Overlay degradado (Oscurecido para contrastar texto blanco) */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.2) 100%)", zIndex: 1 }} />

            {/* Controles flotantes */}
            <div style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 16, zIndex: 20 }}>
              {allImages.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", cursor: "pointer", border: activeImg === i ? `3px solid ${C.primaryColor}` : `2px solid rgba(255,255,255,0.2)`, transition: "all 0.2s", background: "#fff", boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", opacity: activeImg === i ? 1 : 0.7 }} />
                </div>
              ))}
            </div>

            {/* Contenido centrado izquierda */}
            <div style={{ position: "relative", zIndex: 2, maxWidth: 640, width: "100%", padding: "80px 80px 80px 8vw" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 28, height: 1, background: C.primaryColor, display: "inline-block" }} />
                {productData.category}
              </span>
              <h1 style={{ fontFamily: C.fontDisplay, fontSize: dbProduct.fontId === "bebas" ? 80 : 60, fontWeight: 700, lineHeight: 1.02, letterSpacing: dbProduct.fontId === "bebas" ? "2px" : "-2px", marginBottom: 20, whiteSpace: "pre-line", color: "#fff", transform: heroIn ? "translateY(0)" : "translateY(24px)", opacity: heroIn ? 1 : 0, transition: "transform 0.9s 0.2s cubic-bezier(0.16,1,0.3,1),opacity 0.9s 0.2s" }}>
                {productData.name}
              </h1>
              <p style={{ fontFamily: "sans-serif", fontSize: 17, fontWeight: 600, color: C.primaryColor, lineHeight: 1.65, marginBottom: 10, maxWidth: 480 }}>{productData.tagline}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>{productData.description}</p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontFamily: C.fontDisplay, fontSize: 50, fontWeight: 700, letterSpacing: "-2px", display: "block", marginBottom: 4, color: "#fff" }}>{subMode ? productData.subscriptionPrice : productData.price}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{productData.installments}</span>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, background: C.primaryColor, color: "#fff", border: "none", borderRadius: 8, padding: "15px 38px", cursor: "pointer", transition: "background 0.3s" }} onClick={handleBuy}>
                  Agregar al carrito
                </button>
                <button style={{ fontFamily: "sans-serif", fontSize: 13, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "15px 22px", cursor: "pointer", backdropFilter: "blur(4px)" }}
                  onClick={() => window.open(`https://wa.me/?text=Hola, me interesa ${encodeURIComponent(productData.name)}`, "_blank")}>
                  💬 Consultar
                </button>
              </div>
              {/* Thumbnails en fila abajo */}
              <div style={{ display: "flex", gap: 8, marginTop: 28, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
                {allImages.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: activeImg === i ? `2px solid ${C.primaryColor}` : "2px solid rgba(255,255,255,0.3)", flexShrink: 0, transition: "border-color 0.2s", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", opacity: activeImg === i ? 1 : 0.7 }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            LAYOUT: MINIMAL — Todo texto, sin imagen, editorial
        ══════════════════════════════════════════════════════════ */}
        {layout === "minimal" && (
          <section ref={heroRef} style={{ minHeight: "calc(100vh - 108px)", display: "flex", alignItems: "center", justifyContent: "center", background: C.secondaryColor, padding: "80px 10vw", opacity: heroIn ? 1 : 0, transition: "opacity 0.8s" }}>
            <div style={{ maxWidth: 760, width: "100%", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>
                <span style={{ height: 1, flex: 1, maxWidth: 60, background: C.primaryColor, display: "inline-block" }} />
                <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: C.primaryColor }}>{productData.category}</span>
                <span style={{ height: 1, flex: 1, maxWidth: 60, background: C.primaryColor, display: "inline-block" }} />
              </div>
              <h1 style={{ fontFamily: C.fontDisplay, fontSize: dbProduct.fontId === "bebas" ? 96 : 76, fontWeight: 700, lineHeight: 1, letterSpacing: dbProduct.fontId === "bebas" ? "3px" : "-3px", marginBottom: 24, whiteSpace: "pre-line", color: C.inkColor, transform: heroIn ? "translateY(0)" : "translateY(24px)", opacity: heroIn ? 1 : 0, transition: "transform 0.9s 0.15s cubic-bezier(0.16,1,0.3,1),opacity 0.9s 0.15s" }}>
                {productData.name}
              </h1>
              <p style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 600, color: C.primaryColor, lineHeight: 1.7, marginBottom: 12, maxWidth: 560, margin: "0 auto 12px" }}>{productData.tagline}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 15, color: C.bodyColor, lineHeight: 1.75, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>{productData.description}</p>

              {/* Precio grande centrado */}
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontFamily: C.fontDisplay, fontSize: 60, fontWeight: 700, letterSpacing: "-3px", display: "block", marginBottom: 6, color: C.inkColor }}>{subMode ? productData.subscriptionPrice : productData.price}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: C.mutedColor }}>{productData.installments}</span>
              </div>

              {/* Qty + CTA centrados */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.lightColor}`, borderRadius: 8, overflow: "hidden" }}>
                  <button style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 300, background: "transparent", border: "none", cursor: "pointer", padding: "8px 16px", color: C.inkColor }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, padding: "8px 18px", borderLeft: `1px solid ${C.lightColor}`, borderRight: `1px solid ${C.lightColor}` }}>{qty}</span>
                  <button style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 300, background: "transparent", border: "none", cursor: "pointer", padding: "8px 16px", color: C.inkColor }} onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <button style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, background: C.primaryColor, color: "#fff", border: "none", borderRadius: 8, padding: "14px 40px", cursor: "pointer", transition: "background 0.3s" }} onClick={handleBuy}>
                  Agregar al carrito
                </button>
                <button style={{ fontFamily: "sans-serif", fontSize: 13, background: "transparent", color: C.inkColor, border: `1.5px solid ${C.lightColor}`, borderRadius: 8, padding: "14px 22px", cursor: "pointer" }}
                  onClick={() => window.open(`https://wa.me/?text=Hola, me interesa ${encodeURIComponent(productData.name)}`, "_blank")}>
                  💬 Consultar
                </button>
              </div>

              {/* Badges centrados */}
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {productData.badges.map((b, i) => (
                  <span key={i} style={{ fontFamily: "sans-serif", fontSize: 11, color: "#6A5E52", background: "rgba(26,20,16,0.05)", padding: "5px 14px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                    <CheckIcon color={C.primaryColor} />{b}
                  </span>
                ))}
              </div>

              {/* Divisor ornamental */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 48 }}>
                <span style={{ flex: 1, height: 1, background: C.lightColor }} />
                <span style={{ fontFamily: C.fontDisplay, fontSize: 18, color: C.lightColor }}>✦</span>
                <span style={{ flex: 1, height: 1, background: C.lightColor }} />
              </div>
            </div>
          </section>
        )}


        {/* ── STATS ── */}
        <section ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${C.lightColor}`, borderBottom: `1px solid ${C.lightColor}` }}>
          {productData.stats.map((s, i) => (
            <div key={i} style={{ padding: "36px 28px", borderRight: i < 3 ? `1px solid ${C.lightColor}` : "none", textAlign: "center" }}>
              <span style={{ fontFamily: C.fontDisplay, fontSize: 22, fontWeight: 700, color: C.inkColor, letterSpacing: "-0.5px", display: "block" }}>{s.value}</span>
              <span style={{ fontFamily: "sans-serif", fontSize: 10, color: C.mutedColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── VIDEO / FEATURED MEDIA ── */}
        {(dbProduct.videoUrl) ? (
          <section style={{ padding: "80px 48px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <h3 style={{ fontFamily: C.fontDisplay, fontSize: 32, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12, color: C.inkColor }}>
              {dbProduct.videoTitle || "Experiencia Drop Gear"}
            </h3>
            <p style={{ fontFamily: "sans-serif", fontSize: 16, color: C.mutedColor, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
              {dbProduct.videoSub || "Descubrí todos los detalles en movimiento."}
            </p>
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: C.lightColor, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.lightColor}` }}>
              <video
                ref={videoRef}
                src={dbProduct.videoUrl}
                poster={allImages[0]}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                onClick={toggleVideo}
                loop muted playsInline
              />
              {!videoPlaying && (
                <div onClick={toggleVideo} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", cursor: "pointer", transition: "background 0.3s" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 6, boxShadow: `0 8px 30px ${C.primaryColor}66` }}>
                    <PlayIcon color="#fff" size={32} />
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : null}

        {/* ── SEO TEXT (Detailed Description) ── */}
        {(productData.seoH2 || productData.seoBody) && (
          <section ref={seoRef} style={{ padding: "80px 48px", maxWidth: 800, margin: "0 auto", opacity: 1, transform: "translateY(0)" }}>
            {productData.seoH2 && (
              <h2 style={{ fontFamily: C.fontDisplay, fontSize: 36, fontWeight: 700, color: C.inkColor, marginBottom: 24, textAlign: "center", letterSpacing: "-0.5px" }}>
                {productData.seoH2}
              </h2>
            )}
            {productData.seoBody && productData.seoBody.split('\n').filter(p => p.trim()).map((p, i, arr) => (
              <p key={i} style={{ fontFamily: "sans-serif", fontSize: 17, fontWeight: 400, color: C.inkColor, lineHeight: 1.8, marginBottom: i === arr.length - 1 ? 0 : '1.5em' }}>
                {p}
              </p>
            ))}
          </section>
        )}

        {/* ── GALERÍA MOSAICO & BUY BUTTON (BOTTOM) ── */}
        {dbGallery.length > 0 && (
          <section style={{ padding: "40px 48px 100px", maxWidth: 1000, margin: "0 auto" }}>
            <h3 style={{ fontFamily: C.fontDisplay, fontSize: 32, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 32, textAlign: "center", color: C.inkColor }}>
              {productData.name}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 56 }}>
              {dbGallery.map((imgUrl, i) => (
                <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 16, overflow: "hidden", background: C.lightColor, border: `1px solid ${C.lightColor}` }}>
                  <img src={imgUrl} alt={`Galería ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                </div>
              ))}
            </div>

            {/* The original buy button div was here, but it's being replaced by the FOOTER CTA */}
          </section>
        )}

        {/* ── STORE STRIP ── */}
        <section ref={storeRef} style={{ background: C.secondaryColor, borderTop: `1px solid ${C.lightColor}`, borderBottom: `1px solid ${C.lightColor}`, padding: "44px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 48px", marginBottom: 28 }}>
            <h3 style={{ fontFamily: C.fontDisplay, fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px" }}>
              Más drops <span style={{ color: C.primaryColor }}>exclusivos</span>
            </h3>
          </div>
          <div style={{ display: "flex", gap: 18, padding: "0 48px", overflowX: "auto", scrollbarWidth: "none" }}>
            {storeProducts.map((p, i) => (
              <a key={i} href={p.slug ? `/p/${p.slug}` : '#'} style={{ flexShrink: 0, width: 185, cursor: "pointer", textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: "100%", height: 185, borderRadius: 8, overflow: "hidden", marginBottom: 10, position: "relative", background: '#f0ede8' }}>
                  <img src={p.image || media.storeImages[i % media.storeImages.length]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ fontFamily: C.fontDisplay, fontSize: 13, lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>{p.price}</div>
              </a>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section ref={faqRef} style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 34, padding: "80px 48px 120px", background: C.secondaryColor }}>
          <div>
            <h2 style={{ fontFamily: C.fontDisplay, fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>Preguntas<br />frecuentes</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: C.mutedColor }}>¿Tenés otra consulta? <br />Respondemos rápido por WhatsApp.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {productData.faqs.map((f, i) => (
              <div key={i} style={{ border: `1px solid ${openFaq === i ? C.lightColor : "rgba(26,20,16,0.06)"}`, background: openFaq === i ? "#fff" : "transparent", borderRadius: 8, overflow: "hidden", transition: "all 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", cursor: "pointer", userSelect: "none" }} onClick={() => setOpenFaq(o => o === i ? null : i)}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: openFaq === i ? C.primaryColor : "#5A4E44" }}>{f.q}</span>
                  <ChevronIcon open={openFaq === i} />
                </div>
                <div style={{ height: openFaq === i ? "auto" : 0, padding: openFaq === i ? "0 22px 22px" : "0 22px", opacity: openFaq === i ? 1 : 0, overflow: "hidden", transition: "opacity 0.4s" }}>
                  <p style={{ margin: 0, fontFamily: "sans-serif", fontSize: 14, color: C.mutedColor, lineHeight: 1.6 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* ── FOOTER CTA ── */}
        <section style={{ background: C.darkBg, color: "#fff", padding: "90px 48px", textAlign: "center" }}>
          <h2 style={{ fontFamily: C.fontDisplay, fontSize: dbProduct.fontId === 'bebas' ? 54 : 44, fontWeight: 700, letterSpacing: "-2px", marginBottom: 10 }}>{productData.name}.</h2>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9A8A7A", marginBottom: 36 }}>Calidad garantizada · Envío bonificado por zonas · Soporte dedicado</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", zIndex: 10, position: "relative" }}>
            <button style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, background: C.primaryColor, color: "#fff", border: "none", borderRadius: 8, padding: "15px 42px", cursor: "pointer", transition: "transform 0.2s" }} onClick={handleBuy}>
              Comprar ahora
            </button>
            <button style={{ fontFamily: "sans-serif", fontSize: 14, background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "15px 28px", cursor: "pointer", transition: "border-color 0.2s" }} onClick={() => { setSubMode(true); handleBuy(); }}>
              Suscribirme y ahorrar {productData.subscriptionDiscount}
            </button>
          </div>
        </section>

        {/* ── DROP GEAR FOOTER (GLOBAL) ── */}
        <footer style={{ background: "#080808", padding: "64px 48px", borderTop: `1px solid rgba(232,50,26,0.3)` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "3px", textTransform: "uppercase" }}>
              DROP<span style={{ color: "#E8321A", textShadow: "0 0 18px #E8321A" }}>GEAR</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", fontSize: 13 }}>
              <span>Powered by Drop Gear Commerce</span>
              <span>•</span>
              <ShieldIcon />
              <span>Plataforma Segura</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
