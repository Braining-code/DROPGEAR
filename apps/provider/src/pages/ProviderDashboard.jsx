import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || `${API}`;


// ─── FONTS (Google Fonts via @import) ─────────────────────────────────────────
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Syne:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Bebas+Neue&display=swap');`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const mockProducts = [
  { id: 1, name: "Gran Reserva Single Estate", category: "Aceite de Oliva Extra Virgen", price: 8900, status: "activo", visits: 1840, orders: 32, conversion: "1.74%", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80", color: "#C8472B", bg: "#F7F3EC", font: "dm", layout: "split" },
  { id: 2, name: "Malbec Reserva 2022", category: "Vino Tinto", price: 6200, status: "activo", visits: 940, orders: 18, conversion: "1.91%", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80", color: "#6B2D8B", bg: "#1A0A2E", font: "playfair", layout: "full" },
  { id: 3, name: "Aceto Balsámico Añejo", category: "Condimentos", price: 4500, status: "borrador", visits: 0, orders: 0, conversion: "—", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&q=80", color: "#2A4A2A", bg: "#F5F2EE", font: "cormorant", layout: "minimal" },
];

const mockOrders = [
  { id: "#00234", customer: "Carolina M.", product: "Gran Reserva 500ml", qty: 2, total: "$17.800", status: "enviado", date: "27 feb" },
  { id: "#00233", customer: "Rodrigo F.", product: "Gran Reserva 500ml", qty: 1, total: "$8.900", status: "pendiente", date: "27 feb" },
  { id: "#00232", customer: "Valeria S.", product: "Malbec Reserva", qty: 3, total: "$18.600", status: "entregado", date: "26 feb" },
  { id: "#00231", customer: "Martín L.", product: "Gran Reserva 500ml", qty: 1, total: "$7.565", status: "entregado", date: "25 feb" },
  { id: "#00230", customer: "Ana P.", product: "Malbec Reserva", qty: 2, total: "$12.400", status: "entregado", date: "24 feb" },
];

const FONTS = [
  { id: "dm", name: "DM Sans", style: "Neutral · Moderna", family: "'DM Sans', sans-serif", sample: "Gran Reserva" },
  { id: "playfair", name: "Playfair Display", style: "Serif · Editorial", family: "'Playfair Display', serif", sample: "Gran Reserva" },
  { id: "syne", name: "Syne", style: "Geométrica · Bold", family: "'Syne', sans-serif", sample: "Gran Reserva" },
  { id: "cormorant", name: "Cormorant Garamond", style: "Roman · Refinada", family: "'Cormorant Garamond', serif", sample: "Gran Reserva" },
  { id: "bebas", name: "Bebas Neue", style: "Display · Impacto", family: "'Bebas Neue', sans-serif", sample: "GRAN RESERVA" },
];

const LAYOUTS = [
  { id: "split", label: "Split", desc: "Imagen | Contenido" },
  { id: "full", label: "Full hero", desc: "Imagen de fondo" },
  { id: "minimal", label: "Minimal", desc: "Centrado, aire" },
];

// Page blocks — cada uno es una sección editable de la landing
const PAGE_BLOCKS = [
  { id: "hero", label: "Principal", icon: "🛍️", desc: "Datos, textos, galería y video" },
  { id: "stats", label: "Ficha Técnica", icon: "📊", desc: "4 valores técnicos del producto" },
  { id: "faq", label: "Preguntas", icon: "❓", desc: "Preguntas frecuentes" },
  { id: "design", label: "Diseño", icon: "🎨", desc: "Colores, layout y tipografía" }
];

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  bg: "#0A0908", surface: "#131110", surfaceHigh: "#1C1916",
  border: "#262220", text: "#F0EDE8", muted: "#7A7570",
  accent: "#E8321A", blue: "#E8321A", green: "#22C55E",
  red: "#EF4444", yellow: "#F59E0B",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fontFamily = id => FONTS.find(f => f.id === id)?.family || "'DM Sans', sans-serif";

const StatusBadge = ({ status }) => {
  const m = {
    activo: ["rgba(34,197,94,0.12)", "#4ADE80", "Activo"],
    borrador: ["rgba(120,113,108,0.15)", "#A8A29E", "Borrador"],
    enviado: ["rgba(37,99,235,0.15)", "#60A5FA", "Enviado"],
    pendiente: ["rgba(245,158,11,0.15)", "#FCD34D", "Pendiente"],
    entregado: ["rgba(34,197,94,0.12)", "#4ADE80", "Entregado"],
  };
  const [bg, color, label] = m[status] || m.borrador;
  return <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", background: bg, color, padding: "3px 8px", borderRadius: 4 }}>{label}</span>;
};

const StatCard = ({ label, value, change }) => (
  <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "16px 18px" }}>
    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 7 }}>{label}</div>
    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: P.text, letterSpacing: "-0.5px", marginBottom: 3 }}>{value}</div>
    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.green }}>{change}</div>
  </div>
);

const MiniChart = ({ data }) => {
  const max = Math.max(...data), w = 240, h = 48;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h}>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.accent} stopOpacity="0.25" /><stop offset="100%" stopColor={P.accent} stopOpacity="0" /></linearGradient></defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#cg)" stroke="none" />
      <polyline points={pts} fill="none" stroke={P.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────
const Tip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(120,113,108,0.3)", color: P.muted, fontSize: 9, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "help", userSelect: "none" }}>
        i
      </span>
      {show && (
        <span style={{ position: "absolute", left: 20, top: -4, background: P.surfaceHigh, border: `1px solid ${P.border}`, borderRadius: 6, padding: "6px 10px", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.muted, whiteSpace: "nowrap", zIndex: 50, maxWidth: 220, whiteSpace: "normal", lineHeight: 1.4, width: 200 }}>
          {text}
        </span>
      )}
    </span>
  );
};

// ─── FIELD ────────────────────────────────────────────────────────────────────
const Field = ({ label, tip, value, onChange, rows, type = "text", placeholder }) => (
  <div style={{ marginBottom: 13 }}>
    <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
      {label} {tip && <Tip text={tip} />}
    </label>
    {rows
      ? <textarea rows={rows} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 12, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
      : <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 12, boxSizing: "border-box", outline: "none" }} />
    }
  </div>
);

// ─── MINI PAGE PREVIEW ────────────────────────────────────────────────────────
// Wireframe vivo de la landing que refleja los valores del form
function MiniPagePreview({ form, activeBlock, onBlockClick }) {
  const ff = fontFamily(form.font);
  const accent = form.color || "#C8472B";
  const bg = form.bg || "#F7F3EC";
  const ink = "#1A1410";
  const muted = "#8A7A6A";

  const blockStyle = (id) => ({
    cursor: "pointer",
    outline: activeBlock === id ? `2px solid ${P.accent}` : "2px solid transparent",
    outlineOffset: 0,
    transition: "outline 0.15s",
    position: "relative",
  });

  const BlockLabel = ({ id, children }) => (
    <div style={blockStyle(id)} onClick={() => onBlockClick(id)}>
      {activeBlock === id && (
        <div style={{ position: "absolute", top: 2, right: 2, background: P.accent, color: "#1A1410", fontSize: 7, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, padding: "1px 4px", borderRadius: 2, zIndex: 5, letterSpacing: "0.5px" }}>
          EDITANDO
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div style={{ background: bg, borderRadius: 8, overflow: "hidden", border: `1px solid ${P.border}`, fontSize: 0, userSelect: "none" }}>

      {/* DROP GEAR bar mini */}
      <div style={{ background: "#080808", padding: "3px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(232,50,26,0.2)" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 7, fontWeight: 900, color: "#fff", letterSpacing: "1.5px", textTransform: "uppercase" }}>DROP<span style={{ color: "#E8321A" }}>GEAR</span></span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, color: "rgba(255,255,255,0.4)" }}>Vendido por {form.storeName || "Tu tienda"}</span>
      </div>

      {/* Store nav mini */}
      <div style={{ background: bg, borderBottom: `1px solid rgba(0,0,0,0.08)`, padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: ff, fontSize: 7, fontWeight: 700, color: ink }}>{form.storeName || "Tu tienda"}</span>
        <div style={{ background: ink, borderRadius: 2, padding: "2px 5px" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, fontWeight: 600, color: "#fff" }}>Comprar</span>
        </div>
      </div>

      {/* HERO block */}
      <BlockLabel id="hero">
        <div style={{ display: "grid", gridTemplateColumns: form.layout === "minimal" ? "1fr" : "1fr 1fr", minHeight: 80, background: bg }}>
          {form.layout !== "minimal" && (
            <div style={{ background: form.layout === "full" ? "#1a1410" : bg, position: "relative", overflow: "hidden" }}>
              {form.heroImage
                ? <img src={form.heroImage} alt="" style={{ width: "100%", height: "100%", objectFit: form.layout === "full" ? "cover" : "contain", display: "block", opacity: 0.85 }} />
                : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#2a2420,#1a1410)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 7, color: "rgba(255,255,255,0.2)" }}>📷 foto</span>
                </div>
              }
              {form.layout === "full" && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />}
            </div>
          )}
          <div style={{ padding: form.layout === "minimal" ? "12px" : "8px 10px", display: "flex", flexDirection: "column", justifyContent: "center", background: form.layout === "full" ? "transparent" : bg }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, color: accent, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3 }}>{form.category || "Categoría"}</div>
            <div style={{ fontFamily: ff, fontSize: form.font === "bebas" ? 14 : 11, fontWeight: 700, color: form.layout === "full" ? "#fff" : ink, lineHeight: 1.1, marginBottom: 4, letterSpacing: form.font === "bebas" ? "0.5px" : "-0.3px" }}>
              {form.name || "Nombre del producto"}
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, color: form.layout === "full" ? "rgba(255,255,255,0.6)" : muted, lineHeight: 1.4, marginBottom: 6 }}>
              {form.tagline ? form.tagline.slice(0, 55) + (form.tagline.length > 55 ? "…" : "") : "Tagline del producto"}
            </div>
            <div style={{ fontFamily: ff, fontSize: 12, fontWeight: 700, color: form.layout === "full" ? "#fff" : ink, marginBottom: 5 }}>${parseInt(form.price || 0).toLocaleString()}</div>
            <div style={{ background: accent, borderRadius: 2, padding: "3px 7px", alignSelf: "flex-start" }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, fontWeight: 600, color: "#fff" }}>Agregar al carrito</span>
            </div>
          </div>
        </div>
      </BlockLabel>

      {/* STATS block */}
      <BlockLabel id="stats">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid rgba(0,0,0,0.07)`, borderBottom: `1px solid rgba(0,0,0,0.07)`, background: bg }}>
          {[
            [form.stat1v, form.stat1l], [form.stat2v, form.stat2l],
            [form.stat3v, form.stat3l], [form.stat4v, form.stat4l],
          ].map(([v, l], i) => (
            <div key={i} style={{ padding: "6px 4px", textAlign: "center", borderRight: i < 3 ? `1px solid rgba(0,0,0,0.07)` : "none" }}>
              <div style={{ fontFamily: ff, fontSize: 8, fontWeight: 700, color: ink }}>{v || "—"}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 5, color: muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l || "label"}</div>
            </div>
          ))}
        </div>
      </BlockLabel>

      {/* CONTENT (Markdown) block preview */}
      <BlockLabel id="content">
        <div style={{ padding: "8px 10px", background: bg, borderTop: `1px solid rgba(0,0,0,0.05)` }}>
          <div style={{ fontFamily: ff, fontSize: 8, fontWeight: 700, color: ink, marginBottom: 4, lineHeight: 1.2 }}>
            Descripción Especial Expandida
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, color: muted, lineHeight: 1.5, marginBottom: 2 }}>
            El área de redacción expandida y multimedia...
          </div>
          <div style={{ padding: "6px", background: "rgba(0,0,0,0.03)", borderRadius: 4, border: "1px dashed rgba(0,0,0,0.1)", textAlign: "center", margin: "4px 0" }}>
             <span style={{ fontSize: 6, color: muted }}>Marcado dinámico</span>
          </div>
        </div>
      </BlockLabel>

      {/* FAQ block */}
      <BlockLabel id="faq">
        <div style={{ padding: "6px 10px", background: bg, borderTop: `1px solid rgba(0,0,0,0.05)` }}>
          <div style={{ fontFamily: ff, fontSize: 7, fontWeight: 700, color: ink, marginBottom: 5, textAlign: "center" }}>Preguntas frecuentes</div>
          {[[form.faq1q, form.faq1a], [form.faq2q, form.faq2a]].map(([q, a], i) => (
            <div key={i} style={{ borderBottom: `1px solid rgba(0,0,0,0.06)`, paddingBottom: 4, marginBottom: 4 }}>
              <div style={{ fontFamily: ff, fontSize: 6, fontWeight: 600, color: ink }}>{q || `Pregunta ${i + 1}`}</div>
              {i === 0 && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 5, color: muted, lineHeight: 1.4, marginTop: 1 }}>{a ? a.slice(0, 60) + "…" : "Respuesta..."}</div>}
            </div>
          ))}
        </div>
      </BlockLabel>

      {/* Footer CTA mini */}
      <div style={{ background: "#111009", padding: "8px 10px", textAlign: "center" }}>
        <div style={{ fontFamily: ff, fontSize: 9, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{form.name || "Producto"}</div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          <div style={{ background: accent, borderRadius: 2, padding: "2px 7px" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, fontWeight: 600, color: "#fff" }}>Comprar ahora</span>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2, padding: "2px 6px" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, color: "rgba(255,255,255,0.5)" }}>Suscribirme</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#080808", padding: "3px 8px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>DROP<span style={{ color: "#E8321A" }}>GEAR</span></span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 6, color: "rgba(255,255,255,0.2)" }}>© {form.storeName || "Tienda"}</span>
      </div>
    </div>
  );
}

// ─── BLOCK EDITORS ────────────────────────────────────────────────────────────
function BlockEditor({ block, form, setForm }) {
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  if (block === "hero") {
    // Helper: single image upload slot with preview
    const ImageSlot = ({ label, tip, fieldKey, placeholder }) => {
      const val = form[fieldKey] || "";
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            {label} <Tip text={tip} />
          </div>
          {val ? (
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 6, height: 100 }}>
              <img src={val} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <button onClick={() => setForm(f => ({ ...f, [fieldKey]: "" }))}
                style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11 }}>
                Cambiar
              </button>
            </div>
          ) : (
            <label style={{ display: "block", border: `2px dashed ${P.border}`, borderRadius: 8, padding: "16px", textAlign: "center", cursor: "pointer", marginBottom: 6 }}>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                const file = e.target.files[0]; if (!file) return;
                const fd = new FormData(); fd.append("file", file);
                const res = await fetch(`${API}/api/uploads`, { method: "POST", body: fd });
                const data = await res.json();
                if (data.url) setForm(f => ({ ...f, [fieldKey]: data.url }));
              }} />
              <div style={{ fontSize: 20, marginBottom: 3 }}>📷</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.muted }}>Subir imagen</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: P.border, marginTop: 1 }}>JPG/PNG/WEBP · máx 10MB</div>
            </label>
          )}
          <input value={val} onChange={e => setForm(f => ({ ...f, [fieldKey]: e.target.value }))}
            style={{ width: "100%", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 6, padding: "7px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 12, boxSizing: "border-box" }}
            placeholder={placeholder || "https://..."} />
        </div>
      );
    };

    return (
      <div>
        <div style={sectionTitle}>Información del producto</div>
        <Field label="Nombre del producto" tip="El título principal que verán los compradores." value={form.name} onChange={set("name")} placeholder="Gran Reserva Single Estate" />
        <Field label="Categoría" tip="Aparece como etiqueta pequeña sobre el título." value={form.category} onChange={set("category")} placeholder="Aceite de Oliva Extra Virgen" />
        <Field label="Tagline (Frase Gancho)" tip="Aparece debajo del título. Usa 10 a 15 palabras magnéticas (aprox. 80-100 caracteres) que resuman tu diferencial único." value={form.tagline} onChange={set("tagline")} placeholder="Cosecha limitada. Finca propia en Mendoza." />
        <Field label="Descripción corta" tip="Aparece debajo del tagline. Usa 20 a 30 palabras con datos concretos, técnicos o descriptivos que refuercen la decisión de compra rápida." value={form.description} onChange={set("description")} rows={3} placeholder="Elaborado en frío a 18°C, con extracción manual. Acidez 0.12%..." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <Field label="Precio ($)" tip="Precio de venta normal." value={form.price} onChange={set("price")} type="number" />
          <Field label="Precio suscripción ($)" tip="Precio con descuento para clientes recurrentes. Sugerido: 15% menos." value={form.subPrice} onChange={set("subPrice")} type="number" />
        </div>

        <Field label="Texto SEO (Descripción extendida)" tip="Aparece en la página debajo del video o hero. Relata los beneficios e ingredientes." value={form.seoBody} onChange={set("seoBody")} rows={6} placeholder="El Gran Reserva es un aceite..." />

        <div style={sectionTitle}>Video Opcional</div>
        <Field label="URL del video (YouTube/Vimeo/MP4)" tip="Dejar vacío si no se desea usar video interactivo." value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://youtube.com/..." />
        {form.videoUrl && (
          <>
            <Field label="Título del Video" value={form.videoTitle} onChange={set("videoTitle")} placeholder="Conocé el proceso" />
            <Field label="Subtítulo del Video" value={form.videoSub} onChange={set("videoSub")} placeholder="Mirá cómo hacemos cada producto" />
          </>
        )}

        <div style={sectionTitle}>Imagen principal (hero)</div>
        <ImageSlot label="Imagen Hero" tip="La imagen grande del producto. 1200×900px recomendado." fieldKey="heroImage" placeholder="https://images.unsplash.com/..." />

        <div style={sectionTitle}>Galería de imágenes secundarias (Miniaturas)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 10, marginBottom: 24 }}>
          {(form.gallery || []).map((imgUrl, i) => (
            <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 8, border: `1px solid ${P.border}`, overflow: "hidden", position: "relative" }}>
              <img src={imgUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Galeria" />
              <button onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, j) => j !== i) }))}
                style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ))}
          {(form.gallery || []).length < 10 && (
            <label style={{ width: "100%", aspectRatio: "1", borderRadius: 8, border: `1px dashed ${P.muted}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: P.muted, fontSize: 11, background: "transparent" }}>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                const file = e.target.files[0]; if (!file) return;
                const fd = new FormData(); fd.append("file", file);
                const res = await fetch(`${API}/api/uploads`, { method: "POST", body: fd });
                const data = await res.json();
                if (data.url) setForm(f => ({ ...f, gallery: [...(f.gallery || []), data.url] }));
              }} />
              <span style={{ fontSize: 20, marginBottom: 2 }}>+</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted }}>Subir foto</span>
            </label>
          )}
        </div>
      </div>
    );
  }

  if (block === "stats") return (
    <div>
      <div style={sectionTitle}>Stats técnicos del producto</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted, marginBottom: 16, lineHeight: 1.5 }}>
        Aparecen en una barra horizontal debajo del hero. Máximo 4. Usá datos concretos y verificables.
      </p>
      {(form.stats || []).map((stat, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Valor {i + 1}</div>
            <input value={stat.value} onChange={e => setForm(f => ({ ...f, stats: f.stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s) }))}
              style={{ width: "100%", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13, boxSizing: "border-box" }}
              placeholder="Ej: 120km" />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Etiqueta {i + 1}</div>
            <input value={stat.label} onChange={e => setForm(f => ({ ...f, stats: f.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s) }))}
              style={{ width: "100%", background: P.bg, border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13, boxSizing: "border-box" }}
              placeholder="Ej: Autonomía" />
          </div>
          <button onClick={() => setForm(f => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))}
            style={{ background: "transparent", border: `1px solid ${P.border}`, color: P.muted, borderRadius: 6, padding: "8px 10px", cursor: "pointer", fontSize: 14, marginBottom: 0 }}>✕</button>
        </div>
      ))}
      {(form.stats || []).length < 4 && (
        <button onClick={() => setForm(f => ({ ...f, stats: [...(f.stats || []), { value: "", label: "" }] }))}
          style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.accent, background: "transparent", border: `1px dashed ${P.accent}`, borderRadius: 6, padding: "7px 14px", cursor: "pointer", width: "100%", marginTop: 4 }}>+ Agregar stat</button>
      )}
    </div>
  );

  if (block === "faq") return (
    <div>
      <div style={sectionTitle}>Preguntas frecuentes</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted, marginBottom: 16, lineHeight: 1.5 }}>
        Agregá las dudas más comunes de tus clientes para derribar objeciones (envíos, cambios, materiales).
      </p>
      {(form.faqs || []).map((faq, i) => (
        <div key={i} style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase" }}>Pregunta {i + 1}</div>
            <button onClick={() => setForm(f => ({ ...f, faqs: f.faqs.filter((_, j) => j !== i) }))} style={{ background: "transparent", border: "none", color: P.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <input value={faq.q} onChange={e => setForm(f => ({ ...f, faqs: f.faqs.map((q, j) => j === i ? { ...q, q: e.target.value } : q) }))} style={{ width: "100%", background: "transparent", border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 8, boxSizing: "border-box", outline: "none" }} placeholder="Ej: ¿Tienen stock inmediato?" />
          <textarea value={faq.a} onChange={e => setForm(f => ({ ...f, faqs: f.faqs.map((a, j) => j === i ? { ...a, a: e.target.value } : a) }))} rows={2} style={{ width: "100%", background: "transparent", border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 10px", color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 12, resize: "vertical", boxSizing: "border-box", outline: "none" }} placeholder="Ej: Sí, despachamos en 24hs hábiles a todo el país." />
        </div>
      ))}
      <button onClick={() => setForm(f => ({ ...f, faqs: [...(f.faqs || []), { q: "", a: "" }] }))} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.accent, background: "transparent", border: `1px dashed ${P.accent}`, borderRadius: 6, padding: "7px 14px", cursor: "pointer", width: "100%", marginTop: 4 }}>+ Agregar pregunta</button>
    </div>
  );

  // Bloque reincorporado: Diseño
  if (block === "design") return (
    <div>
      <div style={sectionTitle}>Colores base</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Primario (Accent)</div>
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 44, height: 44, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Fondo (Background)</div>
          <input type="color" value={form.bg} onChange={e => setForm(f => ({ ...f, bg: e.target.value }))} style={{ width: 44, height: 44, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
        </div>
      </div>
      <div style={sectionTitle}>Tipografía</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {FONTS.map(f => (
          <div key={f.id} onClick={() => setForm(fm => ({ ...fm, font: f.id }))}
            style={{ border: `1px solid ${form.font === f.id ? P.accent : P.border}`, background: form.font === f.id ? "rgba(232,50,26,0.05)" : P.bg, borderRadius: 8, padding: "10px 14px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: f.family, fontSize: 14, color: form.font === f.id ? P.accent : P.text, fontWeight: 700 }}>{f.name}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted }}>{f.style}</div>
          </div>
        ))}
      </div>
      <div style={sectionTitle}>Estilo visual (Layout)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LAYOUTS.map(l => (
          <div key={l.id} onClick={() => setForm(fm => ({ ...fm, layout: l.id }))}
            style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${form.layout === l.id ? P.accent : P.border}`, background: form.layout === l.id ? "rgba(232,50,26,0.05)" : P.bg, borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${form.layout === l.id ? P.accent : P.muted}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {form.layout === l.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.accent }} />}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: form.layout === l.id ? P.accent : P.text }}>{l.label}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.muted, marginTop: 1 }}>{l.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

const sectionTitle = { fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12, marginTop: 4, paddingTop: 12, borderTop: `1px solid ${P.border}` };

// ─── LANDING EDITOR ───────────────────────────────────────────────────────────
function LandingEditor({ product, onBack, token }) {
  const [activeBlock, setActiveBlock] = useState("hero");
  const [saved, setSaved] = useState(false);

  // Parse JSON fields safely
  const parseSafe = (str, fallback) => {
    try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
  };

  const initBadges = parseSafe(product.badges, ["Calidad Premium", "Envío 24hs", "Garantía Incluida"]);
  const initStats = parseSafe(product.stats, [
    { value: "Premium", label: "Calidad" }, { value: "24hs", label: "Despacho" },
    { value: "30 días", label: "Garantía" }, { value: "1 año", label: "Soporte" },
  ]);
  const initFaqs = parseSafe(product.faqs, [
    { q: "¿Cuánto tarda en llegar?", a: "2-5 días hábiles a todo el país." },
    { q: "¿Qué pasa si no me gusta?", a: "Devolución sin cargo en 30 días." },
  ]);
  const seoLines = (product.seoBody || "").split('\n').filter(Boolean);
  const initGallery = parseSafe(product.gallery, []);

  const [form, setForm] = useState({
    name: product.name || "", category: product.category || "",
    price: String(product.price || ""), subPrice: String(product.subPrice || Math.round((product.price || 0) * 0.85)),
    tagline: product.tagline || "", description: product.description || "",
    badges: initBadges,
    stats: initStats,
    seoBody: product.seoBody || "",
    videoUrl: product.videoUrl || "",
    videoTitle: product.videoTitle || "Conocé el proceso",
    videoSub: product.videoSub || "Mirá cómo hacemos cada producto",
    color: product.primaryColor || product.color || "#C8472B",
    bg: product.bgColor || product.bg || "#F7F3EC",
    font: product.fontId || product.font || "dm",
    layout: product.layout || "split",
    faqs: initFaqs,
    heroImage: product.heroImageUrl || product.image || "",
    gallery: initGallery,
    storeName: product.store?.name || "",
  });


  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexShrink: 0 }}>
        <button onClick={() => {
          if(window.confirm("¿Seguro que querés volver? Si no hiciste click en 'Publicar' perderás tus cambios.")) {
            onBack();
          }
        }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: "transparent", border: `1px solid ${P.border}`, borderRadius: 6, padding: "7px 12px", color: P.muted, cursor: "pointer" }}>← Volver</button>
        <div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 700, color: P.text, margin: 0 }}>{form.name}</h2>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.muted, marginTop: 1 }}>Editando página · {product.category}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => window.open(`http://localhost:3000/p/${product.slug || (form.name ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'gran-reserva')}`, '_blank')} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: "transparent", color: P.muted, border: `1px solid ${P.border}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>↗ Ver página</button>
          <button onClick={async () => {
            const payload = {
              name: form.name, category: form.category,
              price: parseInt(form.price) || 0,
              subPrice: parseInt(form.subPrice) || null,
              tagline: form.tagline, description: form.description,
              heroImageUrl: form.heroImage || null,
              gallery: JSON.stringify(form.gallery),
              seoBody: form.seoBody || null,
              videoUrl: form.videoUrl || null, videoTitle: form.videoTitle || null, videoSub: form.videoSub || null,
              layout: form.layout, fontId: form.font,
              primaryColor: form.color, bgColor: form.bg,
              badges: JSON.stringify(form.badges),
              stats: JSON.stringify(form.stats),
              faqs: JSON.stringify(form.faqs),
              status: product.id === 'new' ? 'activo' : product.status,
              ...(product.id === 'new' && { storeId: product.storeId }),
            };
            const method = product.id === 'new' ? 'POST' : 'PUT';
            const url = product.id === 'new' ? `${API}/api/products` : `${API}/api/products/${product.id}`;
            try {
              const headers = { 'Content-Type': 'application/json' };
              if (token) headers['Authorization'] = `Bearer ${token}`;
              const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
              const data = await res.json();
              if (!res.ok) {
                console.error('[Publicar] Error de API:', data);
                setSaved('error');
              } else {
                setSaved('ok');
              }
            } catch (e) {
              console.error('[Publicar] Error de red:', e);
              setSaved('error');
            }
            setTimeout(() => setSaved(false), 2500);
          }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: saved === 'ok' ? P.green : saved === 'error' ? '#EF4444' : P.accent, color: saved === 'error' ? '#fff' : "#1A1410", border: "none", borderRadius: 6, padding: "8px 18px", cursor: "pointer", transition: "background 0.3s" }}>
            {saved === 'ok' ? "✓ Guardado" : saved === 'error' ? "✕ Error — ver consola" : "Publicar"}
          </button>
        </div>
      </div>

      {/* Editor layout: miniatura izq | bloques centro | campos der */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 180px 1fr", gap: 16, flex: 1, minHeight: 0 }}>

        {/* Miniatura viva */}
        <div style={{ overflowY: "auto" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Preview de página</div>
          <MiniPagePreview form={form} activeBlock={activeBlock} onBlockClick={setActiveBlock} />
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: P.muted, textAlign: "center", marginTop: 6 }}>Hacé click en un bloque para editar</div>
        </div>

        {/* Bloques navegación */}
        <div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Secciones</div>
          {PAGE_BLOCKS.map(b => (
            <button key={b.id} onClick={() => setActiveBlock(b.id)}
              style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${activeBlock === b.id ? P.accent : P.border}`, background: activeBlock === b.id ? "rgba(232,168,124,0.08)" : "transparent", cursor: "pointer", marginBottom: 6, textAlign: "left", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 12 }}>{b.icon}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: activeBlock === b.id ? 600 : 400, color: activeBlock === b.id ? P.accent : P.text }}>{b.label}</span>
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, marginTop: 2, paddingLeft: 19 }}>{b.desc}</div>
            </button>
          ))}
        </div>

        {/* Campos del bloque activo */}
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: 20, overflowY: "auto" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>
            {PAGE_BLOCKS.find(b => b.id === activeBlock)?.icon} {PAGE_BLOCKS.find(b => b.id === activeBlock)?.label}
          </div>
          <BlockEditor block={activeBlock} form={form} setForm={setForm} />
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS LIST ────────────────────────────────────────────────────────────
function ProductsList({ onEdit, token, user }) {
  const [products, setProducts] = useState([]);

  // Obtener el storeId real del proveedor logueado
  const getStoreId = () => {
    try {
      const u = JSON.parse(localStorage.getItem('provider_user'));
      return u?.stores?.[0]?.id || null;
    } catch { return null; }
  };

  useEffect(() => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`${API}/api/products`, { headers })
      .then(res => res.json())
      .then(data => {
        // Map db products to dashboard format where missing
        const mapped = Array.isArray(data) ? data.map(p => ({
          ...p,
          visits: 1840, orders: 32, conversion: "1.74%",
          image: p.heroImageUrl || "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
          color: p.primaryColor || "#C8472B", bg: p.bgColor || "#F7F3EC", font: p.fontId || "dm", layout: p.layout || "split"
        })) : [];
        setProducts(mapped);
      });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, color: P.text, letterSpacing: "-0.3px", marginBottom: 2 }}>Mis productos</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted }}>Cada producto tiene su propia página en DROP GEAR</p>
        </div>
        <button onClick={() => {
          const storeId = getStoreId();
          onEdit({ id: 'new', name: "Nuevo Producto", category: "Categoría", price: 0, status: "borrador", fontId: "dm", layout: "split", primaryColor: "#C8472B", bgColor: "#F7F3EC", storeId });
        }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, background: P.accent, color: "#1A1410", border: "none", borderRadius: 7, padding: "9px 18px", cursor: "pointer" }}>
          + Nuevo producto
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 68, height: 68, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${P.border}` }}>
              <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: P.text }}>{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.muted, marginBottom: 8 }}>{p.category} · ${p.price.toLocaleString()}</div>
              <div style={{ display: "flex", gap: 18 }}>
                {[["Visitas", p.visits], ["Órdenes", p.orders], ["Conversión", p.conversion]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: P.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 1 }}>{l}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: P.text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.color, border: `2px solid ${P.border}` }} />
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.bg, border: `2px solid ${P.border}` }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: P.muted, background: P.bg, padding: "2px 6px", borderRadius: 4, marginLeft: 3 }}>{FONTS.find(f => f.id === p.font)?.name || p.font}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => window.open(`http://localhost:3000/p/${p.slug || 'gran-reserva'}`, '_blank')} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: "transparent", color: P.muted, border: `1px solid ${P.border}`, borderRadius: 6, padding: "7px 12px", cursor: "pointer" }}>↗ Ver</button>
              <button onClick={() => onEdit(p)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: "transparent", color: P.accent, border: `1px solid ${P.accent}`, borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>Editar página</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/stores`).then(r => r.json()),
      fetch(`${API}/api/orders`).then(r => r.json()),
    ])
      .then(([storeData, ordersData]) => {
        if (storeData?.stats) setStats(storeData.stats);
        if (Array.isArray(ordersData)) setRecentOrders(ordersData.slice(0, 4));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const revenue = stats?.revenue ?? null;
  const orders = stats?.orders ?? null;

  const formatRevenue = (v) => v != null ? `$${v.toLocaleString('es-AR')}` : '—';
  const formatOrders = (v) => v != null ? String(v) : '—';

  const formatOrderDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const formatOrderTotal = (total) => total != null ? `$${Number(total).toLocaleString('es-AR')}` : '—';

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, color: P.text, letterSpacing: "-0.3px", marginBottom: 2 }}>Buenos días 👋</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted }}>{loading ? 'Cargando stats...' : 'Tu tienda está activa en DROP GEAR'}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        <StatCard label="Ingresos" value={formatRevenue(revenue)} change={revenue != null ? 'Total acumulado' : 'Sin órdenes aún'} />
        <StatCard label="Órdenes" value={formatOrders(orders)} change={orders != null ? 'Total completadas' : 'Sin órdenes aún'} />
        <StatCard label="Visitas" value="—" change="Próximamente" />
        <StatCard label="Conversión" value="—" change="Próximamente" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>Ingresos estimados</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: P.text, letterSpacing: "-1px", marginBottom: 12 }}>{formatRevenue(revenue)}</div>
          <MiniChart data={[40, 65, 50, 80, 70, 90, 75, 110, 95, 130, 115, 140]} />
        </div>
        <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>Últimas órdenes</div>
          {loading && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted }}>Cargando...</div>}
          {!loading && recentOrders.length === 0 && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted }}>Aún no hay órdenes.</div>}
          {recentOrders.map((o, i) => (
            <div key={o.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: i < recentOrders.length - 1 ? `1px solid ${P.border}` : "none" }}>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: P.text, marginBottom: 1 }}>{o.customerName || 'Cliente'}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: P.muted }}>{o.product?.name || '—'}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: P.text, marginBottom: 3 }}>{formatOrderTotal(o.total)}</div>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    fetch(`${API}/api/orders`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const FILTERS = ['Todas', 'Pendiente', 'Enviado', 'Entregado'];

  const filtered = filter === 'Todas'
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === filter.toLowerCase());

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) : '—';
  const formatTotal = (v) => v != null ? `$${Number(v).toLocaleString('es-AR')}` : '—';

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, color: P.text, letterSpacing: "-0.3px" }}>Órdenes</h2>
        <div style={{ display: "flex", gap: 5 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, background: f === filter ? P.accent : "transparent", color: f === filter ? "#1A1410" : P.muted, border: `1px solid ${f === filter ? P.accent : P.border}`, borderRadius: 5, padding: "5px 10px", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 50px 90px 90px 80px", padding: "10px 16px", borderBottom: `1px solid ${P.border}` }}>
          {['Orden', 'Cliente', 'Producto', 'Uds.', 'Total', 'Estado', 'Fecha'].map(h => (
            <div key={h} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 600, color: P.muted, letterSpacing: "1px", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {loading && (
          <div style={{ padding: "24px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: P.muted }}>Cargando órdenes...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "24px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: P.muted }}>No hay órdenes {filter !== 'Todas' ? `con estado "${filter}"` : 'aún'}.</div>
        )}
        {!loading && filtered.map((o, i) => (
          <div key={o.id || i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 50px 90px 90px 80px", padding: "12px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${P.border}` : "none", alignItems: "center" }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.accent, fontWeight: 600 }}>#{String(o.id).slice(-5)}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.text }}>{o.customerName || '—'}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted }}>{o.product?.name || '—'}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.text }}>{o.qty ?? 1}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: P.text }}>{formatTotal(o.total)}</div>
            <StatusBadge status={o.status} />
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: P.muted }}>{formatDate(o.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬜" },
  { id: "products", label: "Mis productos", icon: "📦" },
  { id: "orders", label: "Órdenes", icon: "📋" },
  { id: "blog", label: "Notas (Blog)", icon: "✏️" },
];

export default function AppAuthWrapper() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('provider_user')); } catch { return null; } });

  if (!token) {
    return <ProviderLogin onLogin={(t) => { setToken(t); setUser(JSON.parse(localStorage.getItem('provider_user'))); }} />;
  }
  return <ProviderDashboard onLogout={() => { setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('provider_user'); }} user={user} token={token} />;
}

function ProviderLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // store user info and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('provider_user', JSON.stringify({ ...data.user, stores: data.stores }));
        onLogin(data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error conectando al servidor');
    }
  };

  return (
    <div style={{ background: P.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.text, fontFamily: "'DM Sans', sans-serif" }}>
      <form onSubmit={handleLogin} style={{ background: P.surface, padding: 40, borderRadius: 12, border: `1px solid ${P.border}`, width: '100%', maxWidth: 360 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Inicia sesión</h1>
        {error && <div style={{ color: P.red, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 6 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: P.bg, border: `1px solid ${P.border}`, color: P.text, boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 6 }}>Contraseña</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: P.bg, border: `1px solid ${P.border}`, color: P.text, boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, background: P.accent, color: '#000', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Entrar al Panel</button>
      </form>
    </div>
  );
}

function ProviderDashboard({ onLogout, user, token }) {
  const [active, setActive] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  return (
    <>
      <style>{FONT_IMPORT}</style>
      <div style={{ display: "flex", height: "100vh", background: P.bg, color: P.text, overflow: "hidden", fontFamily: "'DM Sans',sans-serif" }}>

        {/* SIDEBAR */}
        <div style={{ width: 200, background: P.surface, borderRight: `1px solid ${P.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${P.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 1 }}>
              DROP<span style={{ color: P.accent }}>GEAR</span>
            </div>
            <div style={{ fontSize: 10, color: P.muted, letterSpacing: "0.5px" }}>Panel de proveedor</div>
          </div>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${P.border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: P.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1410" }}>{user?.email?.[0]?.toUpperCase() || 'V'}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'Mi tienda'}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: P.green }} />
              <span style={{ fontSize: 10, color: P.green }}>Proveedor activo</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "8px 8px" }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setActive(item.id); setEditing(null); setEditingBlog(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer", marginBottom: 2, background: active === item.id ? "rgba(232,168,124,0.1)" : "transparent", color: active === item.id ? P.accent : P.muted, textAlign: "left", transition: "all 0.15s", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: active === item.id ? 600 : 400 }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                {item.label}
                {item.id === "products" && (
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, background: "rgba(232,50,26,0.15)", color: P.accent, padding: "1px 5px", borderRadius: 3 }}>•</span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ padding: "8px 8px", borderTop: `1px solid ${P.border}` }}>
            <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", color: P.red, textAlign: "left", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
              Cerrar sesión
            </button>
            <button onClick={() => window.open('http://localhost:3000', '_blank')} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", color: P.muted, textAlign: "left", fontSize: 11, fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
              ↗ Ver mi tienda
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {active === "dashboard" && <Dashboard />}
          {active === "products" && !editing && <ProductsList onEdit={p => { setEditing(p); }} token={token} user={user} />}
          {active === "products" && editing && <LandingEditor product={editing} onBack={() => setEditing(null)} token={token} />}
          {active === "orders" && <Orders />}
          {active === "blog" && !editingBlog && <BlogList onEdit={b => setEditingBlog(b)} token={token} />}
          {active === "blog" && editingBlog && <BlogEditor draft={editingBlog} onBack={() => setEditingBlog(null)} token={token} />}
        </div>
      </div>
    </>
  );
}

// ─── BLOG (NOTAS) COMPONENTS ──────────────────────────────────────────────────
function BlogList({ onEdit, token }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`${API}/api/blog/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if(Array.isArray(data)) setPosts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [token]);

  const deletePost = async (id) => {
    if(!window.confirm("¿Eliminar esta nota?")) return;
    try {
      await fetch(`${API}/api/blog/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPosts();
    } catch(e) {}
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, color: P.text, letterSpacing: "-0.3px", marginBottom: 2 }}>Notas del Blog</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: P.muted }}>Artículos e historias de tus productos. Requieren aprobación para ser públicos.</p>
        </div>
        <button onClick={() => onEdit({ id: 'new', title: '', excerpt: '', content: '', thumbnailUrl: '', coverUrl: '' })} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, background: P.accent, color: "#1A1410", border: "none", borderRadius: 7, padding: "9px 18px", cursor: "pointer" }}>
          + Nueva nota
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading && <div style={{ color: P.muted, fontSize: 13 }}>Cargando notas...</div>}
        {!loading && posts.length === 0 && <div style={{ color: P.muted, fontSize: 13 }}>No has creado notas aún.</div>}
        
        {posts.map(p => (
          <div key={p.id} style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 80, height: 56, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: `1px solid ${P.border}`, background: P.surfaceHigh }}>
              {p.thumbnailUrl || p.coverUrl 
                ? <img src={p.thumbnailUrl || p.coverUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.title}/>
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: P.muted, fontSize: 10 }}>Sin foto</div>}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: P.text }}>{p.title}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: p.published ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: p.published ? P.green : P.yellow }}>
                  {p.published ? "Publicado" : "Pendiente de revisión"}
                </span>
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: P.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.excerpt || 'Sin resumen'}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => deletePost(p.id)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: "transparent", color: P.red, border: "none", cursor: "pointer", padding: "7px" }}>Borrar</button>
              <button onClick={() => onEdit(p)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: "transparent", color: P.accent, border: `1px solid ${P.accent}`, borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogEditor({ draft, onBack, token }) {
  const [form, setForm] = useState(draft);
  const [saving, setSaving] = useState(false);

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
    if (!form.title || !form.content) return alert("Título y contenido requeridos.");
    setSaving(true);
    try {
      const method = form.id === 'new' ? 'POST' : 'PUT';
      const url = form.id === 'new' ? `${API}/api/blog` : `${API}/api/blog/${form.id}`;
      
      const payload = { ...form };
      delete payload.id;
      delete payload.published; // Provided by API logic
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) onBack();
      else alert("Error guardando post.");
    } catch(e) {
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", color: P.muted, fontSize: 13, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
        ← Volver
      </button>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, color: P.text, letterSpacing: "-0.3px" }}>
          {draft.id === 'new' ? "Nueva Nota" : "Editar Nota"}
        </h2>
        <button onClick={save} disabled={saving} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, background: P.accent, color: "#1A1410", border: "none", borderRadius: 7, padding: "9px 24px", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Guardando..." : "Enviar a revisión"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 8 }}>Título</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="El origen de nuestra reserva" style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: P.surface, border: `1px solid ${P.border}`, color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 600, boxSizing: 'border-box' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 8 }}>Resumen (Excerpt)</label>
          <textarea value={form.excerpt || ""} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Breve descripción para la tarjeta..." style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: P.surface, border: `1px solid ${P.border}`, color: P.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 8 }}>Miniatura (Lista de posts) <span style={{fontSize:10}}>1:1 o 4:3</span></label>
            <div style={{ width: "100%", height: 120, background: P.surface, border: `1px dashed ${P.border}`, borderRadius: 8, overflow: "hidden", position: "relative" }}>
               {form.thumbnailUrl && <img src={form.thumbnailUrl} style={{ width:"100%", height:"100%", objectFit:"cover"}} />}
               <label style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, cursor: "pointer", opacity: form.thumbnailUrl ? 0 : 1, transition: "opacity 0.2s" }}>
                 <input type="file" accept="image/*" style={{display:"none"}} onChange={e => handleUpload(e, 'thumbnailUrl')}/>
                 Subir imagen
               </label>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 8 }}>Portada Interna (Cabecera) <span style={{fontSize:10}}>16:9</span></label>
            <div style={{ width: "100%", height: 120, background: P.surface, border: `1px dashed ${P.border}`, borderRadius: 8, overflow: "hidden", position: "relative" }}>
               {form.coverUrl && <img src={form.coverUrl} style={{ width:"100%", height:"100%", objectFit:"cover"}} />}
               <label style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, cursor: "pointer", opacity: form.coverUrl ? 0 : 1, transition: "opacity 0.2s" }}>
                 <input type="file" accept="image/*" style={{display:"none"}} onChange={e => handleUpload(e, 'coverUrl')}/>
                 Subir imagen
               </label>
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: P.muted, marginBottom: 8 }}>Texto Completo (Soporta Markdown)</label>
          <MarkdownEditor value={form.content || ""} onChange={v => setForm({...form, content: v})} token={token} />
        </div>
      </div>
    </div>
  );
}

export function MarkdownEditor({ value, onChange, token }) {
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

  const btnStyle = { background: "rgba(255,255,255,0.05)", border: `1px solid ${P.border}`, color: P.text, borderRadius: 4, padding: "4px 8px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center" };

  return (
    <div style={{ border: `1px solid ${P.border}`, borderRadius: 8, overflow: "hidden", background: P.surface }}>
       <div style={{ display: "flex", gap: 6, padding: "8px 12px", background: P.surfaceHigh, borderBottom: `1px solid ${P.border}` }}>
         <button type="button" onClick={() => insert("**", "**")} style={btnStyle}><b>B</b></button>
         <button type="button" onClick={() => insert("*", "*")} style={btnStyle}><i>I</i></button>
         <button type="button" onClick={() => insert("## ", "")} style={{...btnStyle, fontWeight:600}}>H2</button>
         <button type="button" onClick={() => insert("### ", "")} style={{...btnStyle, fontWeight:600}}>H3</button>
         <div style={{width: 1, background: P.border, margin: "0 4px"}}/>
         <button type="button" onClick={() => insert("[Enlace](", ")")} style={btnStyle}>🔗</button>
         <label style={{ ...btnStyle, cursor: "pointer", margin:0 }}>
           🖼️
           <input type="file" style={{ display: "none" }} accept="image/*" onChange={uploadImage} />
         </label>
       </div>
       <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", minHeight: 400, padding: "16px", background: "transparent", color: P.text, border: "none", resize: "vertical", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, boxSizing: "border-box", outline:"none" }} placeholder="Escribe tu historia aquí usando formato Markdown..." />
    </div>
  );
}
