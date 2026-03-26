import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DG = {
    black: '#080808', surface: '#0f0f0f', card: '#111111',
    border: 'rgba(255,255,255,0.07)', redBorder: 'rgba(232,50,26,0.25)',
    red: '#E8321A', white: '#F0F0F0', muted: 'rgba(240,240,240,0.4)',
    mutedDim: 'rgba(240,240,240,0.2)',
};

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
    const nav = useNavigate();
    return (
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
            background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${DG.border}`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58, padding: '0 48px' }}>
                <div onClick={() => nav('/')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff', textShadow: `0 0 20px ${DG.red}55` }}>
                        DROP<span style={{ color: DG.red, textShadow: `0 0 24px ${DG.red}99` }}>GEAR</span>
                    </span>
                </div>
                <nav style={{ display: 'flex', gap: 4 }}>
                    {[['Catálogo', '/'], ['Blog', '/blog']].map(([label, href]) => (
                        <a key={label} onClick={() => nav(href)} href={href} style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                            color: DG.muted, textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
                        }}>{label}</a>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        fetch(`${API}/api/blog`)
            .then(r => r.json())
            .then(d => Array.isArray(d) ? setPosts(d) : [])
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: ${DG.black}; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: ${DG.black}; }
                ::-webkit-scrollbar-thumb { background: rgba(232,50,26,0.3); border-radius: 3px; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            <Navbar />

            <main style={{ maxWidth: 1040, margin: '0 auto', padding: '110px 48px 100px' }}>
                <div style={{ marginBottom: 48 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: DG.red, marginBottom: 10 }}>
                        Blog
                    </div>
                    <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 38, fontWeight: 900, color: DG.white, letterSpacing: '-1.5px' }}>
                        DROP GEAR · Novedades
                    </h1>
                </div>

                {loading ? (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim, letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', padding: 80 }}>Cargando...</div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ width: 40, height: 40, border: `1px solid ${DG.border}`, borderRadius: '50%', margin: '0 auto 20px' }} />
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: DG.muted }}>Todavía no hay notas publicadas.</p>
                    </div>
                ) : (
                    <div>
                        {posts.length > 0 && <FeaturedPostCard post={posts[0]} onClick={() => nav(`/blog/${posts[0].slug}`)} />}
                        
                        {posts.length > 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                                {posts.slice(1).map((post, i) => (
                                    <PostGridCard key={post.id} post={post} index={i} onClick={() => nav(`/blog/${post.slug}`)} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

function estimateReadingTime(text) {
    if (!text) return "1 min";
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min`;
}

function FeaturedPostCard({ post, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', flexDirection: 'column', cursor: 'pointer',
                borderRadius: 24, overflow: 'hidden', background: DG.card,
                border: `1px solid ${hovered ? DG.redBorder : DG.border}`,
                transition: 'transform 0.4s, border-color 0.4s, box-shadow 0.4s',
                transform: hovered ? 'translateY(-6px)' : 'none',
                boxShadow: hovered ? `0 24px 50px rgba(0,0,0,0.6)` : `0 8px 30px rgba(0,0,0,0.4)`,
                position: 'relative', minHeight: 460, marginBottom: 48,
                animation: 'fadeUp 0.6s ease-out both'
            }}
        >
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                {post.coverUrl || post.thumbnailUrl ? (
                    <img src={post.coverUrl || post.thumbnailUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', transform: hovered ? 'scale(1.03)' : 'scale(1)', filter: 'brightness(0.55)' }} />
                ) : <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />}
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 60%, transparent 100%)', zIndex: 1 }} />
            
            <div style={{ position: 'relative', zIndex: 2, padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', flex: 1 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ background: DG.red, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: `0 0 12px ${DG.red}55` }}>Destacado</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{fmtDate(post.createdAt)}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>• ⏱ {estimateReadingTime(post.content || post.excerpt)}</span>
                </div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12, maxWidth: 800 }}>
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, maxWidth: 700, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {post.excerpt}
                    </p>
                )}
            </div>
        </div>
    );
}

function PostGridCard({ post, index, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', flexDirection: 'column', cursor: 'pointer',
                borderRadius: 16, overflow: 'hidden', background: DG.card,
                border: `1px solid ${hovered ? DG.redBorder : DG.border}`,
                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                transform: hovered ? 'translateY(-4px)' : 'none',
                boxShadow: hovered ? `0 12px 30px rgba(0,0,0,0.4)` : 'none',
                height: '100%',
                animation: `fadeUp 0.5s ${index * 0.05}s ease-out both`
            }}
        >
            <div style={{ height: 200, width: '100%', overflow: 'hidden', position: 'relative', background: '#161616' }}>
                {post.thumbnailUrl || post.coverUrl ? (
                    <img src={post.thumbnailUrl || post.coverUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered ? 'scale(1.05)' : 'scale(1)', filter: hovered ? 'brightness(0.9)' : 'brightness(0.7)' }} />
                ) : <div style={{ width: '100%', height: '100%' }} />}
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: DG.red, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{fmtDate(post.createdAt)}</span>
                    <span style={{ fontSize: 11, color: DG.muted, fontFamily: "'DM Sans', sans-serif" }}>⏱ {estimateReadingTime(post.content || post.excerpt)}</span>
                </div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 800, color: DG.white, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 10 }}>
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.muted, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', flex: 1 }}>
                        {post.excerpt}
                    </p>
                )}
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer style={{ borderTop: `1px solid ${DG.redBorder}`, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, background: DG.black }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                DROP<span style={{ color: DG.red }}>GEAR</span>
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim }}>© 2025 DROP GEAR · Productos Verificados</span>
        </footer>
    );
}
