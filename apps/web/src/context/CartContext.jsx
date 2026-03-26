import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('dg_cart');
            return localData ? JSON.parse(localData) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('dg_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + qty } : item);
            }
            return [...prev, { product, qty }];
        });
        setIsCartOpen(true);
    };

    const updateQty = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => setCart([]);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, isCartOpen, openCart, closeCart }}>
            {children}
            <CartDrawer />
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);

// --- Cart Drawer Component ---
function CartDrawer() {
    const { cart, isCartOpen, closeCart, updateQty, removeFromCart } = useCart();

    const total = cart.reduce((acc, item) => acc + (parseFloat(String(item.product.price).replace(/[^0-9.]/g, '')) * item.qty), 0);
    const tax = total * 0.21;
    const finalTotal = total + tax;

    const formatPrice = (p) => `$${Number(p).toLocaleString('es-AR')}`;

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                onClick={closeCart} 
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9998, animation: 'fadeIn 0.3s' }} 
            />
            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 440,
                background: '#080808', borderLeft: '1px solid rgba(255,255,255,0.1)',
                zIndex: 9999, display: 'flex', flexDirection: 'column',
                fontFamily: "'DM Sans', sans-serif",
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.5)'
            }}>
                <style>{`
                    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
                
                <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Tu Carrito ({cart.reduce((a,c)=>a+c.qty,0)})</h2>
                    <button onClick={closeCart} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', marginTop: 60 }}>
                            <div style={{ fontSize: 40, marginBottom: 16 }}>🛒</div>
                            <p style={{ fontSize: 16 }}>Tu carrito está vacío.</p>
                            <button onClick={closeCart} style={{ marginTop: 24, padding: '10px 24px', background: '#E8321A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Volver a la tienda</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {cart.map(item => (
                                <div key={item.product.id} style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ width: 80, height: 80, borderRadius: 8, background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={item.product.image || item.product.heroImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{item.product.name}</h4>
                                            <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: 4 }}>×</button>
                                        </div>
                                        <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{formatPrice(item.product.price)}</div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, width: 'fit-content' }}>
                                            <button onClick={() => updateQty(item.product.id, -1)} style={{ background: 'transparent', border: 'none', color: '#fff', padding: '4px 10px', cursor: 'pointer' }}>-</button>
                                            <span style={{ fontSize: 13, color: '#fff', padding: '0 8px' }}>{item.qty}</span>
                                            <button onClick={() => updateQty(item.product.id, 1)} style={{ background: 'transparent', border: 'none', color: '#fff', padding: '4px 10px', cursor: 'pointer' }}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ padding: '24px 32px', background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', marginBottom: 12 }}>
                            <span>Subtotal</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', marginBottom: 16 }}>
                            <span>Impuestos fijos (21%)</span>
                            <span>{formatPrice(tax)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
                            <span>Total</span>
                            <span>{formatPrice(finalTotal)}</span>
                        </div>
                        <button 
                            onClick={() => { closeCart(); window.location.href = '/checkout'; }} 
                            style={{ width: '100%', background: '#E8321A', color: '#fff', padding: '16px', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,50,26,0.3)', transition: 'transform 0.2s', ':active': { transform: 'scale(0.98)' } }}>
                            Ir al Checkout →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
