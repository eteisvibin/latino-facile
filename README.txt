LATINO FACILE — aiuto allo studio del latino (dislessia / disgrafia)
====================================================================

COS'È
-----
Una web-app per studiare il latino del biennio partendo dalle fondamenta,
senza dover scrivere. Allineata al manuale "Semper. Il latino nel tempo"
(D'Anna) e pensata come strumento compensativo per i DSA.

SEZIONI
-------
  • Capire i casi   -> a che serve ogni caso, con un colore per ognuno
  • Le tabelle      -> tutte le 5 declinazioni, aggettivi, pronomi e verbi
                       (sum + 4 coniugazioni + mista, presente/imperfetto/futuro);
                       modalità "Nascondi" per indovinare le desinenze
  • Complementi     -> l'analisi logica: ogni complemento -> quale caso latino
  • Preposizioni    -> quali reggono accusativo e quali ablativo
  • Traduci passo passo -> frasi spiegate parola per parola, poi si sceglie
                       la traduzione giusta (niente da scrivere)
  • Lessico         -> ~65 parole a flashcard, con i derivati italiani,
                       con ripasso che ripropone le parole meno sapute
  • Allenati        -> esercizi a scelta (funzione, caso, verbi, lessico...)
  • I tuoi progressi-> quanto si è imparato finora
  • Per chi ti aiuta-> guida per mamma/papà o tutor

ACCESSIBILITA' (tasto "Aa Impostazioni")
----------------------------------------
Testo più grande, righe/lettere/parole più ariose, carattere più leggibile,
sfondo crema/chiaro/scuro, righello di lettura, "nascondi punteggio"
(toglie i voti, lascia gli incoraggiamenti). Dove c'è 🔊 il testo si ascolta.
Le scelte restano salvate sul dispositivo.

COME APRIRLA (modo semplice)
----------------------------
Doppio clic su "index.html": si apre nel browser e funziona tutto.

METTERLA SUL TELEFONO (come un'app, anche offline)
--------------------------------------------------
Le funzioni "installa" e "offline" richiedono che il sito sia servito via
http/https (non basta il doppio clic). Due strade:

A) In rete locale (PC e telefono sulla stessa Wi-Fi):
   - apri PowerShell DENTRO questa cartella ed esegui:
       python -m http.server 8080
   - sul telefono apri:  http://INDIRIZZO-IP-DEL-PC:8080
     (l'IP si trova con "ipconfig" -> "Indirizzo IPv4")
   - dal menu del browser: "Aggiungi a schermata Home".

B) Online gratis: carica questa cartella su Netlify / GitHub Pages /
   Cloudflare Pages e apri il link dal telefono -> "Aggiungi a schermata Home".

FILE
----
  index.html            -> la pagina e la struttura
  style.css             -> l'aspetto (colori, accessibilità)
  data.js               -> i contenuti (casi, tabelle, lessico, frasi, esercizi)
  app.js                -> la logica (navigazione, esercizi, impostazioni)
  manifest.webmanifest  -> dati per l'installazione su Home
  sw.js                 -> funzionamento offline (network-first)
  icon.svg              -> icona dell'app
  README.txt            -> questo file

Per modificare i contenuti (aggiungere parole, frasi o esercizi) basta
ritoccare "data.js".

NOTA
----
Progetto separato dal sito "Letterbox": non lo tocca in alcun modo.
