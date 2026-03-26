import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DG = {
    black: '#080808', border: 'rgba(255,255,255,0.07)', redBorder: 'rgba(232,50,26,0.25)',
    red: '#E8321A', white: '#F0F0F0', muted: 'rgba(240,240,240,0.4)', mutedDim: 'rgba(240,240,240,0.2)',
};

function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function estimateReadingTime(text) {
    if (!text) return "1 min";
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min de lectura`;
}

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        fetch(`${API}/api/blog/${slug}`)
            .then(r => {
                if (!r.ok) { setNotFound(true); return null; }
                return r.json();
            })
            .then(d => d && setPost(d))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: ${DG.black}; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: ${DG.black}; }
                ::-webkit-scrollbar-thumb { background: rgba(232,50,26,0.3); border-radius: 3px; }
                .post-content { color: rgba(240,240,240,0.7); font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.8; }
                .post-content h2 { color: #F0F0F0; font-size: 22px; font-weight: 800; margin: 36px 0 12px; letter-spacing: -0.5px; }
                .post-content h3 { color: #F0F0F0; font-size: 17px; font-weight: 700; margin: 28px 0 10px; }
                .post-content p { margin-bottom: 20px; }
                .post-content strong { color: #F0F0F0; font-weight: 700; }
                .post-content a { color: #E8321A; }
                .post-content ul, .post-content ol { padding-left: 24px; margin-bottom: 20px; }
                .post-content li { margin-bottom: 8px; }
                .post-content blockquote { border-left: 3px solid #E8321A; padding-left: 20px; margin: 28px 0; color: rgba(240,240,240,0.5); font-style: italic; }
                .post-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 40px 0; }
                .post-content pre { background: #111; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 20px; overflow-x: auto; margin-bottom: 20px; font-size: 14px; font-family: monospace; }
                .post-content code { background: #1a1a1a; padding: 2px 8px; border-radius: 4px; font-size: 14px; color: #E8321A; font-family: monospace; }
                .post-content pre code { background: none; color: rgba(240,240,240,0.8); padding: 0; }
            `}</style>

            {/* NAV */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${DG.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58, padding: '0 48px' }}>
                    <div onClick={() => nav('/')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff', textShadow: `0 0 20px ${DG.red}55` }}>
                            DROP<span style={{ color: DG.red }}>GEAR</span>
                        </span>
                    </div>
                    <button onClick={() => nav('/blog')} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        ← Volver al blog
                    </button>
                </div>
            </header>

            <main style={{ maxWidth: 760, margin: '0 auto', padding: '110px 48px 100px' }}>
                {loading ? (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim, letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', paddingTop: 80 }}>Cargando...</div>
                ) : notFound ? (
                    <div style={{ textAlign: 'center', paddingTop: 80 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: DG.muted, marginBottom: 24 }}>Post no encontrado.</p>
                        <button onClick={() => nav('/blog')} style={{ fontFamily: "'DM Sans', sans-serif", background: DG.red, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                            Ver todas las notas
                        </button>
                    </div>
                ) : post ? (
                    <>
                        {/* Header del post */}
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: DG.red }}>
                                    {fmtDate(post.createdAt)}
                                </div>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: '1px' }}>
                                    ⏱ {estimateReadingTime(post.content || post.excerpt)}
                                </div>
                            </div>
                            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 42, fontWeight: 900, color: DG.white, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: 20 }}>
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: DG.muted, lineHeight: 1.6, marginBottom: 32, borderBottom: `1px solid ${DG.border}`, paddingBottom: 32 }}>
                                    {post.excerpt}
                                </p>
                            )}
                            {post.coverUrl && (
                                <img src={post.coverUrl} alt={post.title} style={{ width: '100%', borderRadius: 14, marginBottom: 40, maxHeight: 420, objectFit: 'cover', filter: 'brightness(0.8)' }} />
                            )}
                        </div>

                        {/* Contenido */}
                        <div
                            className="post-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Footer post */}
                        <div style={{ marginTop: 64, paddingTop: 32, borderTop: `1px solid ${DG.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: DG.mutedDim }}>DROP GEAR · Productos Verificados</span>
                            <button onClick={() => nav('/blog')} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: DG.red, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                ← Más notas
                            </button>
                        </div>
                    </>
                ) : null}
            </main>
        </>
    );
}
