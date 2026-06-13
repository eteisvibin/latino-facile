# Latino facile 🏛️

Web-app per studiare il **latino del biennio** (allineata al manuale *«Semper. Il latino nel tempo»*, D'Anna), pensata per studenti con **dislessia e disgrafia**: si impara **toccando**, con i **colori**, **ascoltando** (sintesi vocale a pronuncia **classica**) e **senza dover scrivere**.

🔗 **Online:** https://eteisvibin.github.io/latino-facile/

## Sezioni
- 🎨 **Capire i casi** — a che serve ogni caso, con un colore per ognuno
- 📋 **Le tabelle** — tutte le 5 declinazioni, aggettivi, pronomi e verbi (*sum* + 4 coniugazioni + mista, presente/imperfetto/futuro), con modalità "Nascondi" per indovinare le desinenze
- 🔗 **Complementi** — l'analisi logica: ogni complemento → quale caso latino
- 🧱 **Preposizioni** — quali reggono accusativo e quali ablativo
- 🧩 **Traduci passo passo** — frasi pronte spiegate parola per parola (con la voce), poi si sceglie la traduzione
- 🦉 **Tutor AI** — traduce *qualsiasi* versione o parola e spiega passo passo, con resa **letterale ↔ scorrevole**, e fa anche **italiano→latino**. Da attivare una volta (chiave AI + “ponte” gratuito): vedi **[SETUP-TUTOR.md](SETUP-TUTOR.md)**. Senza attivazione, tutto il resto dell'app funziona lo stesso.
- 🔤 **Lessico** — ~65 parole a flashcard con i derivati italiani e ripasso che ripropone quelle meno sapute
- 🎯 **Allenati** — esercizi a scelta (niente da scrivere), feedback gentile
- 🍅 **Timer Pomodoro** — 25/5, 50/10 o personalizzato
- 🌱 **Progressi e traguardi**

## Accessibilità (DSA)
Testo, interlinea e spaziatura regolabili; carattere più leggibile; temi crema/chiaro/scuro; righello di lettura; **nascondi punteggio**; **nome** e **colore** personalizzabili; sintesi vocale dove c'è 🔊. Scelte e progressi salvati **solo sul dispositivo**.

## Tecnica
Sito statico, nessun build: `index.html`, `style.css`, `data.js`, `app.js` + PWA (`manifest.webmanifest`, `sw.js`, `icon.svg`). Funziona anche offline e si può "Aggiungere a schermata Home". Per modificare i contenuti (parole, frasi, esercizi) basta `data.js`.

Fatto con affetto, per studiare il latino senza ansia. 💛
