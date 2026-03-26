
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || `${API}`;


export default function Register() {
    const [form, setForm] = useState({
        name: '', razonSocial: '', cuit: '', email: '', password: '', telefono: '', website: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/api/stores/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Ocurrió un error al registrar la tienda.');
            }
        } catch (e) {
            console.error(e);
            setError('No se pudo conectar con el servidor. Verificá que la API esté corriendo en el puerto 4000.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box', background: '#0d0d0d',
        border: '1px solid rgba(232,50,26,0.25)', borderRadius: 8, padding: '12px 14px',
        color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 15, marginBottom: 16,
        outline: 'none',
        transition: 'border-color 0.2s',
    };
    const labelStyle = { display: 'block', marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' };

    if (success) {
        return (
            <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ maxWidth: 460, textAlign: 'center', padding: 40, border: '1px solid rgba(232,50,26,0.3)', borderRadius: 16, background: '#0f0f0f', boxShadow: '0 0 40px rgba(232,50,26,0.1)' }}>
                    <div style={{ fontSize: 40, marginBottom: 20 }}>✅</div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>¡Solicitud enviada!</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 30 }}>
                        Hemos recibido tus datos. Nuestro equipo verificará la información y te notificará cuando tu cuenta esté activa en DROP GEAR.
                    </p>
                    <button onClick={() => navigate('/')} style={{ background: '#E8321A', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14, boxShadow: '0 0 20px rgba(232,50,26,0.4)' }}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#080808', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ width: '100%', maxWidth: 500, padding: 40, background: '#0f0f0f', border: '1px solid rgba(232,50,26,0.2)', borderRadius: 16, boxShadow: '0 0 60px rgba(232,50,26,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 4, textShadow: '0 0 20px rgba(232,50,26,0.6)' }}>
                        DROP<span style={{ color: '#E8321A', textShadow: '0 0 20px #E8321A' }}>GEAR</span>
                    </div>
                    <div style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 24 }}>Productos Verificados</div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Sumá tu marca</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Ingresá los datos de tu empresa para solicitar el alta</p>
                </div>

                <form onSubmit={handleRegister}>
                    <label style={labelStyle}>Nombre de tu marca / tienda</label>
                    <input required type="text" placeholder="Ej. Studio Black" style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Razón Social</label>
                            <input required placeholder="Ej: Importadora SRL" style={inputStyle} value={form.razonSocial} onChange={e => setForm({ ...form, razonSocial: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>CUIT</label>
                            <input required placeholder="Sin guiones" style={inputStyle} value={form.cuit} onChange={e => setForm({ ...form, cuit: e.target.value })} />
                        </div>
                    </div>

                    <label style={labelStyle}>Email corporativo</label>
                    <input required type="email" placeholder="contacto@tumarca.com" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

                    {/* HONEYPOT INVISIBLE PARA BOTS */}
                    <input type="url" name="website" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />

                    <label style={labelStyle}>Teléfono / WhatsApp</label>
                    <input required type="text" placeholder="+54 9 11 1234 5678" style={inputStyle} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />

                    <label style={labelStyle}>Contraseña para el dashboard</label>
                    <input required type="password" placeholder="••••••••" style={inputStyle} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

                    {error && (
                        <div style={{ background: 'rgba(232,50,26,0.1)', border: '1px solid rgba(232,50,26,0.35)', borderRadius: 8, padding: '12px 16px', marginBottom: 12, color: '#ff8070', fontSize: 14, lineHeight: 1.5 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button disabled={loading} type="submit" style={{ width: '100%', background: '#E8321A', color: '#fff', border: 'none', padding: '16px', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 10, letterSpacing: '0.5px', boxShadow: loading ? 'none' : '0 0 24px rgba(232,50,26,0.45)', transition: 'box-shadow 0.3s' }}>
                        {loading ? 'Enviando...' : 'Solicitar alta →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
