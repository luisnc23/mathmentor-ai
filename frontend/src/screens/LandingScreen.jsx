import { TOPICS } from "../config/constants";

const LandingScreen = ({ onStart }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <div className="grid-bg" />
    <div className="orb orb-1" />
    <div className="orb orb-2" />

    {/* Nav */}
    <nav style={{ position: "relative", zIndex: 10, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>∑</div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>MathMentor AI</span>
      </div>
      <button className="btn btn-primary" onClick={onStart}>Empezar gratis →</button>
    </nav>

    {/* Hero */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
      <div className="badge badge-teal fade-up" style={{ marginBottom: 24 }}>
        🤖 IA Educativa · No revela respuestas
      </div>

      <h1 className="fade-up d1" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
        Tu tutor de{" "}
        <span style={{ background: "linear-gradient(135deg, var(--accent), var(--teal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          matemáticas
        </span>{" "}
        inteligente
      </h1>

      <p className="fade-up d2" style={{ color: "var(--text2)", fontSize: 18, maxWidth: 560, lineHeight: 1.6, marginBottom: 40 }}>
        Sube una foto de tu cuaderno o escribe tu ejercicio. La IA analiza tu procedimiento paso a paso, detecta errores y te da pistas para que aprendas — <strong style={{ color: "var(--text)" }}>sin darte nunca la respuesta final.</strong>
      </p>

      <div className="fade-up d3" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 60 }}>
        <button className="btn btn-primary btn-lg" onClick={onStart}>
          📸 Analizar mi ejercicio
        </button>
        <button className="btn btn-secondary btn-lg" onClick={onStart}>
          ✏️ Escribir un ejercicio
        </button>
      </div>

      {/* Feature cards */}
      <div className="fade-up d4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 900, width: "100%" }}>
        {[
          { icon: "📸", title: "Lee tu foto", desc: "Sube foto de cuaderno, pizarra o examen. La IA lo lee automáticamente." },
          { icon: "🔍", title: "Análisis paso a paso", desc: "Revisa cada paso de tu procedimiento e identifica el error exacto." },
          { icon: "💡", title: "Pistas progresivas", desc: "4 niveles de ayuda. Tú decides cuánta orientación necesitas." },
          { icon: "🚫", title: "Sin respuestas directas", desc: "Aprende de verdad. La IA nunca te da la respuesta final." },
        ].map((f, i) => (
          <div key={i} className="card" style={{ textAlign: "left", animationDelay: `${0.5 + i * 0.1}s` }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>{f.title}</div>
            <div style={{ color: "var(--text3)", fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="fade-up d5" style={{ marginTop: 48 }}>
        <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 12 }}>Temas cubiertos:</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {TOPICS.map(t => (
            <span key={t} className="badge badge-accent">{t}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// COMPONENT: STEP BADGE
// ============================================================

export default LandingScreen;
