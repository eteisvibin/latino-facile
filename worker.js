/* =========================================================
   Latino facile — "Ponte" per il Tutor AI (Cloudflare Worker)
   ---------------------------------------------------------
   Tiene SEGRETA la chiave API (non finisce mai nel sito pubblico).
   L'app chiama questo Worker; il Worker chiama l'API di Claude.

   COME ATTIVARLO: vedi SETUP-TUTOR.md
   Variabili da impostare nel Worker (Settings → Variables):
     - ANTHROPIC_API_KEY  (segreto, obbligatorio)  → la tua chiave Anthropic
     - ACCESS_CODE        (segreto, facoltativo)    → una "parola d'ordine"; se la
                           imposti, l'app dovrà inviarla (campo nelle Impostazioni).
   ========================================================= */

const MODEL = "claude-opus-4-8";   // per spendere meno puoi usare "claude-sonnet-4-6" o "claude-haiku-4-5"
const MAX_TOKENS = 4096;
const MAX_CHARS = 4000;            // limite del testo in ingresso (anti-abuso)
const ALLOW_ORIGINS = [
  "https://eteisvibin.github.io",
  "http://localhost:8123",
  "http://127.0.0.1:8123"
];

const BASE_SYS =
  "Sei un tutor di latino gentile e preciso per una studentessa italiana del biennio del liceo (con DSA: usa frasi chiare e brevi). " +
  "Usa la terminologia scolastica italiana (casi: nominativo, genitivo, dativo, accusativo, vocativo, ablativo; complementi dell'analisi logica). " +
  "Sii accurato: se un punto è ambiguo, scegli la lettura più probabile per il biennio e segnalalo con poche parole. Rispondi SOLO con il JSON richiesto.";

const MODES = {
  diretta: {
    system: BASE_SYS + " Traduci dal latino all'italiano. Fornisci due versioni: 'letterale' (fedele, parola per parola, mantiene l'ordine e i casi) e 'scorrevole' (italiano naturale e corretto). In 'note' (max 2 frasi) segnala costrutti o parole degne di attenzione.",
    user: (t) => "Traduci questa versione di latino:\n\n" + t,
    schema: { type:"object", additionalProperties:false,
      properties:{ letterale:{type:"string"}, scorrevole:{type:"string"}, note:{type:"string"} },
      required:["letterale","scorrevole","note"] }
  },
  passopasso: {
    system: BASE_SYS + " Insegna a tradurre passo passo. In 'passi' analizza la frase pezzo per pezzo: per ogni elemento dai 'lat' (la/le parola/e latine), 'analisi' (caso e funzione, oppure persona/tempo/modo del verbo, in italiano semplice) e 'it' (il significato). Poi dai 'letterale' (traduzione fedele) e 'scorrevole' (italiano naturale). In 'note' un consiglio breve.",
    user: (t) => "Spiega e traduci passo passo questa versione di latino:\n\n" + t,
    schema: { type:"object", additionalProperties:false,
      properties:{
        passi:{ type:"array", items:{ type:"object", additionalProperties:false,
          properties:{ lat:{type:"string"}, analisi:{type:"string"}, it:{type:"string"} },
          required:["lat","analisi","it"] } },
        letterale:{type:"string"}, scorrevole:{type:"string"}, note:{type:"string"} },
      required:["passi","letterale","scorrevole","note"] }
  },
  italatino: {
    system: BASE_SYS + " Traduci dall'italiano al latino, con latino corretto e adatto al biennio. In 'latino' metti la traduzione; in 'spiegazione' (poche frasi) di' perché hai scelto quei casi/costrutti.",
    user: (t) => "Traduci in latino questa frase italiana:\n\n" + t,
    schema: { type:"object", additionalProperties:false,
      properties:{ latino:{type:"string"}, spiegazione:{type:"string"} },
      required:["latino","spiegazione"] }
  },
  parola: {
    system: BASE_SYS + " Ti viene data una parola o una frase breve (latino o italiano). In 'voce' riporta la forma base (per i nomi: nominativo, genitivo e genere; per i verbi: il paradigma o le voci principali). In 'analisi' spiega che cos'è la forma data (caso/numero, oppure persona/tempo/modo). In 'significato' la traduzione. In 'esempio' una frasetta d'uso con traduzione.",
    user: (t) => "Analizza e traduci:\n\n" + t,
    schema: { type:"object", additionalProperties:false,
      properties:{ voce:{type:"string"}, analisi:{type:"string"}, significato:{type:"string"}, esempio:{type:"string"} },
      required:["voce","analisi","significato","esempio"] }
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
    if (!env.ANTHROPIC_API_KEY) return json({ error:"Il Worker non ha la chiave API (ANTHROPIC_API_KEY)." }, 500, cors);

    const payload = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: conf.system,
      messages: [{ role:"user", content: conf.user(text) }],
      output_config: { format: { type:"json_schema", schema: conf.schema } }
    };

    let r;
    try {
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
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
    const out = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    return json({ ok:true, risultato: out }, 200, cors);
  }
};
