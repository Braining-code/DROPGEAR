import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL || `${API}`;


const DG = {
    black: '#080808', card: '#111111', red: '#E8321A',
    border: 'rgba(255,255,255,0.07)', muted: 'rgba(255,255,255,0.4)'
};

const formatPrice = (p) => `$${Number(p).toLocaleString('es-AR')}`;

export default function Checkout() {
    const { cart, clearCart } = useCart();
    const nav = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', address: '', city: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const total = cart.reduce((acc, item) => acc + (parseFloat(String(item.product.price).replace(/[^0-9.]/g, '')) * item.qty), 0);
    const tax = total * 0.21;
    const finalTotal = total + tax;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Hit the real API for each item in the cart
            await Promise.all(cart.map(item => 
                fetch(`${API}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: item.product.id,
                        qty: item.qty,
                        customerName: form.name,
                        customerEmail: form.email
                    })
                })
            ));
            
            setSuccess(true);
            clearCart();
            window.scrollTo(0,0);
        } catch (err) {
            alert('Oh no, ocurrió un error al procesar tu orden.');
        } finally {
            setLoading(false);
        }
    };

    const inp = { width: '100%', padding: '14px 16px', background: '#0f0f0f', border: `1px solid ${DG.border}`, borderRadius: 8, color: '#fff', fontSize: 15, fontFamily: "'DM Sans', sans-serif" };
    const label = { display: 'block', fontSize: 12, fontWeight: 700, color: DG.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', background: DG.black, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: 'center', maxWidth: 500, padding: 40, border: `1px solid ${DG.border}`, borderRadius: 24, background: DG.card }}>
                    <div style={{ width: 80, height: 80, background: 'rgba(34,197,94,0.1)', color: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✓</div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12 }}>¡Orden Confirmada!</h1>
                    <p style={{ color: DG.muted, fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
                        Gracias por tu compra, <strong>{form.name}</strong>. Hemos enviado el recibo a <strong>{form.email}</strong> y nos pondremos en contacto apenas despachemos tu equipo hacia <strong>{form.address}</strong>.
                    </p>
                    <button onClick={() => nav('/')} style={{ background: DG.red, color: '#fff', padding: '14px 32px', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', background: DG.black, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#fff', fontSize: 24, marginBottom: 12 }}>Tu carrito está vacío</h1>
                    <button onClick={() => nav('/')} style={{ background: DG.red, color: '#fff', padding: '12px 24px', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>Volver a comparar</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: DG.black, fontFamily: "'DM Sans', sans-serif" }}>
            <header style={{ padding: '24px 48px', borderBottom: `1px solid ${DG.border}`, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div onClick={() => nav('/')} style={{ cursor: 'pointer', display: 'inline-block' }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '3px', textTransform: 'uppercase' }}>DROP<span style={{ color: DG.red }}>GEAR</span> <span style={{fontSize: 12, color: DG.muted, fontWeight: 500, letterSpacing: '1px'}}>Checkout</span></span>
                </div>
            </header>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
                {/* Formulario */}
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>Completar Orden</h2>
                    <p style={{ color: DG.muted, fontSize: 15, marginBottom: 40 }}>Terminá tu compra como invitado, de forma segura.</p>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                            <label style={label}>Nombre Completo</label>
                            <input required style={inp} placeholder="Ej: Juan Pérez" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                        </div>
                        <div>
                            <label style={label}>Correo Electrónico</label>
                            <input required type="email" style={inp} placeholder="juan@gmail.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                            <div>
                                <label style={label}>Dirección de envío</label>
                                <input required style={inp} placeholder="Av. Corrientes 1234" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
                            </div>
                            <div>
                                <label style={label}>Ciudad</label>
                                <input required style={inp} placeholder="CABA" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} />
                            </div>
                        </div>

                        <div style={{ padding: '24px', background: 'rgba(232,50,26,0.05)', border: `1px solid ${DG.redBorder}`, borderRadius: 12, marginTop: 16 }}>
                            <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 8 }}>💳 Pago contrareembolso o Simulado</h4>
                            <p style={{ fontSize: 13, color: DG.muted, lineHeight: 1.5, margin: 0 }}>En este entorno de demo, no te pediremos los datos de tu tarjeta. Al confirmar la orden asumiremos la validación del pago simulado y guardaremos el pedido para el vendedor.</p>
                        </div>

                        <button disabled={loading} type="submit" style={{ background: DG.red, color: '#fff', border: 'none', padding: '18px', borderRadius: 8, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 16, boxShadow: `0 4px 20px ${DG.red}44` }}>
                            {loading ? 'Procesando...' : `Confirmar y Pagar ${formatPrice(finalTotal)}`}
                        </button>
                    </form>
                </div>

                {/* Resumen */}
                <div>
                    <div style={{ background: DG.card, border: `1px solid ${DG.border}`, borderRadius: 24, padding: 32, position: 'sticky', top: 120 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Resumen de Compra</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                            {cart.map(item => (
                                <div key={item.product.id} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: 8, background: '#1a1a1a', overflow: 'hidden' }}>
                                        <img src={item.product.image || item.product.heroImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.product.name}</div>
                                        <div style={{ fontSize: 12, color: DG.muted }}>Cant: {item.qty}</div>
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                                        {formatPrice(parseFloat(String(item.product.price).replace(/[^0-9.]/g, '')) * item.qty)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: `1px solid ${DG.border}`, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: DG.muted, fontSize: 14 }}>
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: DG.muted, fontSize: 14 }}>
                                <span>IVA (21%)</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 20, fontWeight: 800, marginTop: 8, paddingTop: 16, borderTop: `1px dashed ${DG.border}` }}>
                                <span>Total a pagar</span>
                                <span>{formatPrice(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
