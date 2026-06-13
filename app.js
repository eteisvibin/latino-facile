"use strict";
/* =========================================================
   Latino facile — LOGICA
   ========================================================= */
const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];
const stripTag = (html) => { const d=document.createElement("div"); d.innerHTML=html; return d.textContent||""; };
const mischia = (arr) => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const clamp = (v,[mn,mx]) => Math.min(mx, Math.max(mn, v));
const round2 = (v) => Math.round(v*100)/100;
const due = (n) => String(n).padStart(2,"0");
const ymd = (d) => d.getFullYear()+"-"+due(d.getMonth()+1)+"-"+due(d.getDate());

/* ---------- IMPOSTAZIONI ---------- */
const DEFAULT = { fs:18, lh:1.7, ls:0.03, ws:0.08, font:"standard", theme:"crema", ruler:false, hidePunti:false, nome:"", accent:"blu" };
const LIMITI = { fs:[16,30], lh:[1.3,2.4], ls:[0,0.14], ws:[0,0.30] };
const ACCENTI = { blu:["#3b6ea5","#e7eef6"], viola:["#6d4ca8","#ece4f7"], rosa:["#c2487f","#fbe6f0"], verde:["#2f7d52","#e3f3e9"], turchese:["#17807b","#dcf1f0"], arancio:["#c4651a","#fbe9d8"] };
let S = caricaImp();
function caricaImp(){ try{ return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem("latino-impostazioni")||"{}")); }catch(e){ return Object.assign({}, DEFAULT); } }
function salvaImp(){ try{ localStorage.setItem("latino-impostazioni", JSON.stringify(S)); }catch(e){} }

function applica(){
  const r = document.documentElement;
  r.style.setProperty("--fs", S.fs+"px");
  r.style.setProperty("--lh", S.lh);
  r.style.setProperty("--ls", S.ls+"em");
  r.style.setProperty("--ws", S.ws+"em");
  const ac = ACCENTI[S.accent] || ACCENTI.blu;
  r.style.setProperty("--accent", ac[0]);
  r.style.setProperty("--accent-soft", ac[1]);
  r.setAttribute("data-font", S.font);
  r.setAttribute("data-theme", S.theme);
  document.body.classList.toggle("ruler-on", !!S.ruler);
  document.body.classList.toggle("nascondi-punti", !!S.hidePunti);
  const set=(id,v)=>{ const o=qs(id); if(o) o.textContent=v; };
  set("#outFs", S.fs+"px"); set("#outLh", S.lh.toFixed(1));
  set("#outLs", Math.round(S.ls*100)+"%"); set("#outWs", Math.round(S.ws*100)+"%");
  qsa("#fontChoices .btn").forEach(b=>b.classList.toggle("sel", b.dataset.font===S.font));
  qsa("#themeChoices .btn").forEach(b=>b.classList.toggle("sel", b.dataset.theme===S.theme));
  qsa("#accentChoices .sw").forEach(b=>b.classList.toggle("sel", b.dataset.accent===S.accent));
  const rs=qs("#rulerSwitch"); if(rs) rs.checked=!!S.ruler;
  const ps=qs("#puntiSwitch"); if(ps) ps.checked=!!S.hidePunti;
  const ni=qs("#nomeInput"); if(ni && ni.value!==S.nome) ni.value=S.nome;
  const tu=qs("#tutorUrl"); if(tu && tu.value!==TUT.url) tu.value=TUT.url;
  const tc=qs("#tutorCode"); if(tc && tc.value!==TUT.code) tc.value=TUT.code;
  const mc=qs('meta[name="theme-color"]'); if(mc) mc.setAttribute("content", S.theme==="scuro"?"#1e1c18":ac[0]);
  aggiornaSaluto();
}

/* ---------- PROGRESSI ---------- */
let P = caricaProg();
function caricaProg(){ try{ return Object.assign({ quizMax:0, quizFatti:0, traduci:0, pomodori:0, lessico:{}, streak:0, ultimoGiorno:"", ach:[] }, JSON.parse(localStorage.getItem("latino-progresso")||"{}")); }catch(e){ return { quizMax:0, quizFatti:0, traduci:0, pomodori:0, lessico:{}, streak:0, ultimoGiorno:"", ach:[] }; } }
function salvaProg(){ try{ localStorage.setItem("latino-progresso", JSON.stringify(P)); }catch(e){} }

/* ---------- TRAGUARDI ---------- */
const ACH = [
  { id:"inizio", e:"🌟", t:"Si comincia!", cond:()=>true },
  { id:"traduci1", e:"🧩", t:"Prima traduzione", cond:()=>P.traduci>=1 },
  { id:"parole10", e:"🔤", t:"10 parole imparate", cond:()=>Object.values(P.lessico).filter(b=>b>=4).length>=10 },
  { id:"quizTop", e:"🎯", t:"Esercizi tutti giusti", cond:()=>P.quizMax>=DOMANDE.length },
  { id:"pomo1", e:"🍅", t:"Primo pomodoro", cond:()=>P.pomodori>=1 },
  { id:"streak3", e:"🔥", t:"3 giorni di fila", cond:()=>P.streak>=3 }
];
function checkAch(){ let nuovo=false; ACH.forEach(a=>{ if(a.cond() && !P.ach.includes(a.id)){ P.ach.push(a.id); nuovo=true; } }); if(nuovo) salvaProg(); }

/* ---------- STREAK (giorni di fila) ---------- */
function aggiornaStreak(){
  const oggi = ymd(new Date());
  if(P.ultimoGiorno === oggi) return;
  const ieri = ymd(new Date(Date.now()-86400000));
  P.streak = (P.ultimoGiorno === ieri) ? (P.streak+1) : 1;
  P.ultimoGiorno = oggi; salvaProg();
}

/* ---------- NAVIGAZIONE ---------- */
function vai(id){
  qsa(".view").forEach(v=>v.classList.toggle("active", v.id===id));
  qsa("nav.tabbar button").forEach(b=>b.classList.toggle("attivo", b.dataset.go===id));
  window.scrollTo({top:0, behavior:"smooth"});
  if(id==="allenati") avviaQuiz();
  if(id==="traduci") avviaTraduci();
  if(id==="lessico") avviaLessico();
  if(id==="tutor") renderTutor();
  if(id==="progressi") renderProgressi();
}

/* ---------- SINTESI VOCALE ---------- */
function vociPronte(){ return ("speechSynthesis" in window); }
function parla(testo){ // italiano
  if(!vociPronte() || !testo) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(testo); u.lang="it-IT"; u.rate=0.95;
  window.speechSynthesis.speak(u);
}
/* trasforma il latino in una grafia che una voce italiana legge ~ alla classica */
function latClassica(s){
  let t = s.toLowerCase();
  t = t.replace(/ch/g,"c").replace(/ph/g,"f").replace(/th/g,"t").replace(/rh/g,"r");
  t = t.replace(/ae/g,"ai").replace(/oe/g,"oi");
  t = t.replace(/c(?=[eiy])/g,"ch");   // c sempre dura (k)
  t = t.replace(/g(?=[eiy])/g,"gh");   // g sempre dura
  t = t.replace(/v/g,"u");             // v = /w/, reso con u
  t = t.replace(/y/g,"i").replace(/x/g,"cs");
  return t;
}
function parlaLa(testo){ // latino, pronuncia classica approssimata
  if(!vociPronte() || !testo) return;
  window.speechSynthesis.cancel();
  const pulito = testo.replace(/[«».,!?;:]/g," ");
  const u = new SpeechSynthesisUtterance(latClassica(pulito)); u.lang="it-IT"; u.rate=0.85;
  window.speechSynthesis.speak(u);
}

/* ---------- SALUTO / FRASE DEL GIORNO ---------- */
function aggiornaSaluto(){
  const el = qs("#saluto"); if(!el) return;
  el.textContent = "Ciao" + (S.nome ? " "+S.nome : "") + "! 👋 Impariamo il latino con calma.";
}
function renderExtraHome(){
  // frase del giorno
  const fr = qs("#fraseRoot");
  if(fr){
    const idx = Math.floor(Date.now()/86400000) % PROVERBI.length;
    const p = PROVERBI[idx];
    fr.innerHTML = '<div class="card frase"><div class="frase-tit">✨ Frase del giorno <button class="speak" id="fraseSay" title="Ascolta">🔊</button></div>'+
      '<div class="frase-la">«'+p.la+'»</div><div class="frase-it">'+p.it+'</div></div>';
    qs("#fraseSay").addEventListener("click", ()=>parlaLa(p.la));
  }
  // streak
  const st = qs("#streakRoot");
  if(st){
    st.innerHTML = P.streak>=2 ? '<div class="streak">🔥 '+P.streak+' giorni di fila! Continua così.</div>' :
                                 '<div class="streak">🌱 Bentornata! Studiamo un pochino oggi.</div>';
  }
}

/* ---------- CASI ---------- */
function renderCasi(){
  const box = qs("#casiRoot");
  let html = '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<div class="card"><h2 class="section-title">🎨 Capire i casi <button class="speak" data-say="introCasi" title="Ascolta">🔊</button></h2>'+
    '<p id="introCasi">In italiano conta l\'ordine delle parole: «il cane morde Marco» è diverso da «Marco morde il cane». In latino conta la <b>fine della parola</b> (la desinenza): è lei a dire se una parola è soggetto, oggetto, di chi è qualcosa… Questi ruoli si chiamano <b>casi</b>. Ogni caso qui ha sempre lo <b>stesso colore</b>.</p></div>';
  CASI.forEach(c=>{
    html += '<div class="card caso '+c.id+'"><h3 class="section-title"><span class="chip '+c.id+'"><span class="dot"></span>'+c.nome+'</span>'+
      '<button class="speak" data-say="say-'+c.id+'" title="Ascolta">🔊</button></h3>'+
      '<p class="domanda">Domanda: '+c.domanda+'</p><p id="say-'+c.id+'">'+c.funzione+'</p>'+
      '<div class="esempio">'+c.esempio+'<br><span class="nota">'+c.ruolo+'</span></div></div>';
  });
  box.innerHTML = html;
}

/* ---------- TABELLE ---------- */
let tabAttiva = "d1";
function tutteLeTab(){ const o=[]; TABELLE.forEach(c=>c.tab.forEach(t=>o.push(t))); return o; }
function renderTabelleShell(){
  const box = qs("#tabelleRoot");
  let scelte = "";
  TABELLE.forEach(cat=>{
    scelte += '<div class="cat-label">'+cat.cat+'</div><div class="scelte">';
    cat.tab.forEach(t=>{ scelte += '<button class="btn small tabbtn" data-tab="'+t.id+'">'+t.titolo+'</button>'; });
    scelte += '</div>';
  });
  box.innerHTML =
    '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<div class="card"><h2>📋 Le tabelle</h2>'+
    '<p class="lead">Le desinenze hanno il colore del loro caso. Quando te la senti, attiva <b>“Nascondi”</b> e tocca le caselle per indovinarle.</p>'+
    '<div class="tab-strumenti"><div class="toggle"><label for="nascondiSwitch"><b>Nascondi</b> (studio)</label>'+
    '<span class="switch"><input type="checkbox" id="nascondiSwitch"><span class="track"></span></span></div></div>'+
    scelte + '</div><div id="tabBox" class="card"></div>';
  qs("#nascondiSwitch").addEventListener("change", e=>{
    document.body.classList.toggle("nascondi", e.target.checked);
    if(!e.target.checked) qsa(".hidey.svelata").forEach(d=>d.classList.remove("svelata"));
  });
  renderTab();
}
function renderTab(){
  qsa(".tabbtn").forEach(b=>b.classList.toggle("sel", b.dataset.tab===tabAttiva));
  const t = tutteLeTab().find(x=>x.id===tabAttiva);
  const box = qs("#tabBox");
  if(t.tipo==="nome") box.innerHTML = htmlNome(t);
  else if(t.tipo==="grid") box.innerHTML = htmlGrid(t);
  else box.innerHTML = htmlVerbo(t);
}
function htmlNome(d){
  let r = '<div class="tabella-wrap"><table class="tb"><caption>'+d.titolo+'</caption>'+
    '<thead><tr><th>Caso</th><th>Singolare</th><th>Plurale</th></tr></thead><tbody>';
  ORDINE.forEach(c=>{
    const s = d.radice+'<span class="des '+c+' hidey">'+d.des[c][0]+'</span>';
    const p = d.radice+'<span class="des '+c+' hidey">'+d.des[c][1]+'</span>';
    r += '<tr><td><span class="chip '+c+'"><span class="dot"></span>'+NOMECASO[c]+'</span></td>'+
         '<td class="forma">'+s+'</td><td class="forma">'+p+'</td></tr>';
  });
  r += '</tbody></table></div><p class="lead" style="margin:.6rem 0 0">'+d.sub+'</p><p class="nota">💡 '+d.nota+'</p>';
  return r;
}
function htmlGrid(d){
  let r = '<div class="tabella-wrap">';
  d.blocchi.forEach(b=>{
    r += '<table class="tb"><caption>'+d.titolo+(b.nome?' · '+b.nome:'')+'</caption><thead><tr><th>Caso</th>';
    d.col.forEach(c=> r += '<th>'+c+'</th>');
    r += '</tr></thead><tbody>';
    b.righe.forEach(rg=>{
      r += '<tr><td><span class="chip '+rg.caso+'"><span class="dot"></span>'+NOMECASO[rg.caso]+'</span></td>';
      rg.f.forEach(f=> r += '<td class="forma"><span class="hidey">'+f+'</span></td>');
      r += '</tr>';
    });
    r += '</tbody></table>';
  });
  r += '</div><p class="lead" style="margin:.6rem 0 0">'+d.sub+'</p><p class="nota">💡 '+d.nota+'</p>';
  return r;
}
function htmlVerbo(d){
  let r = '<div class="tabella-wrap"><table class="tb"><caption>'+d.titolo+'</caption><thead><tr><th>Persona</th>';
  d.tempi.forEach(t=> r += '<th>'+t.nome+'</th>');
  r += '</tr></thead><tbody>';
  d.persone.forEach((pers,i)=>{
    r += '<tr><td>'+pers+'</td>';
    d.tempi.forEach(t=> r += '<td class="forma"><span class="hidey">'+t.f[i]+'</span></td>');
    r += '</tr>';
  });
  r += '</tbody></table></div><p class="lead" style="margin:.6rem 0 0">'+d.sub+'</p><p class="nota">💡 '+d.extra+'</p>';
  return r;
}

/* ---------- COMPLEMENTI ---------- */
function renderComplementi(){
  const box = qs("#complementiRoot");
  let html = '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<div class="card"><h2 class="section-title">🔗 Complementi (analisi logica) <button class="speak" data-say="introComp" title="Ascolta">🔊</button></h2>'+
    '<p id="introComp" class="lead">È il ponte tra l\'italiano e il latino: riconosci che cos\'è una parola nella frase (soggetto, oggetto, a chi, di chi…) e sai subito in che caso va. Il colore è quello del caso.</p>'+
    '<div class="comp">';
  COMPLEMENTI.forEach(c=>{
    html += '<div class="riga '+c.caso+'"><div class="nm"><span class="chip '+c.caso+'"><span class="dot"></span>'+NOMECASO[c.caso]+'</span> '+c.nome+'</div>'+
      '<div class="cm">→ '+c.come+'</div><div>'+c.es+'</div></div>';
  });
  html += '</div></div>';
  box.innerHTML = html;
}

/* ---------- PREPOSIZIONI ---------- */
function renderPreposizioni(){
  const box = qs("#preposizioniRoot");
  const badge = (c)=> c==="acc" ? '<span class="badge acc">+ accusativo</span>' : c==="abl" ? '<span class="badge abl">+ ablativo</span>' : '<span class="badge due">+ acc. / + abl.</span>';
  let html = '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<div class="card"><h2>🧱 Preposizioni</h2>'+
    '<p class="lead">Ogni preposizione “chiede” un caso preciso. Impararle toglie tantissimi dubbi in traduzione.</p>'+
    '<div class="prep">';
  PREPOSIZIONI.forEach(p=>{ html += '<div class="r"><span class="pl">'+p.p+'</span>'+badge(p.caso)+'<span class="cm">'+p.sig+'</span></div>'; });
  html += '</div></div>';
  box.innerHTML = html;
}

/* ---------- ESERCIZI ---------- */
let ordineD=[], iD=0, giuste=0, risposto=false;
function avviaQuiz(){ ordineD = mischia(DOMANDE.map((_,i)=>i)); iD=0; giuste=0; mostraDomanda(); }
function mostraDomanda(){
  const area = qs("#quizArea");
  if(iD>=ordineD.length) return mostraFine();
  const d = DOMANDE[ordineD[iD]];
  const idxMix = mischia(d.opz.map((_,i)=>i));
  const opzMix = idxMix.map(i=>d.opz[i]);
  const giustaMix = idxMix.indexOf(d.giusta);
  risposto=false;
  area.innerHTML =
    '<div class="quiz-top"><button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<span class="nota">Domanda '+(iD+1)+' di '+ordineD.length+'</span></div>'+
    '<div class="progress"><i style="width:'+(iD/ordineD.length*100)+'%"></i></div>'+
    '<div class="card" style="margin:.9rem 0 0"><div class="domanda-box">'+d.q+' <button class="speak" data-say="qz" title="Ascolta">🔊</button></div>'+
    '<div class="opzioni"></div><div class="feedback" id="fb"></div>'+
    '<div style="margin-top:1rem;text-align:right"><button class="btn primary" id="avanti" style="display:none">Avanti →</button></div></div>';
  const opBox = qs(".opzioni", area);
  opzMix.forEach((testo,i)=>{
    const b=document.createElement("button");
    b.className="opt"; b.innerHTML='<b>'+String.fromCharCode(65+i)+'.</b> <span>'+testo+'</span>';
    b.addEventListener("click", ()=>rispondi(b,i,giustaMix,d,opBox));
    opBox.appendChild(b);
  });
  qs('[data-say="qz"]',area).addEventListener("click", ()=>parla(stripTag(d.q)));
  qs("#avanti",area).addEventListener("click", ()=>{ iD++; mostraDomanda(); });
}
function rispondi(btn, scelta, giustaMix, d, opBox){
  if(risposto) return; risposto=true;
  qsa(".opt", opBox).forEach((b,i)=>{ b.disabled=true; if(i===giustaMix) b.classList.add("giusta"); });
  const fb = qs("#fb");
  if(scelta===giustaMix){ giuste++; fb.className="feedback show ok"; fb.innerHTML='<div class="titolo">✅ Bravissima!</div><div>'+d.sp+'</div>'; }
  else{ btn.classList.add("sbagliata"); fb.className="feedback show no"; fb.innerHTML='<div class="titolo">Quasi! Guarda qui 👇</div><div>'+d.sp+'</div>'; }
  qs("#avanti").style.display="inline-flex";
  qs(".progress > i").style.width = ((iD+1)/ordineD.length*100)+"%";
}
function mostraFine(){
  const area = qs("#quizArea");
  const tot = ordineD.length;
  P.quizFatti++; if(giuste>P.quizMax) P.quizMax=giuste; salvaProg(); checkAch();
  let msg = giuste===tot ? "Perfetto, tutte giuste! 🌟" : giuste>=tot*0.6 ? "Ottimo lavoro, stai migliorando! 💪" : "Bravissima ad aver provato. Si impara così. 🌱";
  const punteggio = S.hidePunti ? '<div class="punteggio">🌟</div>' : '<div class="punteggio">'+giuste+' / '+tot+'</div>';
  area.innerHTML = '<div class="fine">'+punteggio+'<p>'+msg+'</p>'+
    '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:1rem">'+
    '<button class="btn primary" id="ancora">↻ Riprova</button><button class="btn" data-go="home">🏠 Inizio</button></div></div>';
  qs("#ancora").addEventListener("click", avviaQuiz);
}

/* ---------- TRADUZIONE GUIDATA ---------- */
let iT=0, traRisposto=false;
function avviaTraduci(){ iT=0; mostraTraduci(); }
function mostraTraduci(){
  const box = qs("#traduciRoot");
  if(iT>=TRADUZIONI.length) return fineTraduci();
  const t = TRADUZIONI[iT]; traRisposto=false;
  let frase = '<div class="frase-parole">';
  t.token.forEach((tk,i)=> frase += '<button class="parola'+(tk.caso?' '+tk.caso:'')+'" data-i="'+i+'">'+tk.w+'</button>');
  frase += '</div>';
  const idxMix = mischia([t.sol, ...t.alt].map((x,i)=>i));
  const opzioni = [t.sol, ...t.alt];
  box.innerHTML =
    '<div class="quiz-top"><button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<span class="nota">Frase '+(iT+1)+' di '+TRADUZIONI.length+'</span></div>'+
    '<div class="card"><h3 class="section-title">🧩 Tocca ogni parola per capirla <button class="speak" data-say="fr" title="Ascolta tutta la frase">🔊</button></h3>'+
    frase + '<div class="analisi" id="analisi">👆 Tocca una parola: la senti e ne vedi caso e significato.</div>'+
    '<p class="lead">Ora qual è la traduzione giusta?</p><div class="opzioni" id="traOpz"></div>'+
    '<div class="feedback" id="traFb"></div>'+
    '<div style="margin-top:1rem;text-align:right"><button class="btn primary" id="traAvanti" style="display:none">Avanti →</button></div></div>';
  qsa(".parola", box).forEach(p=>{
    p.addEventListener("click", ()=>{
      qsa(".parola",box).forEach(x=>x.classList.remove("attiva")); p.classList.add("attiva");
      const tk = t.token[+p.dataset.i];
      qs("#analisi").innerHTML = '<span class="w">'+tk.w+'</span> — '+tk.a+'<br>significa: <b>'+tk.it+'</b>';
      parlaLa(tk.w);
    });
  });
  const opz = qs("#traOpz");
  idxMix.forEach((oi,i)=>{
    const b=document.createElement("button"); b.className="opt"; b.innerHTML='<b>'+String.fromCharCode(65+i)+'.</b> <span>'+opzioni[oi]+'</span>';
    b.addEventListener("click", ()=>rispondiTra(b, oi===0, opz));
    opz.appendChild(b);
  });
  qs('[data-say="fr"]',box).addEventListener("click", ()=>parlaLa(t.lat.join(" ")));
  qs("#traAvanti",box).addEventListener("click", ()=>{ iT++; mostraTraduci(); });
}
function rispondiTra(btn, giusta, opz){
  if(traRisposto) return; traRisposto=true;
  const t = TRADUZIONI[iT];
  qsa(".opt",opz).forEach(b=>{ b.disabled=true; if(b.querySelector("span").textContent===t.sol) b.classList.add("giusta"); });
  const fb = qs("#traFb");
  if(giusta){ fb.className="feedback show ok"; fb.innerHTML='<div class="titolo">✅ Esatto!</div><div>Hai messo insieme i pezzi alla perfezione.</div>'; }
  else{ btn.classList.add("sbagliata"); fb.className="feedback show no"; fb.innerHTML='<div class="titolo">Riguarda le desinenze 👀</div><div>La traduzione giusta è in verde. Controlla soggetto (chi fa) e oggetto (chi subisce).</div>'; }
  qs("#traAvanti").style.display="inline-flex";
}
function fineTraduci(){
  const box = qs("#traduciRoot");
  P.traduci++; salvaProg(); checkAch();
  box.innerHTML = '<div class="card fine"><div class="punteggio">🧩</div><p>Hai finito le frasi! Più le analizzi parola per parola, più diventa facile. 🌱</p>'+
    '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:1rem"><button class="btn primary" id="traAncora">↻ Da capo</button><button class="btn" data-go="home">🏠 Inizio</button></div></div>';
  qs("#traAncora").addEventListener("click", avviaTraduci);
}

/* ---------- LESSICO (flashcard) ---------- */
let mazzo=[], iL=0, saputeSessione=0;
function tutteLeParole(){ const o=[]; LESSICO.forEach(g=>g.parole.forEach(p=>o.push(Object.assign({gruppo:g.gruppo}, p)))); return o; }
function avviaLessico(){
  const tutte = tutteLeParole();
  tutte.sort((a,b)=> (P.lessico[a.lat]||0) - (P.lessico[b.lat]||0));
  mazzo = tutte; iL=0; saputeSessione=0; mostraCard();
}
function mostraCard(){
  const box = qs("#lessicoRoot");
  if(iL>=mazzo.length) return fineLessico();
  const c = mazzo[iL]; const box5 = P.lessico[c.lat]||0;
  box.innerHTML =
    '<div class="quiz-top"><button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<span class="nota">Scheda '+(iL+1)+' di '+mazzo.length+' · '+c.gruppo+'</span></div>'+
    '<div class="flash" id="flash"><div class="flash-inner">'+
      '<div class="flash-face"><div class="lat">'+c.lat+'</div><button class="speak" id="sayLat" title="Ascolta">🔊 ascolta</button><div class="flash-hint">tocca per girare</div></div>'+
      '<div class="flash-face retro"><div class="it">'+c.it+'</div>'+(c.der?'<div class="der">→ in italiano: '+c.der+'</div>':'')+'<div class="flash-hint">tocca per girare</div></div>'+
    '</div></div>'+
    (box5>=4?'<p class="nota center">⭐ già imparata bene</p>':'')+
    '<div class="lessico-azioni"><button class="btn" id="nonAncora">Non ancora 🤔</button><button class="btn primary" id="laSo">La so! ✅</button></div>'+
    '<p class="nota center">Gira la scheda, poi di\' se la sapevi.</p>';
  const flash = qs("#flash");
  flash.addEventListener("click", e=>{ if(e.target.closest("#sayLat")) return; flash.classList.toggle("flip"); });
  qs("#sayLat").addEventListener("click", ()=>parlaLa(c.lat.split(",")[0]));
  qs("#laSo").addEventListener("click", ()=>{ P.lessico[c.lat]=Math.min(5,(P.lessico[c.lat]||0)+1); saputeSessione++; salvaProg(); checkAch(); iL++; mostraCard(); });
  qs("#nonAncora").addEventListener("click", ()=>{ P.lessico[c.lat]=1; salvaProg(); iL++; mostraCard(); });
}
function fineLessico(){
  const box = qs("#lessicoRoot");
  box.innerHTML = '<div class="card fine"><div class="punteggio">🔤</div><p>Giro finito! Sapevi <b>'+saputeSessione+'</b> parole su '+mazzo.length+'. Le altre torneranno: si impara ripassando un po\' ogni giorno. 🌱</p>'+
    '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:1rem"><button class="btn primary" id="lesAncora">↻ Nuovo giro</button><button class="btn" data-go="home">🏠 Inizio</button></div></div>';
  qs("#lesAncora").addEventListener("click", avviaLessico);
}

/* ---------- PROGRESSI ---------- */
function renderProgressi(){
  const box = qs("#progressiRoot");
  const totParole = tutteLeParole().length;
  const imparate = Object.values(P.lessico).filter(b=>b>=4).length;
  const pct = totParole ? Math.round(imparate/totParole*100) : 0;
  const numQuiz = S.hidePunti ? "🌟" : (P.quizMax+" / "+DOMANDE.length);
  let stick = '<div class="stickers">';
  ACH.forEach(a=>{ const ok=P.ach.includes(a.id); stick += '<div class="sticker'+(ok?' on':'')+'"><div class="se">'+a.e+'</div><div class="st">'+a.t+'</div></div>'; });
  stick += '</div>';
  box.innerHTML = '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<div class="card"><h2>🌱 I tuoi progressi</h2>'+
    '<p class="lead">Piccoli passi, ogni giorno. Niente voti: solo quanto stai crescendo.</p>'+
    '<div style="margin:1rem 0"><div class="stat"><b>Parole imparate</b><span>'+imparate+' / '+totParole+'</span></div><div class="barra"><i style="width:'+pct+'%"></i></div></div>'+
    '<div class="stat" style="margin:.8rem 0"><b>🔥 Giorni di fila</b><span>'+P.streak+'</span></div>'+
    '<div class="stat" style="margin:.8rem 0"><b>Miglior risultato esercizi</b><span>'+numQuiz+'</span></div>'+
    '<div class="stat" style="margin:.8rem 0"><b>🍅 Pomodori completati</b><span>'+P.pomodori+'</span></div>'+
    '<div class="stat" style="margin:.8rem 0"><b>🧩 Giri di traduzione</b><span>'+P.traduci+'</span></div>'+
    '</div><div class="card"><h3>🏅 I tuoi traguardi</h3>'+stick+'</div>';
}

/* ---------- TUTOR AI ---------- */
let TUT = caricaTut();
function caricaTut(){ try{ return Object.assign({url:"",code:""}, JSON.parse(localStorage.getItem("latino-tutor")||"{}")); }catch(e){ return {url:"",code:""}; } }
function salvaTut(){ try{ localStorage.setItem("latino-tutor", JSON.stringify(TUT)); }catch(e){} }
function esc(s){ return (s||"").toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function escAttr(s){ return esc(s).replace(/"/g,"&quot;"); }
let tutMode = "passopasso";

function renderTutor(){
  const box = qs("#tutorRoot");
  if(!TUT.url){
    box.innerHTML = '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
      '<div class="card"><h2>🦉 Tutor di latino</h2>'+
      '<p class="lead">Il Tutor traduce <b>qualsiasi</b> versione o parola e spiega passo passo (anche italiano → latino). Va attivato una volta sola.</p>'+
      '<div class="setup"><b>Per accenderlo:</b><ol><li>Apri il file <b>SETUP-TUTOR.md</b> nella cartella e segui i 3 passaggi (una chiave AI + un “ponte” gratuito).</li>'+
      '<li>Poi qui in <b>Aa Impostazioni → 🦉 Tutor AI</b> incolla l\'indirizzo del ponte.</li></ol></div>'+
      '<button class="btn primary" id="vaiSet">⚙️ Apri Impostazioni</button></div>';
    qs("#vaiSet").addEventListener("click", ()=>apriSet(true));
    return;
  }
  box.innerHTML =
    '<button class="btn ghost small back" data-go="home">← Inizio</button>'+
    '<div class="card"><h2 class="section-title">🦉 Tutor di latino</h2>'+
    '<p class="lead">Incolla una versione (o una frase) e scegli come tradurla.</p>'+
    '<div class="scelte" id="tutModi">'+
      '<button class="btn small tutmodo" data-m="passopasso">📚 Passo passo</button>'+
      '<button class="btn small tutmodo" data-m="diretta">⚡ Diretta</button>'+
      '<button class="btn small tutmodo" data-m="italatino">🔄 Italiano → Latino</button></div>'+
    '<textarea id="tutText" class="tut-text" rows="5"></textarea>'+
    '<div style="text-align:right;margin-top:.6rem"><button class="btn primary" id="tutGo">Traduci 🦉</button></div>'+
    '<div id="tutOut"></div></div>'+
    '<div class="card"><h3 class="section-title">🔎 Cerca una parola o una frase</h3>'+
    '<div style="display:flex;gap:.5rem;flex-wrap:wrap"><input type="text" id="tutCerca" class="nome-input" style="flex:1;min-width:58%" placeholder="es. «puellam» oppure «rosa»">'+
    '<button class="btn" id="tutCercaGo">Cerca</button></div><div id="tutCercaOut"></div></div>';
  qsa(".tutmodo").forEach(b=>{ b.classList.toggle("sel", b.dataset.m===tutMode);
    b.addEventListener("click", ()=>{ tutMode=b.dataset.m; qsa(".tutmodo").forEach(x=>x.classList.toggle("sel", x===b)); aggiornaPlaceholder(); }); });
  aggiornaPlaceholder();
  qs("#tutGo").addEventListener("click", ()=>tutorChiamata(tutMode, qs("#tutText").value, qs("#tutOut")));
  qs("#tutCercaGo").addEventListener("click", ()=>tutorChiamata("parola", qs("#tutCerca").value, qs("#tutCercaOut")));
  qs("#tutCerca").addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); tutorChiamata("parola", qs("#tutCerca").value, qs("#tutCercaOut")); } });
}
function aggiornaPlaceholder(){ const t=qs("#tutText"); if(t) t.placeholder = tutMode==="italatino" ? "Scrivi qui la frase in italiano…" : "Incolla qui la versione di latino…"; }
async function tutorChiamata(mode, text, outEl){
  text=(text||"").trim();
  if(!text){ outEl.innerHTML='<p class="nota">Scrivi prima qualcosa. ✍️</p>'; return; }
  outEl.innerHTML='<div class="tut-load">🦉 Sto pensando…</div>';
  try{
    const headers={"Content-Type":"application/json"};
    if(TUT.code) headers["x-access-code"]=TUT.code;
    const r=await fetch(TUT.url,{method:"POST",headers,body:JSON.stringify({mode,text})});
    let data={}; try{ data=await r.json(); }catch(e){}
    if(!r.ok || data.error){ outEl.innerHTML='<div class="feedback show no"><div class="titolo">Ops…</div><div>'+esc(data.error||("Errore "+r.status))+'</div></div>'; return; }
    let res=null; try{ res=JSON.parse(data.risultato); }catch(e){}
    outEl.innerHTML = res ? renderRisultato(mode,res) : '<div class="tut-res">'+esc(data.risultato||"")+'</div>';
  }catch(e){
    outEl.innerHTML='<div class="feedback show no"><div class="titolo">Connessione assente</div><div>Controlla l\'indirizzo del ponte (Impostazioni) e la connessione a internet.</div></div>';
  }
}
function renderRisultato(mode,r){
  if(mode==="italatino"){
    return '<div class="tut-res"><div class="tut-lat">'+esc(r.latino)+' <button class="speak" data-t="'+escAttr(r.latino)+'" title="Ascolta">🔊</button></div>'+
      (r.spiegazione?'<p class="nota">💡 '+esc(r.spiegazione)+'</p>':'')+'</div>';
  }
  if(mode==="parola"){
    return '<div class="tut-res"><div class="tut-voce">'+esc(r.voce)+' <button class="speak" data-t="'+escAttr(r.voce)+'" title="Ascolta">🔊</button></div>'+
      '<p><b>Che cos\'è:</b> '+esc(r.analisi)+'</p><p><b>Significa:</b> '+esc(r.significato)+'</p>'+
      (r.esempio?'<p class="nota">Esempio: '+esc(r.esempio)+'</p>':'')+'</div>';
  }
  let h='<div class="tut-res">';
  if(mode==="passopasso" && r.passi && r.passi.length){
    h+='<div class="passi">';
    r.passi.forEach(p=>{ h+='<div class="passo"><div class="passo-lat">'+esc(p.lat)+'</div><div class="passo-an">'+esc(p.analisi)+'</div><div class="passo-it">→ '+esc(p.it)+'</div></div>'; });
    h+='</div>';
  }
  h+='<div class="due-trad"><div class="trad-box"><div class="trad-tit">📖 Letterale</div><div>'+esc(r.letterale)+'</div></div>'+
     '<div class="trad-box"><div class="trad-tit">✨ Italiano scorrevole</div><div>'+esc(r.scorrevole)+'</div></div></div>';
  if(r.note) h+='<p class="nota">💡 '+esc(r.note)+'</p>';
  return h+'</div>';
}

/* ---------- HOME ---------- */
const MENU = [
  {id:"casi", e:"🎨", t:"Capire i casi", d:"La chiave di tutto: a che serve ogni caso, con i colori."},
  {id:"tabelle", e:"📋", t:"Le tabelle", d:"5 declinazioni, aggettivi, pronomi e verbi. Con modalità studio."},
  {id:"complementi", e:"🔗", t:"Complementi", d:"L'analisi logica: ogni complemento → quale caso latino."},
  {id:"preposizioni", e:"🧱", t:"Preposizioni", d:"Quali reggono accusativo e quali ablativo."},
  {id:"traduci", e:"🧩", t:"Traduci passo passo", d:"Frasi pronte spiegate parola per parola, con la voce."},
  {id:"tutor", e:"🦉", t:"Tutor AI (traduci tutto)", d:"Incolla QUALSIASI versione o parola: traduce e spiega, anche italiano→latino."},
  {id:"lessico", e:"🔤", t:"Lessico", d:"Le parole più importanti, a schede, con i derivati italiani."},
  {id:"allenati", e:"🎯", t:"Allenati", d:"Esercizi a tocco, niente da scrivere, feedback gentile."},
  {id:"progressi", e:"🌱", t:"I tuoi progressi", d:"Cosa hai imparato e i tuoi traguardi."},
  {id:"guida", e:"🧭", t:"Per chi ti aiuta", d:"Guida per mamma, papà o tutor."}
];
function renderHome(){
  qs("#homeMenu").innerHTML = MENU.map(m=>'<button class="tile" data-go="'+m.id+'"><span class="emoji">'+m.e+'</span><span><h3>'+m.t+'</h3><p>'+m.d+'</p></span></button>').join("");
}

/* ---------- POMODORO ---------- */
let pomo = { studio:25, pausa:5, fase:"studio", restante:25*60, attivo:false, timer:null };
function caricaPomo(){ try{ const o=JSON.parse(localStorage.getItem("latino-pomo")||"{}"); if(o.studio) pomo.studio=o.studio; if(o.pausa) pomo.pausa=o.pausa; pomo.restante=pomo.studio*60; }catch(e){} }
function salvaPomo(){ try{ localStorage.setItem("latino-pomo", JSON.stringify({studio:pomo.studio, pausa:pomo.pausa})); }catch(e){} }
function fmt(s){ return due(Math.floor(s/60))+":"+due(s%60); }
function beep(volte){
  try{
    const A = window.AudioContext||window.webkitAudioContext; if(!A) return; const a=new A();
    for(let i=0;i<volte;i++){ const o=a.createOscillator(), g=a.createGain(); o.connect(g); g.connect(a.destination);
      o.frequency.value=720; g.gain.value=0.12; const t0=a.currentTime+i*0.32; o.start(t0); o.stop(t0+0.22); }
    setTimeout(()=>a.close(), 400+volte*320);
  }catch(e){}
}
function pomoApri(){ pomoRender(); qs("#pomoBack").classList.add("show"); qs("#pomoModal").classList.add("show"); qs("#pomoModal").setAttribute("aria-hidden","false"); }
function pomoChiudi(){ qs("#pomoBack").classList.remove("show"); qs("#pomoModal").classList.remove("show"); qs("#pomoModal").setAttribute("aria-hidden","true"); }
function pomoPreset(st,pa){ pomo.studio=st; pomo.pausa=pa; pomoStop(); pomo.fase="studio"; pomo.restante=st*60; salvaPomo(); pomoRender(); }
function pomoStep(qual,delta){ if(qual==="studio") pomo.studio=clamp(pomo.studio+delta,[5,90]); else pomo.pausa=clamp(pomo.pausa+delta,[1,30]); if(!pomo.attivo){ pomo.restante=(pomo.fase==="studio"?pomo.studio:pomo.pausa)*60; } salvaPomo(); pomoRender(); }
function pomoTick(){
  pomo.restante--;
  if(pomo.restante<=0){
    if(pomo.fase==="studio"){ P.pomodori++; salvaProg(); checkAch(); pomo.fase="pausa"; pomo.restante=pomo.pausa*60; beep(2); }
    else{ pomo.fase="studio"; pomo.restante=pomo.studio*60; beep(1); }
  }
  pomoRender();
}
function pomoStart(){ if(pomo.attivo) return; pomo.attivo=true; pomo.timer=setInterval(pomoTick,1000); pomoRender(); }
function pomoPausa(){ pomo.attivo=false; if(pomo.timer){ clearInterval(pomo.timer); pomo.timer=null; } pomoRender(); }
function pomoStop(){ pomo.attivo=false; if(pomo.timer){ clearInterval(pomo.timer); pomo.timer=null; } }
function pomoReset(){ pomoStop(); pomo.fase="studio"; pomo.restante=pomo.studio*60; pomoRender(); }
function pomoRender(){
  const disp = qs("#pomoDisplay"); if(disp) disp.textContent = fmt(pomo.restante);
  const fase = qs("#pomoFase"); if(fase){ fase.textContent = pomo.fase==="studio"?"📚 Studio":"☕ Pausa"; fase.className = "pomo-fase "+pomo.fase; }
  const tog = qs("#pomoToggle"); if(tog) tog.textContent = pomo.attivo?"⏸ Pausa":"▶ Avvia";
  const os = qs("#pomoStudio"); if(os) os.textContent = pomo.studio+" min";
  const op = qs("#pomoPausa"); if(op) op.textContent = pomo.pausa+" min";
  qsa("#pomoPreset .btn").forEach(b=>b.classList.toggle("sel", b.dataset.st==pomo.studio && b.dataset.pa==pomo.pausa));
  const btn = qs("#pomoBtn"); if(btn) btn.innerHTML = pomo.attivo ? '🍅 <span class="pomo-mini">'+fmt(pomo.restante)+'</span>' : '🍅';
  document.body.classList.toggle("pomo-attivo", pomo.attivo);
}

/* ---------- IMPOSTAZIONI: apri/chiudi ---------- */
function apriSet(v){ qs("#drawer").classList.toggle("show",v); qs("#backdrop").classList.toggle("show",v); qs("#drawer").setAttribute("aria-hidden", v?"false":"true"); }

/* ---------- EVENTI GLOBALI ---------- */
document.addEventListener("click", e=>{
  const go = e.target.closest("[data-go]");
  if(go){ vai(go.dataset.go); return; }
  const h = e.target.closest(".hidey");
  if(h && document.body.classList.contains("nascondi")){ h.classList.toggle("svelata"); return; }
  const sp = e.target.closest(".speak[data-say]");
  if(sp){ const el = qs("#"+sp.dataset.say); if(el) parla(el.innerText); }
  const spl = e.target.closest(".speak[data-t]");
  if(spl){ parlaLa(spl.dataset.t); }
  const tb = e.target.closest(".tabbtn");
  if(tb){ tabAttiva=tb.dataset.tab; renderTab(); }
});

function initEventi(){
  qs("#homeBtn").addEventListener("click", ()=>vai("home"));
  qs("#setBtn").addEventListener("click", ()=>apriSet(true));
  qs("#closeSet").addEventListener("click", ()=>apriSet(false));
  qs("#backdrop").addEventListener("click", ()=>apriSet(false));
  document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ apriSet(false); pomoChiudi(); } });

  qsa("[data-step]").forEach(b=> b.addEventListener("click", ()=>{
    const [k,delta] = b.dataset.step.split(":");
    S[k] = clamp(round2(S[k]+parseFloat(delta)), LIMITI[k]); applica(); salvaImp();
  }));
  qsa("#fontChoices .btn").forEach(b=> b.addEventListener("click", ()=>{ S.font=b.dataset.font; applica(); salvaImp(); }));
  qsa("#themeChoices .btn").forEach(b=> b.addEventListener("click", ()=>{ S.theme=b.dataset.theme; applica(); salvaImp(); }));
  qsa("#accentChoices .sw").forEach(b=> b.addEventListener("click", ()=>{ S.accent=b.dataset.accent; applica(); salvaImp(); }));
  qs("#rulerSwitch").addEventListener("change", e=>{ S.ruler=e.target.checked; applica(); salvaImp(); });
  qs("#puntiSwitch").addEventListener("change", e=>{ S.hidePunti=e.target.checked; applica(); salvaImp(); });
  qs("#nomeInput").addEventListener("input", e=>{ S.nome=e.target.value.slice(0,20); aggiornaSaluto(); salvaImp(); });
  qs("#tutorUrl").addEventListener("input", e=>{ TUT.url=e.target.value.trim(); salvaTut(); });
  qs("#tutorCode").addEventListener("input", e=>{ TUT.code=e.target.value.trim(); salvaTut(); });
  qs("#resetSet").addEventListener("click", ()=>{ const nome=S.nome; S=Object.assign({},DEFAULT); S.nome=nome; applica(); salvaImp(); });

  // Pomodoro
  qs("#pomoBtn").addEventListener("click", pomoApri);
  qs("#pomoClose").addEventListener("click", pomoChiudi);
  qs("#pomoBack").addEventListener("click", pomoChiudi);
  qs("#pomoToggle").addEventListener("click", ()=>{ pomo.attivo?pomoPausa():pomoStart(); });
  qs("#pomoReset").addEventListener("click", pomoReset);
  qsa("#pomoPreset .btn").forEach(b=> b.addEventListener("click", ()=>pomoPreset(+b.dataset.st, +b.dataset.pa)));
  qsa("[data-pomo]").forEach(b=> b.addEventListener("click", ()=>{ const [q,d]=b.dataset.pomo.split(":"); pomoStep(q, +d); }));

  // Righello
  const ruler = qs("#ruler");
  const muovi = (y)=>{ ruler.style.top = (y - ruler.offsetHeight/2)+"px"; };
  document.addEventListener("pointermove", e=>{ if(S.ruler) muovi(e.clientY); }, {passive:true});
  document.addEventListener("touchmove", e=>{ if(S.ruler && e.touches[0]) muovi(e.touches[0].clientY); }, {passive:true});
}

/* ---------- AVVIO ---------- */
function init(){
  const af = qs("#annoFooter"); if(af) af.textContent = new Date().getFullYear();
  caricaPomo();
  aggiornaStreak(); checkAch();
  renderHome(); renderExtraHome(); renderCasi(); renderTabelleShell(); renderComplementi(); renderPreposizioni();
  initEventi(); applica(); pomoRender();
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(()=>{});
}
init();
