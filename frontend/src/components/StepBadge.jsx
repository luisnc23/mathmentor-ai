const StepBadge = ({ step }) => {
  const cls = step.estado === "correcto" ? "step-correct" : step.estado === "error" ? "step-error" : "step-warn";
  const icon = step.estado === "correcto" ? "✓" : step.estado === "error" ? "✗" : "⚠";
  return (
    <div className={`step-indicator ${cls}`} style={{ marginBottom: 8 }}>
      <span style={{ fontWeight: 700 }}>{icon}</span>
      <span>Paso {step.paso}</span>
      {step.nota && <span style={{ opacity: 0.8, fontWeight: 400 }}>— {step.nota}</span>}
    </div>
  );
};

// ============================================================
// COMPONENT: RESULT PANEL
// ============================================================

export default StepBadge;
