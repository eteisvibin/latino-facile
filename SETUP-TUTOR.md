# Attivare il Tutor AI 🦉 (guida passo passo)

Il Tutor AI traduce **qualsiasi** versione/parola e spiega passo passo. Per funzionare serve un piccolo "ponte" (un **Cloudflare Worker**, gratuito) che tiene **segreta** la chiave AI: la chiave non va MAI nel sito pubblico.

Scegli una delle due opzioni:

| | A) **Gemini — GRATIS** ✅ consigliata | B) Anthropic (Claude) — a pagamento |
|---|---|---|
| Costo | **Gratis** (niente carta di credito) | pochi centesimi a versione |
| Qualità sul latino | molto buona | la migliore |
| File del ponte | `worker-gemini.js` | `worker.js` |
| Chiave (segreto) | `GEMINI_API_KEY` | `ANTHROPIC_API_KEY` |

L'app è identica nei due casi: cambia solo quale file incolli nel Worker e quale chiave usi.

---

# Opzione A — Gemini (GRATIS) ✅

### 1) Chiave gratis di Google (niente carta)
1. Vai su **https://aistudio.google.com** e accedi con un account Google.
2. In alto/lato clicca **Get API key → Create API key** (puoi crearla "in a new project").
3. **Copia** la chiave (inizia con `AIza...`) e tienila da parte. È **gratis** (tier gratuito, con limiti d'uso ampi per lo studio).

### 2) Il "ponte" su Cloudflare (gratis)
1. Crea un account gratuito su **https://dash.cloudflare.com**.
2. **Workers & Pages → Create → Workers → Create Worker**. Nome es. `latino-tutor`, poi **Deploy**.
3. **Edit code**: cancella tutto e incolla il contenuto del file **`worker-gemini.js`** (in questa cartella). **Deploy**.
4. **Settings → Variables and Secrets → + Add**:
   - Nome `GEMINI_API_KEY`, valore = la chiave del punto 1, tipo **Secret (Encrypt)** → **Save/Deploy**.
   - *(facoltativo, consigliato)* `ACCESS_CODE` = una parola d'ordine a tua scelta (es. `casa2026`), tipo **Secret**: così nessun estraneo può usare il tuo ponte.
5. In alto copia l'**indirizzo del Worker**, tipo `https://latino-tutor.tuonome.workers.dev`.

### 3) Collega l'app
1. **Latino facile → Aa Impostazioni → 🦉 Tutor AI**: incolla l'indirizzo del Worker.
2. Se hai messo `ACCESS_CODE`, scrivi la stessa parola d'ordine nel campo **Codice**.
3. Vai su **🦉 Tutor** e prova! ✅

> Se compare un errore tipo "modello non trovato", apri **aistudio.google.com**, guarda il nome esatto del modello e mettilo nella riga `const MODEL = "..."` in cima a `worker-gemini.js`.

---

# Opzione B — Anthropic / Claude (a pagamento, qualità top)

Uguale alla A, ma:
1. Chiave da **https://console.anthropic.com** (serve un piccolo credito, es. 5 $) → **API Keys → Create Key** (`sk-ant-...`).
2. Nel Worker incolla **`worker.js`** (invece di `worker-gemini.js`).
3. La variabile segreta si chiama **`ANTHROPIC_API_KEY`**.
4. Stessa Fase 3 (incolla l'indirizzo nell'app).

---

## Note
- **Privacy:** il testo che incolli viene inviato all'AI solo per essere tradotto. Su Gemini gratuito Google può usare i dati per migliorare i suoi servizi: va benissimo per le versioni di latino, ma non incollare dati personali. Nessun dato viene salvato nel sito.
- **Limiti (Gemini gratis):** ci sono limiti di richieste al minuto/giorno, ampi per lo studio di una persona. Se capita "troppe richieste", aspetta un minuto.
- **Su più dispositivi:** l'indirizzo si salva sul dispositivo. Per usarlo anche sul telefono di tua sorella, rifai solo la Fase 3 lì (stesso indirizzo).
- **Sicurezza:** la chiave resta dentro il Worker (segreta). Se per sbaglio la esponi, cancellala (su aistudio.google.com o console.anthropic.com) e creane una nuova.

Senza configurazione, l'app funziona lo stesso in tutte le altre sezioni: solo la sezione **🦉 Tutor** resta in attesa.
