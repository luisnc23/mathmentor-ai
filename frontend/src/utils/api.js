const BASE = import.meta.env.VITE_API_URL || "";

export async function analyzeMathStream({ exercise, procedure, helpLevel, onToken }) {
  let response;
  try {
    response = await fetch(`${BASE}/api/analyze/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise, procedure, helpLevel }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let msg = "No se pudo analizar el ejercicio.";
    try { msg = JSON.parse(text)?.error || msg; } catch { /* noop */ }
    throw new Error(msg);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let sseBuffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (sseBuffer.trim()) {
        const result = parseSseBlock(sseBuffer, onToken);
        if (result !== undefined) return result;
      }
      throw new Error("La respuesta llegó incompleta. Intenta de nuevo.");
    }

    sseBuffer += decoder.decode(value, { stream: true });
    const blocks = sseBuffer.split("\n\n");
    sseBuffer = blocks.pop();

    for (const block of blocks) {
      const result = parseSseBlock(block, onToken);
      if (result !== undefined) return result;
    }
  }
}

function parseSseBlock(block, onToken) {
  const eventMatch = block.match(/^event:\s*(\S+)/m);
  const dataMatch  = block.match(/^data:\s*(.+)/m);
  if (!dataMatch) return undefined;

  const event = eventMatch?.[1] ?? "message";
  let data;
  try { data = JSON.parse(dataMatch[1].trim()); } catch { return undefined; }

  if (event === "token")  { onToken?.(data.token ?? ""); return undefined; }
  if (event === "result") { return data; }
  if (event === "error")  { throw new Error(data.message || "Error del servidor."); }
  return undefined;
}
