# Attivare il Tutor AI 🦉 (guida passo passo)

Il Tutor AI traduce **qualsiasi** versione/parola e spiega passo passo. Per funzionare ha bisogno di un piccolo "ponte" (un **Cloudflare Worker**) che tiene **segreta** la tua chiave AI: la chiave non va MAI nel sito pubblico.

Servono **3 cose**, una volta sola (~10 minuti):

---

## 1) Una chiave API di Anthropic (l'AI)

1. Vai su **https://console.anthropic.com** e crea un account.
2. Aggiungi un metodo di pagamento e un piccolo credito (es. 5 $). Ogni versione tradotta costa **pochi centesimi**.
3. Menu **API Keys → Create Key**. Copia la chiave (inizia con `sk-ant-...`). **Tienila segreta.**

> Vuoi spendere ancora meno? Nel file `worker.js` cambia `claude-opus-4-8` in `claude-sonnet-4-6` (più economico) o `claude-haiku-4-5` (il più economico).

## 2) Il "ponte" su Cloudflare (gratis)

1. Crea un account gratuito su **https://dash.cloudflare.com**.
2. Vai su **Workers & Pages → Create → Workers → Create Worker**. Dagli un nome (es. `latino-tutor`) e **Deploy**.
3. **Edit code**: cancella tutto e incolla il contenuto del file **`worker.js`** (in questa cartella). **Deploy**.
4. Vai su **Settings → Variables and Secrets → Add**:
   - Nome `ANTHROPIC_API_KEY`, valore = la chiave del punto 1, tipo **Secret (Encrypt)**. Salva.
   - *(Facoltativo ma consigliato)* Nome `ACCESS_CODE`, valore = una parola d'ordine a tua scelta (es. `casa2026`), tipo **Secret**. Serve a evitare che estranei usino il tuo ponte.
5. In alto trovi l'**indirizzo del Worker**, tipo:
   `https://latino-tutor.tuonome.workers.dev`  → **copialo**.

## 3) Collega l'app

1. Apri **Latino facile** → **Aa Impostazioni** → sezione **Tutor AI**.
2. Incolla l'**indirizzo del Worker** nel campo apposito.
3. Se al punto 2.4 hai messo `ACCESS_CODE`, scrivi la stessa parola d'ordine nel campo **Codice**.
4. Fatto! Vai su **🦉 Tutor** e prova a incollare una versione.

---

## Note
- **Privacy:** il testo che incolli viene inviato all'AI (Anthropic) solo per essere tradotto. Non vengono salvati dati personali nel sito.
- **Costi:** paghi solo l'uso dell'AI (pochi centesimi a versione), sul tuo account Anthropic. Cloudflare Worker è gratis per questo uso.
- **Sicurezza:** la chiave resta dentro il Worker (segreta). Se per sbaglio la esponi, cancellala su console.anthropic.com e creane una nuova.
- **Limiti anti-abuso:** il ponte accetta testi fino a 4000 caratteri. Per limitare ancora di più, su Cloudflare puoi aggiungere una "Rate limiting rule".

Senza questi 3 passaggi, l'app funziona lo stesso in tutte le altre sezioni (casi, tabelle, lessico, esercizi, ecc.): solo la sezione **🦉 Tutor** resterà in attesa di configurazione.
