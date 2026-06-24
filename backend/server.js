import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "./prompt.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Groq client ────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// ── Helpers ────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));
app.use(express.json({ limit: "10mb" }));

function extractJsonObject(text) {
  if (!text) return null;
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch { /* continue */ }
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last <= first) return null;
  try { return JSON.parse(cleaned.slice(first, last + 1)); } catch { return null; }
}

function normalizeParsed(parsed) {
  return {
    tipo_problema:        parsed?.tipo_problema        || "Matemática",
    pasos_analizados:     Array.isArray(parsed?.pasos_analizados) ? parsed.pasos_analizados : [],
    primer_error_paso:    parsed?.primer_error_paso    ?? null,
    procedimiento_correcto: Boolean(parsed?.procedimiento_correcto),
    tipo_error:           parsed?.tipo_error           ?? null,
    mensaje_principal:    parsed?.mensaje_principal    || "Revisa tu procedimiento.",
    pista:                parsed?.pista                ?? null,
    puede_continuar:      parsed?.puede_continuar      ?? true,
    motor:                "groq/" + GROQ_MODEL,
  };
}

function buildUserPrompt(exercise, procedure, helpLevel) {
  const numberedSteps = (procedure || "")
    .split(/\n+/)
    .map(l => l.trim()).filter(Boolean)
    .map((l, i) => `  Paso ${i + 1}: ${l}`)
    .join("\n");

  return [
    "═══════════════════════════════════",
    "EJERCICIO:",
    "═══════════════════════════════════",
    (exercise || "").trim(),
    "",
    "═══════════════════════════════════",
    "PROCEDIMIENTO DEL ESTUDIANTE:",
    "═══════════════════════════════════",
    numberedSteps || "(sin procedimiento)",
    "",
    `NIVEL DE PISTA SOLICITADO: ${helpLevel} de 4`,
    "═══════════════════════════════════",
    "",
    "Primero resuelve el ejercicio tú mismo. Luego compara cada paso numerado.",
    "Responde ÚNICAMENTE con el JSON.",
  ].join("\n");
}

// Cache en memoria: mismo input → mismo resultado
const cache = new Map();
function cacheKey(exercise, procedure, helpLevel) {
  return `${helpLevel}||${(exercise||"").trim()}||${(procedure||"").trim()}`;
}

// ── Health ─────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: GROQ_MODEL });
});

// ── Streaming endpoint (SSE) ───────────────────────────────────
app.post("/api/analyze/stream", async (req, res) => {
  const { exercise, procedure, helpLevel = 1 } = req.body || {};

  if (!exercise?.trim() && !procedure?.trim()) {
    res.status(400).json({ error: "Escribe el ejercicio y tu procedimiento." });
    return;
  }

  const level = [1,2,3,4].includes(Number(helpLevel)) ? Number(helpLevel) : 1;
  const key = cacheKey(exercise, procedure, level);

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Cache hit
  if (cache.has(key)) {
    send("result", cache.get(key));
    res.end();
    return;
  }

  try {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0,
      max_tokens: 800,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(exercise, procedure, level) },
      ],
    });

    let accumulated = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        accumulated += token;
        send("token", { token });
      }

      if (chunk.choices[0]?.finish_reason) {
        const parsed = extractJsonObject(accumulated);
        if (!parsed) {
          send("error", { message: `El modelo no devolvió JSON válido. Respuesta: "${accumulated.slice(0, 150)}"` });
          res.end();
          return;
        }
        const result = normalizeParsed(parsed);
        if (cache.size >= 200) cache.delete(cache.keys().next().value);
        cache.set(key, result);
        send("result", result);
        res.end();
        return;
      }
    }
  } catch (err) {
    console.error("[Groq] Error:", err.message);
    const msg = err?.status === 401
      ? "API Key de Groq inválida. Revisa tu variable GROQ_API_KEY."
      : err?.status === 429
        ? "Límite de Groq alcanzado. Espera un momento e intenta de nuevo."
        : `Error de Groq: ${err.message}`;
    send("error", { message: msg });
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`✓ MathMentor AI corriendo en http://localhost:${PORT}`);
  console.log(`✓ Modelo: ${GROQ_MODEL}`);
});
