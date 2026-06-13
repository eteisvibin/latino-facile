/* =========================================================
   Latino facile — Tutor AI come Cloudflare PAGES FUNCTION
   File: functions/api/tutor.js  →  endpoint pubblico: /api/tutor
   Funziona automaticamente se il repo è collegato a Cloudflare Pages.

   La chiave NON è qui: va messa nelle variabili del progetto Pages
   (Settings → Variables and Secrets), come Secret:
     - GEMINI_API_KEY  (obbligatorio)  → chiave gratis di aistudio.google.com
     - ACCESS_CODE     (facoltativo)   → "parola d'ordine" anti-estranei
   ========================================================= */

const MODEL = "gemini-2.5-flash";  // se dà "modello non trovato", copia il nome esatto da aistudio.google.com
const MAX_TOKENS = 8192;
const MAX_CHARS = 4000;

const BASE_SYS =
  "Sei un tutor di latino gentile e preciso per una studentessa italiana del biennio del liceo (con DSA: usa frasi chiare e brevi). " +
  "Usa la terminologia scolastica italiana (casi: nominativo, genitivo, dativo, accusativo, vocativo, ablativo; complementi dell'analisi logica). " +
  "Sii accurato: se un punto è ambiguo, scegli la lettura più probabile per il biennio e segnalalo in poche parole. " +
  "Rispondi SOLO con un oggetto JSON valido: niente testo prima o dopo, nessun blocco ``` , nessun commento.";

const MODES = {
  diretta: {
    system: BASE_SYS + " Traduci dal latino all'italiano. Chiavi del JSON: " +
      '{"letterale": traduzione fedele parola per parola, "scorrevole": italiano naturale e corretto, "note": max 2 frasi su costrutti/parole notevoli}.',
    user: (t) => "Traduci questa versione di latino:\n\n" + t
  },
  passopasso: {
    system: BASE_SYS + " Insegna a tradurre passo passo. Chiavi del JSON: " +
      '{"passi": array di {"lat": parola/e latine, "analisi": caso e funzione oppure persona/tempo/modo (italiano semplice), "it": significato}, ' +
      '"letterale": traduzione fedele, "scorrevole": italiano naturale, "note": un consiglio breve}.',
    user: (t) => "Spiega e traduci passo passo questa versione di latino:\n\n" + t
  },
  italatino: {
    system: BASE_SYS + " Traduci dall'italiano al latino, corretto e adatto al biennio. Chiavi del JSON: " +
      '{"latino": la traduzione in latino, "spiegazione": poche frasi sui casi/costrutti scelti}.',
    user: (t) => "Traduci in latino questa frase italiana:\n\n" + t
  },
  parola: {
    system: BASE_SYS + " Ti do una parola o frase breve (latino o italiano). Chiavi del JSON: " +
      '{"voce": forma base (nomi: nominativo, genitivo e genere; verbi: paradigma), "analisi": che cos\'è la forma data (caso/numero o persona/tempo/modo), "significato": traduzione, "esempio": frasetta d\'uso con traduzione}.',
    user: (t) => "Analizza e traduci:\n\n" + t
  }
};

function cors(origin){
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-access-code",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(obj, status, headers){
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, "Content-Type":"application/json" } });
}

export async function onRequest(context){
  const { request, env } = context;
  const origin = request.headers.get("Origin") || "";
  const h = cors(origin);

  if (request.method === "OPTIONS") return new Response(null, { headers: h });
  if (request.method !== "POST") return json({ error:"Usa POST." }, 405, h);

  if (env.ACCESS_CODE && request.headers.get("x-access-code") !== env.ACCESS_CODE)
    return json({ error:"Codice di accesso mancante o errato." }, 401, h);

  let body;
  try { body = await request.json(); } catch { return json({ error:"Richiesta non valida." }, 400, h); }

  const text = (body && body.text || "").toString().trim();
  const conf = MODES[body && body.mode];
  if (!conf) return json({ error:"Modalità sconosciuta." }, 400, h);
  if (!text) return json({ error:"Scrivi un testo da tradurre." }, 400, h);
  if (text.length > MAX_CHARS) return json({ error:"Testo troppo lungo (max " + MAX_CHARS + " caratteri). Dividilo in parti." }, 400, h);
  if (!env.GEMINI_API_KEY) return json({ error:"Manca la chiave: aggiungi GEMINI_API_KEY nelle variabili del progetto Cloudflare." }, 500, h);

  const payload = {
    system_instruction: { parts: [{ text: conf.system }] },
    contents: [{ role: "user", parts: [{ text: conf.user(text) }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: MAX_TOKENS, responseMimeType: "application/json" }
  };

  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";
  let r;
  try {
    r = await fetch(url, {
      method: "POST",
      headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    return json({ error:"Non riesco a contattare l'AI. Riprova." }, 502, h);
  }

  if (!r.ok) {
    const t = await r.text();
    return json({ error:"L'AI ha risposto con un errore (" + r.status + ").", dettaglio: t.slice(0, 300) }, 502, h);
  }

  const data = await r.json();
  const cand = data && data.candidates && data.candidates[0];
  const parts = cand && cand.content && cand.content.parts;
  const out = parts ? parts.map(p => p.text || "").join("") : "";
  if (!out) {
    const motivo = (data && data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "vuota";
    return json({ error:"L'AI non ha prodotto una risposta (" + motivo + "). Riprova o accorcia il testo." }, 502, h);
  }
  return json({ ok:true, risultato: out }, 200, h);
}
