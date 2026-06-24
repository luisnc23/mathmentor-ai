import { useState, useRef } from "react";
import { TOPICS, HELP_LABELS } from "../config/constants";
import { analyzeMathStream } from "../utils/api";
import ResultPanel from "../components/ResultPanel";

const AppScreen = ({ onBack }) => {
  const [exercise, setExercise] = useState("");
  const [procedure, setProcedure] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamTokens, setStreamTokens] = useState(0);
  const [result, setResult] = useState(null);
  const [helpLevel, setHelpLevel] = useState(1);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const resultRef = useRef();

  const handleAnalyze = async (level = helpLevel) => {
    if (!exercise.trim() || !procedure.trim()) {
      setError("Por favor escribe el ejercicio y tu procedimiento."); return;
    }
    setError(""); setLoading(true); setStreamTokens(0);
    try {
      const res = await analyzeMathStream({
        exercise, procedure, helpLevel: level,
        onToken: () => setStreamTokens(n => n + 1),
      });
      setResult(res);
      setHelpLevel(level);
      setAttempts(a => a + 1);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Error: " + (e?.message || String(e)));
    } finally {
      setLoading(false); setStreamTokens(0);
    }
  };

  const handleReset = () => {
    setResult(null); setHelpLevel(1); setAttempts(0);
    setExercise(""); setProcedure(""); setError("");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="grid-bg" />
      <div className="orb orb-1" />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, background: "rgba(10,14,26,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border2)" }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ padding: "8px 14px", fontSize: 13 }}>← Inicio</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>∑</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>MathMentor AI</span>
        </div>
        {attempts > 0 && (
          <span className="badge badge-accent" style={{ marginLeft: "auto" }}>
            {attempts} {attempts === 1 ? "análisis" : "análisis realizados"}
          </span>
        )}
      </nav>

      {/* Main */}
      <div style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }} className="two-col">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                {result ? "Tu ejercicio" : "Ingresa tu ejercicio"}
              </h2>
              <p style={{ color: "var(--text3)", fontSize: 14 }}>Escribe el problema y tu procedimiento paso a paso.</p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 6, fontWeight: 500 }}>Enunciado del ejercicio</label>
              <textarea rows={3} value={exercise} onChange={e => setExercise(e.target.value)} placeholder="Ej: Factorizar 6x² + 9x" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 6, fontWeight: 500 }}>Tu procedimiento (paso a paso)</label>
              <textarea
                rows={7} value={procedure} onChange={e => setProcedure(e.target.value)}
                placeholder={"Ej:\nPaso 1: Factor común = 3x\nPaso 2: 3x(2x + 3)"}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ color: "var(--red)", fontSize: 13 }}>⚠ {error}</p>
              </div>
            )}

            {!result && (
              <div style={{ padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Temas disponibles</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TOPICS.map(t => <span key={t} className="badge badge-accent" style={{ fontSize: 11 }}>{t}</span>)}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAnalyze(1)} disabled={loading}>
                {loading
                  ? <><div className="spinner" /> {streamTokens > 0 ? `Generando... (${streamTokens})` : "Analizando..."}</>
                  : "🔍 Analizar procedimiento"}
              </button>
              {result && <button className="btn btn-secondary" onClick={handleReset}>↺ Nuevo</button>}
            </div>

            {result && !result.procedimiento_correcto && (
              <div className="card" style={{ background: "var(--bg2)" }}>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12, fontWeight: 500 }}>¿Corregiste tu procedimiento? Actualízalo arriba y vuelve a analizar:</p>
                <button className="btn btn-teal" style={{ width: "100%" }} onClick={() => handleAnalyze(helpLevel)} disabled={loading}>
                  {loading ? <><div className="spinner" /> Analizando...</> : "✅ Volver a analizar"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          {result && (
            <div ref={resultRef}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Retroalimentación</h2>
              <ResultPanel result={result} helpLevel={helpLevel} loading={loading} onRequestHelp={(level) => handleAnalyze(level)} />
            </div>
          )}
        </div>

        {loading && !result && (
          <div className="fade-in" style={{ marginTop: 32, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div className="spinner spinner-accent" style={{ width: 24, height: 24, borderWidth: 3 }} />
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "var(--text2)", fontFamily: "var(--font-mono)", fontSize: 14, display: "block" }}>Analizando tu procedimiento...</span>
                {streamTokens > 0 && <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 11 }}>✦ {streamTokens} tokens generados</span>}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div style={{ marginTop: 48 }} className="fade-up d3">
            <div className="divider" />
            <p style={{ fontSize: 13, color: "var(--text3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20, textAlign: "center" }}>
              Ejemplos de ejercicios
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {[
                { topic: "Factorización", exercise: "Factorizar: 6x² + 9x", procedure: "Paso 1: Factor común = 3x\nPaso 2: 6x²÷3x = 2x y 9x÷3x = 3\nPaso 3: Resultado: 3x(2x + 3)" },
                { topic: "Límites", exercise: "lím (x→2) de (x² − 4) / (x − 2)", procedure: "Paso 1: Sustituyo x=2: obtengo 0/0\nPaso 2: Factorizo numerador: (x+2)(x-2)\nPaso 3: Simplifico (x-2)\nPaso 4: lím(x→2) de (x+2) = 4" },
                { topic: "Derivadas", exercise: "Derivar: f(x) = x³ + 5x² − 2x + 7", procedure: "Paso 1: f'(x) = 3x²\nPaso 2: + 10x\nPaso 3: − 2\nPaso 4: f'(x) = 3x² + 10x − 2" },
              ].map((ex, i) => (
                <button key={i} className="card"
                  style={{ textAlign: "left", cursor: "pointer", transition: "all 0.2s", background: "var(--bg2)" }}
                  onClick={() => { setExercise(ex.exercise); setProcedure(ex.procedure); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; }}
                >
                  <span className="badge badge-accent" style={{ marginBottom: 10, fontSize: 11 }}>{ex.topic}</span>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)", marginBottom: 8, lineHeight: 1.5 }}>{ex.exercise}</p>
                  <p style={{ color: "var(--text3)", fontSize: 11 }}>Clic para cargar →</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--border2)", padding: "16px 24px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text3)" }}>MathMentor AI</span>
      </footer>
    </div>
  );
};

export default AppScreen;
