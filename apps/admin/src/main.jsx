import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) return setError(data.error || 'Credenciales inválidas.');
            if (data.user.role !== 'admin') return setError('Esta cuenta no tiene acceso de administrador.');
            localStorage.setItem('admin_token', data.token);
            onLogin(data.token);
        } catch { setError('No se pudo conectar con el servidor.'); }
        finally { setLoading(false); }
    };

    const inp = { width: '100%', boxSizing: 'border-box', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 15, marginBottom: 14 };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ width: 380, padding: 40, background: '#111', border: '1px solid #222', borderRadius: 16 }}>
                <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 6, letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 0 16px rgba(232,50,26,0.5)' }}>DROP<span style={{ color: '#E8321A', textShadow: '0 0 20px #E8321A' }}>GEAR</span> <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', textShadow: 'none' }}>Admin</span></h1>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 28 }}>Panel de administración</p>
                <form onSubmit={handleLogin}>
                    <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>EMAIL</label>
                    <input style={inp} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@shopping.com" />
                    <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>CONTRASEÑA</label>
                    <input style={inp} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
                    <button disabled={loading} type="submit" style={{ width: '100%', background: '#E8321A', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 20px rgba(232,50,26,0.4)' }}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ── Stores Tab ───────────────────────────────────────────────────────────────
function StoresTab({ token, stores, setStores }) {
    const approveStore = async (id) => {
        const res = await fetch(`${API}/api/stores/${id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setStores(stores.map(s => s.id === id ? { ...s, active: true, verified: true } : s));
    };
    const deactivateStore = async (id) => {
        if (!confirm('¿Desactivar esta tienda?')) return;
        const res = await fetch(`${API}/api/stores/${id}/deactivate`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setStores(stores.map(s => s.id === id ? { ...s, active: false } : s));
    };
    const R = '#E8321A'; const MUT = 'rgba(240,240,240,0.4)';
    return (
        <div style={{ background: '#111', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#F0F0F0', marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>Proveedores</h2>
                <p style={{ fontSize: 12, color: MUT, fontFamily: "'DM Sans', sans-serif" }}>{stores.length} tiendas registradas</p>
            </div>
            {stores.length === 0 ? (
                <p style={{ padding: 32, color: MUT, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>No hay tiendas registradas aún.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                {['Nombre / Slug', 'CUIT / Razón Social', 'Estado', 'Acciones'].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map(store => (
                                <tr key={store.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#F0F0F0' }}>
                                        {store.name}<br />
                                        <span style={{ fontWeight: 400, color: MUT, fontSize: 11 }}>/{store.slug}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: MUT }}>{store.cuit ? `${store.cuit} — ${store.razonSocial}` : '—'}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        {store.active
                                            ? <span style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Activa</span>
                                            : store.verified
                                                ? <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Desactivada</span>
                                                : <span style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Pendiente</span>}
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {!store.active && (
                                                <button onClick={() => approveStore(store.id)} style={{ background: R, color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 7, fontWeight: 700, cursor: 'pointer', fontSize: 12, boxShadow: '0 0 12px rgba(232,50,26,0.35)', fontFamily: "'DM Sans', sans-serif" }}>Aprobar</button>
                                            )}
                                            {store.active && (
                                                <button onClick={() => deactivateStore(store.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', padding: '7px 16px', borderRadius: 7, fontWeight: 600, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Desactivar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── Home Editor Tab ─────────────────────────────────────────────────
function HomeEditorTab({ token }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const R = '#E8321A'; const BD = 'rgba(255,255,255,0.06)'; const MUT = 'rgba(240,240,240,0.4)';

    useEffect(() => {
        fetch(`${API}/api/products`)
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts([...data].sort((a, b) => {
                        if (a.status === 'activo' && b.status !== 'activo') return -1;
                        if (a.status !== 'activo' && b.status === 'activo') return 1;
                        return (a.featuredOrder || 0) - (b.featuredOrder || 0);
                    }));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleDragStart = (i) => { dragItem.current = i; };
    const handleDragEnter = (i) => { dragOverItem.current = i; };
    const handleDragEnd = () => {
        const list = [...products];
        const dragged = list.splice(dragItem.current, 1)[0];
        list.splice(dragOverItem.current, 0, dragged);
        dragItem.current = null; dragOverItem.current = null;
        setProducts(list);
    };
    const saveOrder = async () => {
        setSaving(true);
        const items = products.map((p, i) => ({ id: p.id, order: i }));
        try {
            await fetch(`${API}/api/products/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ items }),
            });
            setSaved(true); setTimeout(() => setSaved(false), 2000);
        } catch { }
        setSaving(false);
    };
    const formatPrice = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '';

    if (loading) return <p style={{ color: MUT, padding: 20, fontFamily: "'DM Sans', sans-serif" }}>Cargando productos...</p>;

    return (
        <div style={{ background: '#111', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#F0F0F0', marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>Catálogo · Orden Home</h2>
                    <p style={{ fontSize: 12, color: MUT, fontFamily: "'DM Sans', sans-serif" }}>Arrastrar para cambiar el orden en la home pública</p>
                </div>
                <button onClick={saveOrder} disabled={saving} style={{
                    background: saved ? '#16A34A' : R, color: '#fff', border: 'none',
                    padding: '9px 22px', borderRadius: 8, fontWeight: 700, fontSize: 13,
                    cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.3s',
                    boxShadow: saved ? 'none' : `0 0 18px ${R}44`,
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar orden'}
                </button>
            </div>
            <div style={{ padding: '8px 0' }}>
                {products.map((p, i) => (
                    <div
                        key={p.id} draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragEnter={() => handleDragEnter(i)}
                        onDragEnd={handleDragEnd}
                        onDragOver={e => e.preventDefault()}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '10px 24px', cursor: 'grab',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            transition: 'background 0.1s', userSelect: 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 18, flexShrink: 0 }}>⠿</div>
                        <div style={{ width: 24, textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', background: p.bgColor || '#1a1a1a', flexShrink: 0 }}>
                            {p.heroImageUrl
                                ? <img src={p.heroImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: MUT }}>·</div>
                            }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: MUT, fontFamily: "'DM Sans', sans-serif" }}>{p.store?.name || 'Official Dealer'} · {p.category}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{formatPrice(p.price)}</div>
                        <div style={{ flexShrink: 0 }}>
                            {p.status === 'activo'
                                ? <span style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>Visible</span>
                                : <span style={{ background: 'rgba(255,255,255,0.05)', color: MUT, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>Oculto</span>
                            }
                        </div>
                        <a href={`http://localhost:3000/p/${p.slug}`} target="_blank" rel="noreferrer"
                            style={{ flexShrink: 0, fontSize: 11, color: R, textDecoration: 'none', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
                            onClick={e => e.stopPropagation()}>Ver →</a>
                    </div>
                ))}
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans', sans-serif" }}>
                Solo los productos con estado Visible aparecen en la home pública
            </div>
        </div>
    );
}

// ── Main Admin Dashboard ──────────────────────────────────────────────
export default function AdminDashboard() {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('stores');
    const R = '#E8321A';

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch(`${API}/api/stores/all`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('admin_token'); setToken(null); return null;
                }
                return res.json();
            })
            .then(data => { if (data) setStores(data); setLoading(false); })
            .catch(() => { setError('Error al cargar tiendas.'); setLoading(false); });
    }, [token]);

    const logout = () => { localStorage.removeItem('admin_token'); setToken(null); };
    if (!token) return <LoginScreen onLogin={setToken} />;

    const TABS = [
        { id: 'stores', label: 'Proveedores' },
        { id: 'sales', label: 'Ventas' },
        { id: 'blog', label: 'Blog' },
        { id: 'home', label: 'Home Editor' },
    ];

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", padding: '32px 40px', background: '#080808', minHeight: '100vh', boxSizing: 'border-box' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                body { margin: 0; background: #080808; }
                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: #0f0f0f; }
                ::-webkit-scrollbar-thumb { background: rgba(232,50,26,0.3); border-radius: 3px; }
            `}</style>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                {/* Topbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#fff', textShadow: `0 0 20px ${R}44`, marginBottom: 3 }}>
                            DROP<span style={{ color: R, textShadow: `0 0 24px ${R}` }}>GEAR</span>{' '}
                            <span style={{ fontSize: 13, fontWeight: 400, letterSpacing: '1px', color: 'rgba(240,240,240,0.3)', textShadow: 'none' }}>Admin</span>
                        </h1>
                        <p style={{ color: 'rgba(240,240,240,0.3)', fontSize: 12, letterSpacing: '1px' }}>Panel de administración</p>
                    </div>
                    <button onClick={logout} style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(240,240,240,0.5)', borderRadius: 8, padding: '8px 18px',
                        fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    }}
                        onMouseEnter={e => { e.target.style.borderColor = 'rgba(232,50,26,0.4)'; e.target.style.color = '#fff'; }}
                        onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'rgba(240,240,240,0.5)'; }}
                    >Cerrar sesión</button>
                </div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 24, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                            background: tab === t.id ? R : 'transparent',
                            color: tab === t.id ? '#fff' : 'rgba(240,240,240,0.35)',
                            border: 'none', padding: '8px 20px', borderRadius: 7,
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: tab === t.id ? `0 0 16px ${R}44` : 'none',
                        }}>{t.label}</button>
                    ))}
                </div>
                {/* Content */}
                {tab === 'stores' && (
                    loading ? <p style={{ color: 'rgba(240,240,240,0.3)', fontSize: 13 }}>Cargando...</p>
                        : error ? <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>
                            : <StoresTab token={token} stores={stores} setStores={setStores} />
                )}
                {tab === 'home' && <HomeEditorTab token={token} />}
                {tab === 'blog' && <BlogTab token={token} />}
                {tab === 'sales' && <SalesTab token={token} />}
            </div>
        </div>
    );
}

// ── Sales Tab ─────────────────────────────────────────────────────────────────
function SalesTab({ token }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const MUT = 'rgba(240,240,240,0.4)';

    useEffect(() => {
        fetch(`${API}/api/orders/all`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    const formatPrice = (p) => p != null ? `$${Number(p).toLocaleString('es-AR')}` : '';
    const totalVentas = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const totalQty = orders.reduce((acc, o) => acc + (o.qty || 1), 0);
    const ticketPromedio = orders.length ? totalVentas / orders.length : 0;

    return (
        <div style={{ background: '#111', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, padding: '24px 24px 0 24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 11, color: MUT, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 8 }}>Total Ventas</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{formatPrice(totalVentas)}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 11, color: MUT, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 8 }}>Productos Vendidos</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{totalQty}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 11, color: MUT, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 8 }}>Ticket Promedio</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{formatPrice(ticketPromedio.toFixed(0))}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 11, color: MUT, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 8 }}>Total Órdenes</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{orders.length}</div>
                </div>
            </div>

            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginTop: 8 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#F0F0F0', marginBottom: 2 }}>Registro de Órdenes</h2>
                <p style={{ fontSize: 12, color: MUT }}>Historial completo de ventas en la plataforma</p>
            </div>
            {loading ? (
                <p style={{ padding: 32, color: MUT, fontSize: 14 }}>Cargando órdenes...</p>
            ) : orders.length === 0 ? (
                <p style={{ padding: 32, color: MUT, fontSize: 14 }}>No hay ventas registradas.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                {['Fecha', 'Cliente', 'Producto', 'Tienda', 'Monto', 'Estado'].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '14px 20px', color: '#F0F0F0' }}>{new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
                                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#F0F0F0' }}>
                                        {o.customerName}<br />
                                        <span style={{ fontWeight: 400, color: MUT, fontSize: 11 }}>{o.customerEmail}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#ccc' }}>{o.qty}x {o.product?.name || 'Desconocido'}</td>
                                    <td style={{ padding: '14px 20px', color: MUT }}>{o.product?.store?.name || '—'}</td>
                                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#F0F0F0' }}>{formatPrice(o.total)}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ 
                                            background: o.status === 'enviado' ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.12)',
                                            color: o.status === 'enviado' ? '#4ade80' : '#fbbf24',
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' 
                                        }}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── BlogTab ───────────────────────────────────────────────────────────────────
function BlogTab({ token }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', excerpt: '', content: '', thumbnailUrl: '', coverUrl: '', published: false });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const load = () => {
        setLoading(true);
        fetch(`${API}/api/blog/all`, { headers })
            .then(r => r.json())
            .then(d => Array.isArray(d) ? setPosts(d) : [])
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openNew = () => { setEditing(null); setForm({ title: '', excerpt: '', content: '', thumbnailUrl: '', coverUrl: '', published: false }); setShowForm(true); };
    
    const openEdit = async (p) => {
        // Fetch full draft from backend to get content (since /all might not have content in some setups, but here it does mostly)
        // Wait, standard get all didn't fetch content. Let's fetch the full draft.
        try {
            const res = await fetch(`${API}/api/blog/draft/${p.id}`, { headers: { Authorization: `Bearer ${token}` } });
            const pFull = await res.json();
            setEditing(pFull); 
            setForm({ title: pFull.title, excerpt: pFull.excerpt || '', content: pFull.content || '', thumbnailUrl: pFull.thumbnailUrl || '', coverUrl: pFull.coverUrl || '', published: pFull.published }); 
            setShowForm(true);
        } catch(e) {}
    };

    const handleUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API}/api/uploads`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.url) setForm(f => ({ ...f, [field]: data.url }));
        } catch (err) {}
    };

    const save = async () => {
        if (!form.title || !form.content) return setMsg('Título y contenido son requeridos.');
        setSaving(true); setMsg(null);
        try {
            const url = editing ? `${API}/api/blog/${editing.id}` : `${API}/api/blog`;
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json(); return setMsg(d.error || 'Error guardando.'); }
            setShowForm(false); load();
        } catch { setMsg('Error de red.'); }
        finally { setSaving(false); }
    };

    const del = async (id) => {
        if (!confirm('¿Eliminar este post?')) return;
        await fetch(`${API}/api/blog/${id}`, { method: 'DELETE', headers });
        load();
    };

    const inp = { width: '100%', boxSizing: 'border-box', background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', fontSize: 14, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" };
    const label = { fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 };

    if (showForm) return (
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>{editing ? 'Editar post' : 'Nueva nota'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            
            <label style={label}>Título *</label>
            <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título del post" />
            
            <label style={label}>Excerpt (resumen corto)</label>
            <textarea style={{...inp, minHeight:60, resize:"vertical"}} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Breve descripción..." />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                    <label style={label}>Miniatura (Lista de posts) <span style={{fontSize:10, color:'#999'}}>1:1 o 4:3</span></label>
                    <div style={{ width: "100%", height: 120, background: '#fafafa', border: '1px dashed #ccc', borderRadius: 8, overflow: "hidden", position: "relative" }}>
                    {form.thumbnailUrl && <img src={form.thumbnailUrl} style={{ width:"100%", height:"100%", objectFit:"cover"}} />}
                    <label style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, cursor: "pointer", opacity: form.thumbnailUrl ? 0 : 1, transition: "opacity 0.2s" }}>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e => handleUpload(e, 'thumbnailUrl')}/>
                        {form.thumbnailUrl ? "Cambiar" : "Subir imagen"}
                    </label>
                    </div>
                </div>
                <div>
                    <label style={label}>Portada Interna (Cabecera) <span style={{fontSize:10, color:'#999'}}>16:9</span></label>
                    <div style={{ width: "100%", height: 120, background: '#fafafa', border: '1px dashed #ccc', borderRadius: 8, overflow: "hidden", position: "relative" }}>
                    {form.coverUrl && <img src={form.coverUrl} style={{ width:"100%", height:"100%", objectFit:"cover"}} />}
                    <label style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, cursor: "pointer", opacity: form.coverUrl ? 0 : 1, transition: "opacity 0.2s" }}>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e => handleUpload(e, 'coverUrl')}/>
                        {form.coverUrl ? "Cambiar" : "Subir imagen"}
                    </label>
                    </div>
                </div>
            </div>

            <label style={label}>Contenido * (HTML o Markdown)</label>
            <div style={{ marginBottom: 20 }}>
               <MarkdownEditorAdmin value={form.content} onChange={c => setForm(f => ({ ...f, content: c }))} token={token} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, background: '#f5f5f5', padding: '12px 16px', borderRadius: 8 }}>
                <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 18, height: 18 }} />
                <label htmlFor="pub" style={{ fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#111' }}>🟢 Aprobar y Publicar en el Blog</label>
            </div>
            
            {msg && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>{msg}</div>}
            
            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={save} disabled={saving} style={{ background: '#E8321A', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                    {saving ? 'Guardando...' : (editing ? 'Actualizar' : 'Guardar')}
                </button>
                <button onClick={() => setShowForm(false)} style={{ background: '#f4f4f5', border: 'none', padding: '11px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>Blog · DROP GEAR</h2>
                    <p style={{ fontSize: 12, color: '#888' }}>{posts.length} {posts.length === 1 ? 'nota' : 'notas'}</p>
                </div>
                <button onClick={openNew} style={{ background: '#E8321A', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14, boxShadow: '0 0 16px rgba(232,50,26,0.3)' }}>
                    + Nueva nota
                </button>
            </div>
            {loading ? (
                <p style={{ padding: 32, color: '#888', fontSize: 14 }}>Cargando...</p>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                    <p style={{ fontSize: 15, color: '#aaa', marginBottom: 20 }}>Todavía no hay notas.</p>
                    <button onClick={openNew} style={{ background: '#E8321A', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Crear primera nota</button>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            {['Posts', 'Estado', 'Autor', 'Fecha', 'Acciones'].map(h => (
                                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5', background: !p.published ? '#fffaf0' : 'transparent' }}>
                                <td style={{ padding: '14px 20px', display:"flex", alignItems:"center", gap: 12 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 6, background: '#eee', overflow: 'hidden', flexShrink: 0 }}>
                                    {(p.thumbnailUrl || p.coverUrl) 
                                        ? <img src={p.thumbnailUrl || p.coverUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : null}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{p.title}</div>
                                        {p.excerpt && <div style={{ fontSize: 12, color: '#999', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 280 }}>{p.excerpt}</div>}
                                    </div>
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: p.published ? 'rgba(34,197,94,0.1)' : '#fef3c7', color: p.published ? '#16a34a' : '#d97706' }}>
                                        {p.published ? 'Publicado' : 'Pendiente Rev.'}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: 12, color: '#555', fontWeight: 600 }}>
                                    {p.author?.email || 'Admin'}
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: 13, color: '#888' }}>
                                    {new Date(p.createdAt).toLocaleDateString('es-AR')}
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(p)} style={{ background: !p.published ? '#E8321A' : '#f4f4f5', color: !p.published ? '#fff' : '#333', border: 'none', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{p.published ? 'Editar' : 'Revisar'}</button>
                                        <button onClick={() => del(p.id)} style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ── MarkdownEditorAdmin ────────────────────────────────────────────────────────
function MarkdownEditorAdmin({ value, onChange, token }) {
    const textareaRef = useRef(null);
    
    const insert = (before, after = "") => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const text = value || "";
      const selected = text.substring(start, end);
      const newText = text.substring(0, start) + before + selected + after + text.substring(end);
      onChange(newText);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    };
  
    const uploadImage = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${API}/api/uploads`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (data.url) insert(`![Imagen](${data.url})`);
      } catch (err) {}
      e.target.value = null;
    };
  
    const btnStyle = { background: "#fff", border: `1px solid #e5e7eb`, color: '#333', borderRadius: 4, padding: "4px 8px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center" };
  
    return (
      <div style={{ border: `1px solid #e5e7eb`, borderRadius: 8, overflow: "hidden", background: '#fafafa' }}>
         <div style={{ display: "flex", gap: 6, padding: "8px 12px", background: '#f4f4f5', borderBottom: `1px solid #e5e7eb` }}>
           <button type="button" onClick={() => insert("**", "**")} style={btnStyle}><b>B</b></button>
           <button type="button" onClick={() => insert("*", "*")} style={btnStyle}><i>I</i></button>
           <button type="button" onClick={() => insert("## ", "")} style={{...btnStyle, fontWeight:600}}>H2</button>
           <button type="button" onClick={() => insert("### ", "")} style={{...btnStyle, fontWeight:600}}>H3</button>
           <div style={{width: 1, background: '#e5e7eb', margin: "0 4px"}}/>
           <button type="button" onClick={() => insert("[Enlace](", ")")} style={btnStyle}>🔗</button>
           <label style={{ ...btnStyle, cursor: "pointer", margin:0 }}>
             🖼️ Foto online
             <input type="file" style={{ display: "none" }} accept="image/*" onChange={uploadImage} />
           </label>
         </div>
         <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", minHeight: 350, padding: "16px", background: "transparent", color: '#111', border: "none", resize: "vertical", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, boxSizing: "border-box", outline:"none" }} placeholder="Escribe tu contenido usando Markdown o HTML..." />
      </div>
    );
  }

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AdminDashboard />
    </React.StrictMode>
);
