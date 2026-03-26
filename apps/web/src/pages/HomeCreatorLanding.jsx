import React from 'react';
import { Link } from 'react-router-dom';

const PROVIDER_URL = 'http://localhost:3001';
const DEMO_SLUG = 'gran-reserva';

const DG_RED = '#E8321A';
const DG_ORANGE = '#FF6A1A';

export default function HomeCreatorLanding() {
    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#080808', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* NAVBAR */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 48px', alignItems: 'center', borderBottom: '1px solid rgba(232,50,26,0.12)' }}>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', textShadow: `0 0 16px ${DG_RED}88` }}>
                    DROP<span style={{ color: DG_RED, textShadow: `0 0 20px ${DG_RED}` }}>GEAR</span>
                </div>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <a href="#como-funciona" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Cómo funciona</a>
                    <a href="#beneficios" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Beneficios</a>
                    <a href={PROVIDER_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                        Login
                    </a>
                    <Link to="/register" style={{ background: DG_RED, color: '#fff', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: `0 0 20px ${DG_RED}55`, letterSpacing: '0.3px' }}>
                        Sumá tu marca
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>

                {/* Glows de fondo */}
                <div style={{ position: 'absolute', top: '5%', left: '15%', width: 400, height: 400, background: DG_RED, filter: 'blur(160px)', opacity: 0.12, zIndex: 0, borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '5%', right: '15%', width: 350, height: 350, background: DG_ORANGE, filter: 'blur(160px)', opacity: 0.1, zIndex: 0, borderRadius: '50%' }} />

                <div style={{ zIndex: 1, maxWidth: 820 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(232,50,26,0.12)', border: `1px solid rgba(232,50,26,0.35)`, padding: '6px 16px', borderRadius: 20, color: DG_RED, fontSize: 13, fontWeight: 700, marginBottom: 28, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        ✦ La plataforma de drops verificados
                    </div>

                    <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-2.5px', marginBottom: 24 }}>
                        Vendé en la plataforma que{' '}
                        <span style={{ color: DG_RED, textShadow: `0 0 30px ${DG_RED}88` }}>los compradores confían.</span>
                    </h1>

                    <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 580, margin: '0 auto 44px' }}>
                        Creá tu página de producto en minutos. Verificación incluida, pagos locales integrados y analytics en tiempo real.
                    </p>

                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{ background: DG_RED, color: '#fff', border: 'none', padding: '17px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', boxShadow: `0 4px 28px ${DG_RED}55`, letterSpacing: '0.3px' }}>
                            Sumá tu marca →
                        </Link>
                        <Link to={`/p/${DEMO_SLUG}`} style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '17px 36px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                            ↗ Ver producto demo
                        </Link>
                    </div>
                </div>

                {/* MOCKUP DASHBOARD */}
                <div id="como-funciona" style={{ marginTop: 80, width: '100%', maxWidth: 960, background: '#0d0d0d', border: '1px solid rgba(232,50,26,0.15)', borderRadius: '16px 16px 0 0', position: 'relative', overflow: 'hidden', zIndex: 1, borderBottom: 'none', display: 'flex', height: 380 }}>

                    {/* Sidebar */}
                    <div style={{ width: 200, background: '#0a0a0a', borderRight: '1px solid rgba(232,50,26,0.08)' }}>
                        <div style={{ padding: '18px 16px' }}>
                            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '2px', color: DG_RED, marginBottom: 28, textShadow: `0 0 10px ${DG_RED}` }}>DROPGEAR</div>
                            {['Dashboard', 'Productos', 'Órdenes', 'Analíticas'].map((item, i) => (
                                <div key={i} style={{ padding: '8px 10px', borderRadius: 6, marginBottom: 4, background: i === 0 ? 'rgba(232,50,26,0.12)' : 'transparent', color: i === 0 ? DG_RED : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: i === 0 ? 600 : 400, cursor: 'pointer' }}>{item}</div>
                            ))}
                        </div>
                    </div>

                    {/* Contenido */}
                    <div style={{ flex: 1, padding: 32 }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                            {[['$284.500', 'Ingresos del mes'], ['38', 'Órdenes totales'], ['4.2%', 'Conversión']].map(([val, label], i) => (
                                <div key={i} style={{ flex: 1, background: '#111', border: '1px solid rgba(232,50,26,0.1)', borderRadius: 10, padding: '16px 18px' }}>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{val}</div>
                                    <div style={{ fontSize: 11, color: DG_RED, marginTop: 3 }}>↑ 12% vs. mes anterior</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 18, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 13, letterSpacing: '2px' }}>GRÁFICO DE VENTAS</span>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080808 0%, transparent 60%)' }} />
                </div>
            </main>

            {/* BENEFICIOS */}
            <section id="beneficios" style={{ padding: '100px 48px 80px', maxWidth: 1000, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 14 }}>
                        Todo lo que necesitás para vender
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>Sin comisiones ocultas. Sin fricción técnica.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                    {[
                        { icon: '⚡', title: 'Drops verificados', desc: 'Cada marca pasa por nuestro proceso de validación. Los compradores saben que lo que compran es real.' },
                        { icon: '🎨', title: 'Páginas de producto premium', desc: '3 layouts, 5 tipografías, paleta de colores personalizada. Tu producto va a verse como una marca de nivel mundial.' },
                        { icon: '📊', title: 'Analytics en tiempo real', desc: 'Visitas, tasa de conversión, órdenes por producto. Tomá decisiones con datos reales.' },
                    ].map((f, i) => (
                        <div key={i} style={{ background: '#0d0d0d', border: '1px solid rgba(232,50,26,0.12)', borderRadius: 14, padding: 28, transition: 'border-color 0.2s' }}>
                            <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{f.title}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{f.desc}</div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 60 }}>
                    <Link to="/register" style={{ background: DG_RED, color: '#fff', padding: '17px 52px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 28px ${DG_RED}55`, letterSpacing: '0.3px', display: 'inline-block' }}>
                        Sumá tu marca gratis →
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid rgba(232,50,26,0.12)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, background: '#080808' }}>
                <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: '3px', textTransform: 'uppercase', textShadow: `0 0 10px ${DG_RED}66` }}>
                    DROP<span style={{ color: DG_RED }}>GEAR</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>© 2025 DROP GEAR · Productos Verificados · Todos los derechos reservados</div>
                <div style={{ display: 'flex', gap: 20 }}>
                    <a href={`mailto:hola@dropgear.com`} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 13 }}>Contacto</a>
                    <a href={PROVIDER_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 13 }}>Dashboard</a>
                </div>
            </footer>
        </div>
    );
}
