/* =========================================================
   Latino facile — "Ponte" GRATIS per il Tutor AI (Google Gemini)
   Cloudflare Worker. Tiene SEGRETA la chiave; l'app chiama questo Worker.
   Versione GRATUITA: usa la chiave gratis di Google AI Studio (niente carta).

   COME ATTIVARLO: vedi SETUP-TUTOR.md (Opzione A — gratis)
   Variabili da impostare nel Worker (Settings → Variables and Secrets):
     - GEMINI_API_KEY  (segreto, obbligatorio) → chiave gratis da aistudio.google.com
     - ACCESS_CODE     (segreto, facoltativo)   → "parola d'ordine" anti-estranei
   ========================================================= */

// Se dà errore "modello non trovato", apri aistudio.google.com e copia il nome esatto del modello.
const MODEL = "gemini-2.5-flash";   // gratis e adatto al latino; alternativa: "gemini-2.5-flash-lite"
const MAX_TOKENS = 8192;
const MAX_CHARS = 4000;
const ALLOW_ORIGINS = [
  "https://eteisvibin.github.io",
  "http://localhost:8123",
  "http://127.0.0.1:8123"
];

const BASE_SYS =
  "Sei un tutor di latino gentile e preciso per una studentessa italiana del biennio del liceo (con DSA: usa frasi chiare e brevi). " +
  "Usa la terminologia scolastica italiana (casi: nominativo, genitivo, dativo, accusativo, vocativo, ablativo; complementi dell'analisi logica). " +
  "Sii accurato: se un punto è ambiguo, scegli la lettura più probabile per il biennio e segnalalo in poche parole. " +
  "Rispondi SOLO con un oggetto JSON valido: niente testo prima o dopo, nessun blocco ``` , nessun commento.";

const MODES = {
  diretta: {
    system: BASE_SYS + " Traduci dal latino all'italiano. Chiavi del JSON: " +
      '{"letterale": testo (traduzione fedele, parola per parola), "scorrevole": testo (italiano naturale e corretto), "note": testo (max 2 frasi su costrutti/parole notevoli)}.',
    user: (t) => "Traduci questa versione di latino:\n\n" + t
  },
  passopasso: {
    system: BASE_SYS + " Insegna a tradurre passo passo. Chiavi del JSON: " +
      '{"passi": array di oggetti {"lat": parola/e latine, "analisi": caso e funzione oppure persona/tempo/modo (italiano semplice), "it": significato}, ' +
      '"letterale": traduzione fedele, "scorrevole": italiano naturale, "note": un consiglio breve}.',
    user: (t) => "Spiega e traduci passo passo questa versione di latino:\n\n" + t
  },
  italatino: {
    system: BASE_SYS + " Traduci dall'italiano al latino, latino corretto e adatto al biennio. Chiavi del JSON: " +
      '{"latino": la traduzione in latino, "spiegazione": poche frasi sui casi/costrutti scelti}.',
    user: (t) => "Traduci in latino questa frase italiana:\n\n" + t
  },
  parola: {
    system: BASE_SYS + " Ti do una parola o frase breve (latino o italiano). Chiavi del JSON: " +
      '{"voce": forma base (nomi: nominativo, genitivo e genere; verbi: paradigma/voci principali), ' +
      '"analisi": che cos\'è la forma data (caso/numero, oppure persona/tempo/modo), "significato": la traduzione, "esempio": una frasetta d\'uso con traduzione}.',
    user: (t) => "Analizza e traduci:\n\n" + t
  }
};

function corsHeaders(origin){
  const allow = ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-access-code",
    "Access-Control-Max-Age": "86400"
  };
}
function json(obj, status, headers){
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, "Content-Type":"application/json" } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error:"Usa POST." }, 405, cors);

    if (env.ACCESS_CODE && request.headers.get("x-access-code") !== env.ACCESS_CODE)
      return json({ error:"Codice di accesso mancante o errato." }, 401, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error:"Richiesta non valida." }, 400, cors); }

    const text = (body && body.text || "").toString().trim();
    const conf = MODES[body && body.mode];
    if (!conf) return json({ error:"Modalità sconosciuta." }, 400, cors);
    if (!text) return json({ error:"Scrivi un testo da tradurre." }, 400, cors);
    if (text.length > MAX_CHARS) return json({ error:"Testo troppo lungo (max " + MAX_CHARS + " caratteri). Dividilo in parti." }, 400, cors);
    if (!env.GEMINI_API_KEY) return json({ error:"Il Worker non ha la chiave (GEMINI_API_KEY)." }, 500, cors);

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
      return json({ error:"Non riesco a contattare l'AI. Riprova." }, 502, cors);
    }

    if (!r.ok) {
      const t = await r.text();
      return json({ error:"L'AI ha risposto con un errore (" + r.status + ").", dettaglio: t.slice(0, 300) }, 502, cors);
    }

    const data = await r.json();
    const cand = data && data.candidates && data.candidates[0];
    const parts = cand && cand.content && cand.content.parts;
    const out = parts ? parts.map(p => p.text || "").join("") : "";
    if (!out) {
      const motivo = (data && data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "vuota";
      return json({ error:"L'AI non ha prodotto una risposta (" + motivo + "). Riprova o accorcia il testo." }, 502, cors);
    }
    return json({ ok:true, risultato: out }, 200, cors);   // out è già una stringa JSON
  }
};
