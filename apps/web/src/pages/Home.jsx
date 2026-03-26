import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DG = {
    black: '#080808',
    surface: '#0f0f0f',
    card: '#111111',
    border: 'rgba(255,255,255,0.07)',
    redBorder: 'rgba(232,50,26,0.25)',
    red: '#E8321A',
    orange: '#FF6A1A',
    white: '#F0F0F0',
    muted: 'rgba(240,240,240,0.4)',
    mutedDim: 'rgba(240,240,240,0.2)',
};

const fmtPrice = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '';

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ search, setSearch, totalProducts, totalStores }) {
    const nav = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const { cart, openCart } = useCart();
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
            background: scrolled ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${scrolled ? DG.redBorder : DG.border}`,
            transition: 'border-color 0.4s, background 0.4s',
        }}>
            {/* Top bar — tagline strip */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 32, borderBottom: `1px solid ${DG.border}`,
                background: 'rgba(232,50,26,0.05)',
            }}>
                <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                    letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(232,50,26,0.8)',
                }}>
                    Productos Verificados · Compra Directa · Sin Intermediarios
                </span>
            </div>

            {/* Main row */}
            <div style={{
                display: 'flex', alignItems: 'center', height: 60,
                padding: '0 48px', gap: 32,
            }}>
                {/* Logo */}
                <div
                    onClick={() => nav('/')}
                    style={{ cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
                >
                    <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 900,
                        letterSpacing: '3px', textTransform: 'uppercase',
                        color: '#fff', textShadow: `0 0 20px ${DG.red}55`,
                    }}>
                        DROP<span style={{ color: DG.red, textShadow: `0 0 24px ${DG.red}99` }}>GEAR</span>
                    </span>
                </div>

                {/* Stats pill */}
                <div style={{
                    display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${DG.border}`, borderRadius: 24, overflow: 'hidden', flexShrink: 0,
                }}>
                    {[
                        { val: totalProducts, label: 'drops' },
                    ].map(({ val, label }, i) => (
                        <div key={label} style={{
                            padding: '5px 16px', display: 'flex', alignItems: 'center', gap: 5,
                            borderRight: i === 0 ? `1px solid ${DG.border}` : 'none',
                        }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800, color: DG.white }}>{val}</span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: DG.muted }}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Buscador — crece */}
                <div style={{ flex: 1, maxWidth: 460, position: 'relative' }}>
                    <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DG.white} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar gear, categorías..."
                        style={{
                            width: '100%', padding: '10px 16px 10px 38px',
                            background: 'rgba(255,255,255,0.06)',
                            border: `1px solid ${DG.border}`,
                            borderRadius: 24, color: DG.white, fontSize: 13,
                            fontFamily: "'DM Sans', sans-serif", outline: 'none',
                            transition: 'border-color 0.2s, background 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = DG.redBorder; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
                        onBlur={e => { e.target.style.borderColor = DG.border; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                    />
                </div>

                {/* Nav links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {[['Blog', '/blog']].map(([label, href]) => (
                        <a key={label} href={href} style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                            color: DG.muted, textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
                            transition: 'color 0.2s, background 0.2s',
                        }}
                            onMouseEnter={e => { e.target.style.color = DG.white; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                            onMouseLeave={e => { e.target.style.color = DG.muted; e.target.style.background = 'transparent'; }}
                        >{label}</a>
                    ))}
                    
                    <button onClick={openCart} style={{
                        background: 'rgba(255,255,255,0.08)', border: `1px solid ${DG.border}`,
                        color: DG.white, display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', borderRadius: 24, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        {cartCount > 0 ? `${cartCount} items` : 'Carrito'}
                    </button>
                </nav>
            </div>
        </header>
    );
}

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
function FilterBar({ categories, active, onSelect, count }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim, marginRight: 4 }}>
                {count} {count === 1 ? 'gear' : 'gears'}
            </span>
            {['Todos', ...categories].map((cat) => {
                const isActive = active === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                            padding: '6px 16px', borderRadius: 24, cursor: 'pointer',
                            border: `1px solid ${isActive ? DG.red : DG.border}`,
                            background: isActive ? DG.red : 'rgba(255,255,255,0.03)',
                            color: isActive ? '#fff' : DG.muted,
                            letterSpacing: '0.5px', textTransform: 'uppercase',
                            transition: 'all 0.2s',
                            boxShadow: isActive ? `0 0 14px ${DG.red}44` : 'none',
                        }}
                    >
                        {cat}
                    </button>
                );
            })}
        </div>
    );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
    const nav = useNavigate();
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => nav(`/p/${product.slug}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: 'pointer',
                background: DG.card,
                border: `1px solid ${hovered ? DG.redBorder : DG.border}`,
                borderRadius: 16, overflow: 'hidden',
                transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hovered
                    ? `0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px ${DG.redBorder}`
                    : '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.25s',
                animation: `fadeUp 0.45s ${index * 0.035}s both`,
            }}
        >
            {/* Imagen */}
            <div style={{ position: 'relative', paddingBottom: '100%', background: product.bgColor || '#161616', overflow: 'hidden' }}>
                {product.heroImageUrl ? (
                    <img
                        src={product.heroImageUrl}
                        alt={product.name}
                        style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                            objectFit: 'cover',
                            transform: hovered ? 'scale(1.06)' : 'scale(1)',
                            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                            filter: hovered ? 'brightness(0.8)' : 'brightness(0.72)',
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', background: '#141414',
                    }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${DG.border}` }} />
                    </div>
                )}

                {/* Overlay bottom */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                    opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
                }} />

                {/* Badge tienda */}
                <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(8,8,8,0.82)', backdropFilter: 'blur(10px)',
                    borderRadius: 20, padding: '3px 11px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600,
                    color: 'rgba(255,255,255,0.65)', border: `1px solid rgba(255,255,255,0.08)`,
                }}>
                    {product.store?.name || 'Tienda'}
                </div>

                {/* Badge verificado */}
                {product.store?.verified && (
                    <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: DG.red, borderRadius: 20, padding: '3px 10px',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 9,
                        fontWeight: 700, color: '#fff', letterSpacing: '0.5px',
                        boxShadow: `0 0 10px ${DG.red}55`,
                    }}>VERIFICADO</div>
                )}

                {/* Hover CTA */}
                <div style={{
                    position: 'absolute', bottom: 12, left: '50%',
                    transform: `translateX(-50%) translateY(${hovered ? 0 : 8}px)`,
                    background: DG.red, color: '#fff', borderRadius: 8, padding: '8px 22px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                    whiteSpace: 'nowrap', opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.22s, transform 0.3s',
                    boxShadow: `0 4px 18px ${DG.red}55`, letterSpacing: '0.3px',
                }}>
                    Ver gear
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: '14px 16px 18px' }}>
                <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: DG.red, marginBottom: 5, opacity: 0.8,
                }}>
                    {product.category}
                </div>
                <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                    color: DG.white, lineHeight: 1.3, marginBottom: product.tagline ? 6 : 12,
                }}>
                    {product.name}
                </div>
                {product.tagline && (
                    <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.muted,
                        lineHeight: 1.5, marginBottom: 12,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {product.tagline}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 19, fontWeight: 900,
                        color: DG.white, letterSpacing: '-0.5px',
                    }}>
                        {fmtPrice(product.price)}
                    </span>
                    <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: DG.red, boxShadow: `0 0 8px ${DG.red}88`,
                    }} />
                </div>
            </div>
        </div>
    );
}

// ─── FEATURED CARD ────────────────────────────────────────────────────────────
function FeaturedCard({ product }) {
    const nav = useNavigate();
    const [hovered, setHovered] = useState(false);
    if (!product) return null;

    return (
        <div
            onClick={() => nav(`/p/${product.slug}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: 'pointer', borderRadius: 18, overflow: 'hidden',
                position: 'relative', minHeight: 300, display: 'flex', alignItems: 'flex-end',
                background: DG.card,
                border: `1px solid ${hovered ? DG.redBorder : DG.border}`,
                transform: hovered ? 'translateY(-4px)' : 'none',
                boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${DG.redBorder}` : '0 8px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                animation: 'fadeUp 0.45s both',
            }}
        >
            {product.heroImageUrl && (
                <img src={product.heroImageUrl} alt={product.name} style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    transform: hovered ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    filter: 'brightness(0.4)',
                }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.15) 60%, transparent 100%)' }} />

            <div style={{
                position: 'absolute', top: 18, left: 18,
                background: DG.red, color: '#fff', borderRadius: 20,
                padding: '4px 14px', fontFamily: "'DM Sans', sans-serif",
                fontSize: 9, fontWeight: 800, letterSpacing: '2px',
                textTransform: 'uppercase', boxShadow: `0 0 18px ${DG.red}55`,
            }}>Drop destacado</div>

            <div style={{ position: 'relative', padding: '28px 32px', width: '100%' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: DG.red, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>
                    {product.category} · {product.store?.name}
                </div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.8px', marginBottom: 6, lineHeight: 1.1 }}>
                    {product.name}
                </h2>
                {product.tagline && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>
                        {product.tagline}
                    </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 900, color: '#fff' }}>
                        {fmtPrice(product.price)}
                    </span>
                    <span style={{
                        background: hovered ? DG.red : 'rgba(255,255,255,0.1)',
                        color: '#fff', padding: '9px 22px', borderRadius: 9,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                        transition: 'background 0.25s', boxShadow: hovered ? `0 0 18px ${DG.red}55` : 'none',
                    }}>
                        Ver gear
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ search }) {
    return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: 48, height: 48, border: `1px solid ${DG.border}`, borderRadius: '50%', margin: '0 auto 20px' }} />
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700, color: DG.white, marginBottom: 10 }}>
                {search ? `Sin resultados para "${search}"` : 'Sin gears activos'}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: DG.muted }}>
                {search ? 'Probá con otro término.' : 'Los gears verificados van a aparecer acá.'}
            </p>
        </div>
    );
}

// ─── BLOG CAROUSEL ─────────────────────────────────────────────────────────────
function BlogCarousel({ posts }) {
    const nav = useNavigate();
    if (!posts || posts.length === 0) return null;

    return (
        <section style={{ padding: '80px 48px', borderTop: `1px solid ${DG.border}` }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: DG.red, marginBottom: 8 }}>
                            Drop Gear Blog
                        </div>
                        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 900, color: DG.white, letterSpacing: '-1px' }}>
                            Últimas Novedades
                        </h2>
                    </div>
                    <button 
                        onClick={() => nav('/blog')}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: DG.white, background: 'rgba(255,255,255,0.05)', border: `1px solid ${DG.border}`, padding: '10px 24px', borderRadius: 24, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.target.style.background = DG.red; e.target.style.borderColor = DG.red; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = DG.border; }}
                    >
                        Ver todas las notas
                    </button>
                </div>

                <div style={{ 
                    display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 20, 
                    scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' 
                }}>
                    {posts.map(post => (
                        <div 
                            key={post.id} 
                            onClick={() => nav(`/blog/${post.slug}`)}
                            style={{ 
                                minWidth: 320, width: 320, flexShrink: 0, scrollSnapAlign: 'start',
                                background: DG.card, border: `1px solid ${DG.border}`, borderRadius: 16,
                                overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s, border-color 0.3s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = DG.redBorder; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = DG.border; }}
                        >
                            <div style={{ height: 180, background: '#1a1a1a', position: 'relative' }}>
                                {post.thumbnailUrl && <img src={post.thumbnailUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <div style={{ padding: 20 }}>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: DG.muted, marginBottom: 8 }}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: DG.white, marginBottom: 10, lineHeight: 1.3 }}>
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {post.excerpt}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch public products
        fetch(`${API}/api/products/public`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
                    setCategories(cats);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));

        // Fetch latest blog posts
        fetch(`${API}/api/blog`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPosts(data.slice(0, 5));
                }
            })
            .catch(() => { });
    }, []);

    const visible = products.filter(p => {
        const matchCat = category === 'Todos' || p.category === category;
        const matchSearch = !search
            || p.name.toLowerCase().includes(search.toLowerCase())
            || (p.tagline || '').toLowerCase().includes(search.toLowerCase())
            || (p.store?.name || '').toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const featured = visible[0];
    const rest = visible.slice(1);
    const totalStores = [...new Set(products.map(p => p.storeId))].length;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: ${DG.black}; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: ${DG.black}; }
                ::-webkit-scrollbar-thumb { background: rgba(232,50,26,0.3); border-radius: 3px; }
                input::placeholder { color: rgba(240,240,240,0.22); }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <Navbar search={search} setSearch={setSearch} totalProducts={products.length} totalStores={totalStores} />

            {/* ── CATÁLOGO ── */}
            <main style={{ maxWidth: 1280, margin: '0 auto', padding: '128px 48px 100px' }}>

                {/* Encabezado de sección */}
                <div style={{ marginBottom: 36 }}>
                    <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
                        letterSpacing: '3px', textTransform: 'uppercase', color: DG.red,
                        marginBottom: 10,
                    }}>
                        Catálogo
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
                        <h1 style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 38, fontWeight: 900,
                            color: DG.white, letterSpacing: '-1.5px', lineHeight: 1,
                        }}>
                            Gears Verificados
                        </h1>
                    </div>
                    <FilterBar categories={categories} active={category} onSelect={setCategory} count={visible.length} />
                </div>

                {/* Contenido */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim, letterSpacing: '3px', textTransform: 'uppercase' }}>
                            Cargando...
                        </div>
                    </div>
                ) : visible.length === 0 ? (
                    <EmptyState search={search} />
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 20,
                    }}>
                        {/* Featured — ocupa 2 cols */}
                        {featured && !search && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <FeaturedCard product={featured} />
                            </div>
                        )}
                        {/* Grid normal */}
                        {(search ? visible : rest).map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                )}
            </main>

            {/* ── BLOG CAROUSEL ── */}
            <BlogCarousel posts={posts} />

            {/* ── FOOTER ── */}
            <footer style={{
                borderTop: `1px solid ${DG.redBorder}`,
                padding: '32px 48px',
                background: DG.black,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 28 }}>
                    {/* Marca */}
                    <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff', textShadow: `0 0 12px ${DG.red}44`, marginBottom: 6 }}>
                            DROP<span style={{ color: DG.red }}>GEAR</span>
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim, letterSpacing: '1px' }}>Productos Verificados</div>
                    </div>
                    {/* Links */}
                    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: DG.muted, marginBottom: 12 }}>Plataforma</div>
                            {[['Catálogo', '/'], ['Blog', '/blog'], ['Novedades', '/blog']].map(([l, h]) => (
                                <div key={l} style={{ marginBottom: 8 }}><a href={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.mutedDim, textDecoration: 'none' }}>{l}</a></div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: DG.muted, marginBottom: 12 }}>Vendedores</div>
                            {[['Sumá tu marca', '/register'], ['Dashboard', 'http://localhost:3001']].map(([l, h]) => (
                                <div key={l} style={{ marginBottom: 8 }}><a href={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.mutedDim, textDecoration: 'none' }}>{l}</a></div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: DG.muted, marginBottom: 12 }}>Contacto</div>
                            <a href="mailto:info@dropgear.store" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.red, textDecoration: 'none', display: 'block', marginBottom: 8 }}>info@dropgear.store</a>
                            {[['Términos', '#'], ['Privacidad', '#']].map(([l, h]) => (
                                <div key={l} style={{ marginBottom: 8 }}><a href={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.mutedDim, textDecoration: 'none' }}>{l}</a></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: `1px solid ${DG.border}`, paddingTop: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>
                    © 2025 DROP GEAR · Todos los derechos reservados
                </div>
            </footer>
        </>
    );
}
