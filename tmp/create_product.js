

async function createProduct() {
  const payload = {
    name: "The Barista Touch™ Extress",
    category: "Equipamiento Barista Premium",
    price: 1850000,
    subPrice: 1650000,
    tagline: "Café de especialidad en tu casa. Pantalla interactiva y texturización automática de leche.",
    description: "La máquina de espresso definitiva. Guía paso a paso para hacer el café de especialidad de la tercera ola perfecto, sin ser un barista profesional. Innovación pura en acero inoxidable.",
    heroImageUrl: "https://images.unsplash.com/photo-1585202685710-8b17ce284e3d?auto=format&fit=crop&w=1200&q=80",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620063251786-fb7c96369c9b?auto=format&fit=crop&w=800&q=80"
    ]),
    seoBody: `## El café de la tercera ola, paso a paso.
Descubre una nueva forma de preparar espresso con la tecnología *Impress™ Puck System*. Dosificación inteligente, precisión volumétrica y un apisonado asistido para garantizar que cada extracción libere todos los aceites aromáticos del grano.

![Apisonado perfecto](https://images.unsplash.com/photo-1610889556528-9a370e4de2be?auto=format&fit=crop&w=1000&q=80)

### Diseño y Tecnología en perfecta armonía
Construida en acero inoxidable cepillado con un perfil industrial moderno, esta máquina no solo hace un espresso excepcional, sino que transforma tu cocina.

* **Molinillo cónico integrado:** Fresas de precisión para un control microscópico sobre el tamaño de molienda.
* **Sistema ThermoJet®:** Alcanza la temperatura de extracción óptima en exactamente **3 segundos**, sin tiempos de espera entre el café y el espumado.
* **Auto MilQ™:** Texturización automática de microespuma con tres niveles térmicos para lograr *latte art* digno de campeonato.

> "La The Barista Touch™ ha elevado mi ritual de las mañanas a niveles que solo solía experimentar en cafeterías ultra exclusivas de Melbourne. Inigualable." — *Revista Specialty Coffee*

### ¿Por qué elegirla?
Tienes el romanticismo de hacer el proceso de barista tú mismo, pero con la asistencia tecnológica para **nunca equivocarte**. Sorprende a tus invitados con extracciones consistentes y cremosas todos los días.`,
    badges: JSON.stringify(["Acero Inoxidable", "Garantía 2 años", "Envío Asegurado"]),
    stats: JSON.stringify([
      { value: "3s", label: "Calentamiento" },
      { value: "15", label: "Bares Bomba" },
      { value: "LCD", label: "Pantalla táctil" },
      { value: "Esp.", label: "Microespuma" }
    ]),
    faqs: JSON.stringify([
      { q: "¿Viene con accesorios?", a: "Sí, incluye portafiltro comercial de 54mm, jarra de acero inoxidable, discos de limpieza y filtros de agua." },
      { q: "¿Qué tan difícil es limpiar?", a: "El ciclo de retrolavado es automático y la varilla de vapor se purga a sí misma tras texturizar." }
    ]),
    status: "activo"
  };

  try {
    const res = await fetch('http://localhost:4000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log("Producto creado con éxito:", data);
  } catch (e) {
    console.error("Falló la creación:", e);
  }
}

createProduct();
