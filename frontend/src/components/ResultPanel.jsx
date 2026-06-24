import StepBadge from "./StepBadge";
import { HELP_LABELS } from "../config/constants";

const ResultPanel = ({ result, helpLevel, onRequestHelp, loading }) => {
  if (!result) return null;

  const { tipo_problema, pasos_analizados, procedimiento_correcto, tipo_error, mensaje_principal, pista } = result;

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Tipo + estado general */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="badge badge-accent">📐 {tipo_problema}</span>
        {procedimiento_correcto
          ? <span className="badge badge-green" style={{ fontWeight: 700 }}>✓ Procedimiento correcto</span>
          : <span className="badge badge-red">⚠ Se encontró un error</span>
        }
      </div>

      {/* Análisis de pasos */}
      {pasos_analizados?.length > 0 && (
        <div
          className="card card-sm"
          style={{
            background: procedimiento_correcto ? "rgba(74,222,128,0.06)" : "var(--bg2)",
            border: procedimiento_correcto ? "1px solid rgba(74,222,128,0.3)" : undefined,
          }}
        >
          <p style={{ fontSize: 12, color: procedimiento_correcto ? "var(--green)" : "var(--text3)", fontFamily: "var(--font-mono)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {procedimiento_correcto ? "✓ Todos los pasos correctos" : "Análisis de pasos"}
          </p>
          {pasos_analizados.map((s, i) => <StepBadge key={i} step={s} />)}
        </div>
      )}

      {/* Tipo de error */}
      {tipo_error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ color: "var(--red)", fontSize: 16 }}>🎯</span>
          <span style={{ color: "var(--text2)", fontSize: 13 }}>
            <strong style={{ color: "var(--red)" }}>Tipo de error:</strong> {tipo_error}
          </span>
        </div>
      )}

      {/* Mensaje principal */}
      {procedimiento_correcto ? (
        <div className="success-card bounce-in">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--green)", marginBottom: 8 }}>
            ¡Excelente trabajo!
          </h3>
          <p className="prose">{mensaje_principal}</p>
        </div>
      ) : (
        <div className="card" style={{ background: "var(--bg2)" }}>
          <p style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Retroalimentación</p>
          <p className="prose">{mensaje_principal}</p>
        </div>
      )}

      {/* Pista */}
      {pista && (
        <div style={{
          background: `rgba(${helpLevel === 1 ? "74,222,128" : helpLevel === 2 ? "250,204,21" : helpLevel === 3 ? "251,146,60" : "248,113,113"},0.06)`,
          border: `1px solid rgba(${helpLevel === 1 ? "74,222,128" : helpLevel === 2 ? "250,204,21" : helpLevel === 3 ? "251,146,60" : "248,113,113"},0.25)`,
          borderRadius: "var(--radius)",
          padding: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{HELP_LABELS[helpLevel]?.icon}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: HELP_LABELS[helpLevel]?.color }}>
              Pista Nivel {helpLevel} — {HELP_LABELS[helpLevel]?.label}
            </span>
          </div>
          <p className="prose" style={{ whiteSpace: "pre-line" }}>{pista}</p>
        </div>
      )}

      {/* Escalar nivel de ayuda */}
      {!procedimiento_correcto && (
        <div className="card card-sm" style={{ background: "var(--bg2)" }}>
          <p style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>¿Necesitas más ayuda?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                className={`help-btn ${helpLevel === level ? "active" : ""}`}
                disabled={loading || level < helpLevel}
                onClick={() => onRequestHelp(level)}
              >
                <span>{HELP_LABELS[level].icon}</span>
                <span>Nivel {level} — {HELP_LABELS[level].label}</span>
                {level < helpLevel && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text3)" }}>Usado</span>}
                {level === helpLevel && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--accent2)" }}>← Actual</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
