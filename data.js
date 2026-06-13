/* =========================================================
   Latino facile — DATI (contenuti verificati)
   Morfologia controllata su grammatiche del biennio + Wiktionary.
   Ordine casi italiano: Nom, Gen, Dat, Acc, Voc, Abl.
   ========================================================= */

const ORDINE = ["nom","gen","dat","acc","voc","abl"];
const NOMECASO = { nom:"Nominativo", gen:"Genitivo", dat:"Dativo", acc:"Accusativo", voc:"Vocativo", abl:"Ablativo" };

/* ---------- I CASI ---------- */
const CASI = [
  { id:"nom", nome:"Nominativo", domanda:"Chi? Che cosa?",
    funzione:"È il <b>soggetto</b>: chi fa l'azione o di cui si parla. Anche il nome dopo il verbo essere (predicato nominale).",
    esempio:'<b class="bg-nom">La maestra</b> spiega.', ruolo:"«La maestra» fa l'azione → soggetto." },
  { id:"gen", nome:"Genitivo", domanda:"Di chi? Di che cosa?",
    funzione:"Indica <b>di chi è</b> qualcosa (specificazione). Spesso si traduce con «di».",
    esempio:'Il libro <b class="bg-gen">della maestra</b>.', ruolo:"«della maestra» dice di chi è il libro." },
  { id:"dat", nome:"Dativo", domanda:"A chi? A che cosa?",
    funzione:"È la persona <b>a cui</b> diamo, diciamo o portiamo qualcosa (termine).",
    esempio:'Do un regalo <b class="bg-dat">alla maestra</b>.', ruolo:"«alla maestra» = a chi do il regalo." },
  { id:"acc", nome:"Accusativo", domanda:"Chi? Che cosa? (chi subisce)",
    funzione:"È il <b>complemento oggetto</b>: chi o che cosa <b>subisce</b> l'azione.",
    esempio:'Saluto <b class="bg-acc">la maestra</b>.', ruolo:"«la maestra» subisce il saluto → oggetto." },
  { id:"voc", nome:"Vocativo", domanda:"(per chiamare)",
    funzione:"Si usa per <b>chiamare</b> qualcuno o rivolgersi a lui.",
    esempio:'<b class="bg-voc">Maestra</b>, mi ascolti?', ruolo:"Chiamiamo direttamente la maestra." },
  { id:"abl", nome:"Ablativo", domanda:"Con che cosa? Dove? Quando? Da dove?",
    funzione:"Il caso “jolly”: tantissimi complementi (mezzo, modo, luogo, tempo, causa…).",
    esempio:'Scrivo <b class="bg-abl">con la penna</b>.', ruolo:"«con la penna» = il mezzo con cui scrivo." }
];

/* ---------- TABELLE ----------
   tipo "nome"  -> radice + desinenze colorate per caso (3 colonne)
   tipo "grid"  -> forme intere in matrice (blocchi Singolare/Plurale, colonne per genere/persona)
   tipo "verbo" -> persone x tempi
*/
const TABELLE = [
  { cat:"Sostantivi · le 5 declinazioni", tab:[
    { tipo:"nome", id:"d1", titolo:"1ª declinazione", sub:"rosa, rosae — la rosa (femminile)", radice:"ros",
      des:{ nom:["a","ae"], gen:["ae","arum"], dat:["ae","is"], acc:["am","as"], voc:["a","ae"], abl:["a","is"] },
      nota:"Quasi tutti femminili. <b>rosae</b> può essere genitivo o dativo singolare, oppure nominativo plurale: lo capisci dalla frase." },
    { tipo:"nome", id:"d2m", titolo:"2ª declinazione · maschile", sub:"dominus, domini — il padrone", radice:"domin",
      des:{ nom:["us","i"], gen:["i","orum"], dat:["o","is"], acc:["um","os"], voc:["e","i"], abl:["o","is"] },
      nota:"Il vocativo singolare è speciale: finisce in <b>-e</b> (domine). I nomi in -ius hanno vocativo in -ī (filius → filī)." },
    { tipo:"nome", id:"d2er", titolo:"2ª declinazione · maschile in -er", sub:"puer, pueri — il bambino", radice:"puer",
      des:{ nom:["","i"], gen:["i","orum"], dat:["o","is"], acc:["um","os"], voc:["","i"], abl:["o","is"] },
      nota:"Nominativo = vocativo (puer). <b>puer</b> tiene la -e (puer-); altri come magister la perdono (magistr-)." },
    { tipo:"nome", id:"d2n", titolo:"2ª declinazione · neutro", sub:"templum, templi — il tempio", radice:"templ",
      des:{ nom:["um","a"], gen:["i","orum"], dat:["o","is"], acc:["um","a"], voc:["um","a"], abl:["o","is"] },
      nota:"Regola d'oro dei <b>neutri</b>: nominativo = accusativo = vocativo; al plurale finiscono in <b>-a</b>." },
    { tipo:"nome", id:"d3c", titolo:"3ª declinazione · maschile/femminile", sub:"consul, consulis — il console", radice:"consul",
      des:{ nom:["","es"], gen:["is","um"], dat:["i","ibus"], acc:["em","es"], voc:["","es"], abl:["e","ibus"] },
      nota:"La più varia. Segnali utili: accusativo sing. <b>-em</b>, genitivo plur. <b>-um</b>. Il nominativo sing. cambia molto: studia sempre la 2ª forma (il genitivo)." },
    { tipo:"nome", id:"d3n", titolo:"3ª declinazione · neutro", sub:"corpus, corporis — il corpo", radice:"corpor",
      des:{ nom:["▪","a"], gen:["is","um"], dat:["i","ibus"], acc:["▪","a"], voc:["▪","a"], abl:["e","ibus"] },
      nota:"Nominativo sing. irregolare (corpus); poi tema corpor-. Neutro: nom.=acc.=voc., plurale in <b>-a</b>. (▪ = forma particolare al nominativo)." },
    { tipo:"nome", id:"d3i", titolo:"3ª declinazione · in -i (m./f.)", sub:"civis, civis — il cittadino", radice:"civ",
      des:{ nom:["is","es"], gen:["is","ium"], dat:["i","ibus"], acc:["em","es"], voc:["is","es"], abl:["e","ibus"] },
      nota:"Tema in -i: il segnale è il genitivo plurale <b>-ium</b> (invece di -um)." },
    { tipo:"nome", id:"d3in", titolo:"3ª declinazione · neutro in -i", sub:"mare, maris — il mare", radice:"mar",
      des:{ nom:["e","ia"], gen:["is","ium"], dat:["i","ibus"], acc:["e","ia"], voc:["e","ia"], abl:["i","ibus"] },
      nota:"Neutri in -i: ablativo sing. <b>-ī</b>, genitivo plur. <b>-ium</b>, e nom./acc./voc. plurale in <b>-ia</b>." },
    { tipo:"nome", id:"d4", titolo:"4ª declinazione", sub:"fructus, fructus — il frutto", radice:"fruct",
      des:{ nom:["us","us"], gen:["us","uum"], dat:["ui","ibus"], acc:["um","us"], voc:["us","us"], abl:["u","ibus"] },
      nota:"Tutta giocata sulla <b>u</b>. manus (mano) è femminile e si declina uguale. Neutri (cornu) in -ū." },
    { tipo:"nome", id:"d5", titolo:"5ª declinazione", sub:"res, rei — la cosa", radice:"r",
      des:{ nom:["es","es"], gen:["ei","erum"], dat:["ei","ebus"], acc:["em","es"], voc:["es","es"], abl:["e","ebus"] },
      nota:"Quasi tutti femminili. dies (giorno) si declina uguale (di-ēs, di-ēī…)." }
  ]},

  { cat:"Aggettivi", tab:[
    { tipo:"grid", id:"agg1", titolo:"Aggettivi 1ª classe", sub:"bonus, bona, bonum — buono",
      nota:"Maschile come 2ª decl., femminile come 1ª, neutro come 2ª neutro. Tipo in -er: pulcher, pulchra, pulchrum.",
      col:["Maschile","Femminile","Neutro"],
      blocchi:[
        { nome:"Singolare", righe:[
          {caso:"nom",f:["bonus","bona","bonum"]},{caso:"gen",f:["boni","bonae","boni"]},
          {caso:"dat",f:["bono","bonae","bono"]},{caso:"acc",f:["bonum","bonam","bonum"]},
          {caso:"voc",f:["bone","bona","bonum"]},{caso:"abl",f:["bono","bona","bono"]} ]},
        { nome:"Plurale", righe:[
          {caso:"nom",f:["boni","bonae","bona"]},{caso:"gen",f:["bonorum","bonarum","bonorum"]},
          {caso:"dat",f:["bonis","bonis","bonis"]},{caso:"acc",f:["bonos","bonas","bona"]},
          {caso:"voc",f:["boni","bonae","bona"]},{caso:"abl",f:["bonis","bonis","bonis"]} ]}
      ]},
    { tipo:"grid", id:"agg2", titolo:"Aggettivi 2ª classe (due uscite)", sub:"fortis (m./f.), forte (n.) — forte",
      nota:"Si declinano come la 3ª in -i: abl. sing. <b>-ī</b>, gen. plur. <b>-ium</b>, neutro plur. <b>-ia</b>. A tre uscite: acer, acris, acre.",
      col:["Masch./Femm.","Neutro"],
      blocchi:[
        { nome:"Singolare", righe:[
          {caso:"nom",f:["fortis","forte"]},{caso:"gen",f:["fortis","fortis"]},
          {caso:"dat",f:["forti","forti"]},{caso:"acc",f:["fortem","forte"]},
          {caso:"voc",f:["fortis","forte"]},{caso:"abl",f:["forti","forti"]} ]},
        { nome:"Plurale", righe:[
          {caso:"nom",f:["fortes","fortia"]},{caso:"gen",f:["fortium","fortium"]},
          {caso:"dat",f:["fortibus","fortibus"]},{caso:"acc",f:["fortes","fortia"]},
          {caso:"voc",f:["fortes","fortia"]},{caso:"abl",f:["fortibus","fortibus"]} ]}
      ]}
  ]},

  { cat:"Pronomi", tab:[
    { tipo:"grid", id:"pron1", titolo:"Pronomi personali", sub:"io, tu, noi, voi (+ riflessivo)",
      nota:"Non hanno genere. Il riflessivo (se stesso) non ha nominativo ed è uguale al singolare e al plurale.",
      col:["io","tu","noi","voi","riflessivo"],
      blocchi:[
        { nome:"", righe:[
          {caso:"nom",f:["ego","tu","nos","vos","—"]},
          {caso:"gen",f:["mei","tui","nostri","vestri","sui"]},
          {caso:"dat",f:["mihi","tibi","nobis","vobis","sibi"]},
          {caso:"acc",f:["me","te","nos","vos","se"]},
          {caso:"abl",f:["me","te","nobis","vobis","se"]} ]}
      ]},
    { tipo:"grid", id:"pron2", titolo:"Determinativo is, ea, id", sub:"egli/ella/esso; quello",
      nota:"Genitivo singolare unico per i tre generi: <b>eius</b>; dativo sing. <b>eī</b>; dat./abl. plur. <b>eīs</b>.",
      col:["Maschile","Femminile","Neutro"],
      blocchi:[
        { nome:"Singolare", righe:[
          {caso:"nom",f:["is","ea","id"]},{caso:"gen",f:["eius","eius","eius"]},
          {caso:"dat",f:["ei","ei","ei"]},{caso:"acc",f:["eum","eam","id"]},
          {caso:"abl",f:["eo","ea","eo"]} ]},
        { nome:"Plurale", righe:[
          {caso:"nom",f:["ei","eae","ea"]},{caso:"gen",f:["eorum","earum","eorum"]},
          {caso:"dat",f:["eis","eis","eis"]},{caso:"acc",f:["eos","eas","ea"]},
          {caso:"abl",f:["eis","eis","eis"]} ]}
      ]},
    { tipo:"grid", id:"pron3", titolo:"Relativo qui, quae, quod", sub:"il quale, che",
      nota:"Lega due frasi. Genitivo <b>cuius</b>, dativo <b>cui</b>, dat./abl. plurale <b>quibus</b>. Concorda in genere e numero con il nome a cui si riferisce.",
      col:["Maschile","Femminile","Neutro"],
      blocchi:[
        { nome:"Singolare", righe:[
          {caso:"nom",f:["qui","quae","quod"]},{caso:"gen",f:["cuius","cuius","cuius"]},
          {caso:"dat",f:["cui","cui","cui"]},{caso:"acc",f:["quem","quam","quod"]},
          {caso:"abl",f:["quo","qua","quo"]} ]},
        { nome:"Plurale", righe:[
          {caso:"nom",f:["qui","quae","quae"]},{caso:"gen",f:["quorum","quarum","quorum"]},
          {caso:"dat",f:["quibus","quibus","quibus"]},{caso:"acc",f:["quos","quas","quae"]},
          {caso:"abl",f:["quibus","quibus","quibus"]} ]}
      ]}
  ]},

  { cat:"Verbi", tab:[
    { tipo:"verbo", id:"vsum", titolo:"sum — essere", sub:"il verbo più importante",
      persone:["io","tu","egli/ella","noi","voi","essi/esse"],
      tempi:[
        {nome:"Presente", f:["sum","es","est","sumus","estis","sunt"]},
        {nome:"Imperfetto", f:["eram","eras","erat","eramus","eratis","erant"]},
        {nome:"Futuro", f:["ero","eris","erit","erimus","eritis","erunt"]}
      ], extra:"Imperativo: <b>es / este</b> · Infinito presente: <b>esse</b>" },
    { tipo:"verbo", id:"v1", titolo:"1ª coniugazione", sub:"amo, amare — amare",
      persone:["io","tu","egli/ella","noi","voi","essi/esse"],
      tempi:[
        {nome:"Presente", f:["amo","amas","amat","amamus","amatis","amant"]},
        {nome:"Imperfetto", f:["amabam","amabas","amabat","amabamus","amabatis","amabant"]},
        {nome:"Futuro", f:["amabo","amabis","amabit","amabimus","amabitis","amabunt"]}
      ], extra:"Imperativo: <b>ama / amate</b> · Infinito presente: <b>amare</b>" },
    { tipo:"verbo", id:"v2", titolo:"2ª coniugazione", sub:"moneo, monere — avvertire",
      persone:["io","tu","egli/ella","noi","voi","essi/esse"],
      tempi:[
        {nome:"Presente", f:["moneo","mones","monet","monemus","monetis","monent"]},
        {nome:"Imperfetto", f:["monebam","monebas","monebat","monebamus","monebatis","monebant"]},
        {nome:"Futuro", f:["monebo","monebis","monebit","monebimus","monebitis","monebunt"]}
      ], extra:"Imperativo: <b>mone / monete</b> · Infinito presente: <b>monere</b>" },
    { tipo:"verbo", id:"v3", titolo:"3ª coniugazione", sub:"lego, legere — leggere",
      persone:["io","tu","egli/ella","noi","voi","essi/esse"],
      tempi:[
        {nome:"Presente", f:["lego","legis","legit","legimus","legitis","legunt"]},
        {nome:"Imperfetto", f:["legebam","legebas","legebat","legebamus","legebatis","legebant"]},
        {nome:"Futuro", f:["legam","leges","leget","legemus","legetis","legent"]}
      ], extra:"Imperativo: <b>lege / legite</b> · Infinito presente: <b>legere</b> · ⚠️ il futuro fa <b>legam, leges…</b> (non confonderlo col presente)." },
    { tipo:"verbo", id:"v4", titolo:"4ª coniugazione", sub:"audio, audire — ascoltare",
      persone:["io","tu","egli/ella","noi","voi","essi/esse"],
      tempi:[
        {nome:"Presente", f:["audio","audis","audit","audimus","auditis","audiunt"]},
        {nome:"Imperfetto", f:["audiebam","audiebas","audiebat","audiebamus","audiebatis","audiebant"]},
        {nome:"Futuro", f:["audiam","audies","audiet","audiemus","audietis","audient"]}
      ], extra:"Imperativo: <b>audi / audite</b> · Infinito presente: <b>audire</b>" },
    { tipo:"verbo", id:"v5", titolo:"Coniugazione mista (-io)", sub:"capio, capere — prendere",
      persone:["io","tu","egli/ella","noi","voi","essi/esse"],
      tempi:[
        {nome:"Presente", f:["capio","capis","capit","capimus","capitis","capiunt"]},
        {nome:"Imperfetto", f:["capiebam","capiebas","capiebat","capiebamus","capiebatis","capiebant"]},
        {nome:"Futuro", f:["capiam","capies","capiet","capiemus","capietis","capient"]}
      ], extra:"Imperativo: <b>cape / capite</b> · Infinito presente: <b>capere</b>" }
  ]}
];

/* ---------- COMPLEMENTI (analisi logica → caso latino) ---------- */
const COMPLEMENTI = [
  { nome:"Soggetto", caso:"nom", come:"Nominativo", es:"<b class='bg-nom'>puella</b> cantat — la ragazza canta" },
  { nome:"Predicato nominale", caso:"nom", come:"Nominativo (con sum)", es:"Marcus <b class='bg-nom'>consul</b> est — Marco è console" },
  { nome:"Complemento oggetto", caso:"acc", come:"Accusativo", es:"librum <b class='bg-acc'>lego</b> — leggo un libro" },
  { nome:"Specificazione (di chi/di che)", caso:"gen", come:"Genitivo", es:"liber <b class='bg-gen'>pueri</b> — il libro del ragazzo" },
  { nome:"Termine (a chi)", caso:"dat", come:"Dativo", es:"<b class='bg-dat'>amico</b> dono — regalo all'amico" },
  { nome:"Mezzo / strumento", caso:"abl", come:"Ablativo semplice", es:"<b class='bg-abl'>gladio</b> pugnat — combatte con la spada" },
  { nome:"Modo / maniera", caso:"abl", come:"Ablativo (anche cum + abl.)", es:"magna <b class='bg-abl'>cura</b> — con grande cura" },
  { nome:"Compagnia / unione", caso:"abl", come:"cum + ablativo", es:"<b class='bg-abl'>cum amicis</b> — con gli amici" },
  { nome:"Causa", caso:"abl", come:"Ablativo (o propter + acc.)", es:"<b class='bg-abl'>timore</b> fugit — fugge per la paura" },
  { nome:"Fine / scopo", caso:"dat", come:"Dativo o ad + acc.", es:"<b class='bg-acc'>ad pugnam</b> — per la battaglia" },
  { nome:"Agente (chi, passivo)", caso:"abl", come:"a / ab + ablativo", es:"<b class='bg-abl'>a militibus</b> capitur — è preso dai soldati" },
  { nome:"Stato in luogo (dove sei)", caso:"abl", come:"in + ablativo", es:"<b class='bg-abl'>in urbe</b> — in città" },
  { nome:"Moto a luogo (dove vai)", caso:"acc", come:"in / ad + accusativo", es:"<b class='bg-acc'>in Italiam</b> — in Italia" },
  { nome:"Moto da luogo (da dove)", caso:"abl", come:"a/ab, e/ex, de + abl.", es:"<b class='bg-abl'>ex urbe</b> — dalla città" },
  { nome:"Tempo determinato (quando)", caso:"abl", come:"Ablativo", es:"<b class='bg-abl'>aestate</b> — in estate" },
  { nome:"Tempo continuato (per quanto)", caso:"acc", come:"Accusativo", es:"<b class='bg-acc'>multos annos</b> — per molti anni" }
];

/* ---------- PREPOSIZIONI ---------- */
const PREPOSIZIONI = [
  { p:"ad", caso:"acc", sig:"verso, presso, a" },
  { p:"ante", caso:"acc", sig:"davanti a, prima di" },
  { p:"apud", caso:"acc", sig:"presso, da" },
  { p:"contra", caso:"acc", sig:"contro" },
  { p:"inter", caso:"acc", sig:"fra, tra" },
  { p:"per", caso:"acc", sig:"attraverso, per mezzo di" },
  { p:"post", caso:"acc", sig:"dietro, dopo" },
  { p:"propter / ob", caso:"acc", sig:"a causa di" },
  { p:"trans", caso:"acc", sig:"al di là di" },
  { p:"a / ab", caso:"abl", sig:"da (agente, moto da luogo)" },
  { p:"cum", caso:"abl", sig:"con" },
  { p:"de", caso:"abl", sig:"da, giù da; riguardo a" },
  { p:"e / ex", caso:"abl", sig:"da, fuori da" },
  { p:"pro", caso:"abl", sig:"davanti a, in favore di" },
  { p:"sine", caso:"abl", sig:"senza" },
  { p:"in", caso:"due", sig:"+ acc. = moto a luogo (in/verso); + abl. = stato in luogo (in)" },
  { p:"sub", caso:"due", sig:"+ acc. = sotto (con moto); + abl. = sotto (stato)" }
];

/* ---------- LESSICO (con derivati italiani dove utile) ---------- */
const LESSICO = [
  { gruppo:"Persone", parole:[
    {lat:"puella, -ae", it:"ragazza", der:""},
    {lat:"vir, viri", it:"uomo", der:"virile"},
    {lat:"amicus, -i", it:"amico", der:"amicizia"},
    {lat:"dominus, -i", it:"padrone, signore", der:"dominare"},
    {lat:"servus, -i", it:"schiavo", der:"servo, servire"},
    {lat:"magister, -tri", it:"maestro", der:"magistrale"},
    {lat:"rex, regis", it:"re", der:"regale, reggia"},
    {lat:"miles, militis", it:"soldato", der:"militare"},
    {lat:"pater, patris", it:"padre", der:"paterno"},
    {lat:"mater, matris", it:"madre", der:"materno"},
    {lat:"homo, hominis", it:"uomo, essere umano", der:"umano"}
  ]},
  { gruppo:"Luoghi e cose", parole:[
    {lat:"aqua, -ae", it:"acqua", der:"acquatico"},
    {lat:"terra, -ae", it:"terra", der:"terrestre"},
    {lat:"silva, -ae", it:"bosco, selva", der:"selvaggio"},
    {lat:"patria, -ae", it:"patria", der:"patriottico"},
    {lat:"via, -ae", it:"strada, via", der:"viale"},
    {lat:"liber, libri", it:"libro", der:"libreria"},
    {lat:"bellum, -i", it:"guerra", der:"bellico"},
    {lat:"gladius, -i", it:"spada", der:"gladiatore"},
    {lat:"templum, -i", it:"tempio", der:""},
    {lat:"urbs, urbis", it:"città", der:"urbano"},
    {lat:"corpus, corporis", it:"corpo", der:"corporeo"},
    {lat:"nomen, nominis", it:"nome", der:"nominare"},
    {lat:"tempus, temporis", it:"tempo", der:"temporale"},
    {lat:"mare, maris", it:"mare", der:"marino"},
    {lat:"manus, -us", it:"mano", der:"manuale"},
    {lat:"res, rei", it:"cosa, fatto", der:"reale"},
    {lat:"dies, diei", it:"giorno", der:"diario"}
  ]},
  { gruppo:"Aggettivi", parole:[
    {lat:"bonus, -a, -um", it:"buono", der:"bonario"},
    {lat:"malus, -a, -um", it:"cattivo", der:"malvagio"},
    {lat:"magnus, -a, -um", it:"grande", der:"magnifico"},
    {lat:"parvus, -a, -um", it:"piccolo", der:""},
    {lat:"pulcher, -chra, -chrum", it:"bello", der:""},
    {lat:"longus, -a, -um", it:"lungo", der:"allungare"},
    {lat:"fortis, -e", it:"forte, coraggioso", der:"fortezza"},
    {lat:"omnis, -e", it:"ogni, tutto", der:"onnipotente"},
    {lat:"felix, felicis", it:"felice, fortunato", der:"felicità"}
  ]},
  { gruppo:"Verbi", parole:[
    {lat:"sum, esse", it:"essere", der:""},
    {lat:"amo, -are", it:"amare", der:"amante"},
    {lat:"laudo, -are", it:"lodare", der:"lode"},
    {lat:"voco, -are", it:"chiamare", der:"vocazione"},
    {lat:"porto, -are", it:"portare", der:"trasporto"},
    {lat:"narro, -are", it:"raccontare", der:"narrare"},
    {lat:"pugno, -are", it:"combattere", der:"pugno"},
    {lat:"habeo, -ere", it:"avere", der:"abito (vestito)"},
    {lat:"video, -ere", it:"vedere", der:"visione, video"},
    {lat:"teneo, -ere", it:"tenere", der:"tenace"},
    {lat:"lego, -ere", it:"leggere", der:"lettura"},
    {lat:"scribo, -ere", it:"scrivere", der:"scrittura"},
    {lat:"dico, -ere", it:"dire", der:"dizione"},
    {lat:"duco, -ere", it:"condurre, guidare", der:"condurre"},
    {lat:"audio, -ire", it:"ascoltare, sentire", der:"audio"},
    {lat:"venio, -ire", it:"venire", der:"avvento"},
    {lat:"capio, -ere", it:"prendere", der:"cattura"},
    {lat:"do, dare", it:"dare", der:"dono"}
  ]},
  { gruppo:"Parole utili", parole:[
    {lat:"et", it:"e", der:""},
    {lat:"sed", it:"ma", der:""},
    {lat:"non", it:"non", der:""},
    {lat:"cum", it:"con (+ abl.) / quando", der:""},
    {lat:"in", it:"in, su", der:""},
    {lat:"ad", it:"verso, a", der:""},
    {lat:"sine", it:"senza", der:""},
    {lat:"semper", it:"sempre", der:""},
    {lat:"saepe", it:"spesso", der:""},
    {lat:"nunc", it:"ora, adesso", der:""}
  ]}
];

/* ---------- TRADUZIONI GUIDATE ----------
   Ogni token: w = parola latina, a = analisi, it = significato, caso (per colore, opzionale)
   sol = traduzione corretta; alt = traduzioni sbagliate (distrattori)
*/
const TRADUZIONI = [
  { lat:["Puella","rosam","amat."],
    token:[ {w:"Puella",a:"nominativo sing. (1ª) — soggetto",it:"la ragazza",caso:"nom"},
            {w:"rosam",a:"accusativo sing. (1ª) — oggetto",it:"la rosa",caso:"acc"},
            {w:"amat",a:"verbo, 3ª sing. presente",it:"ama"} ],
    sol:"La ragazza ama la rosa.", alt:["La rosa ama la ragazza.","Le ragazze amano le rose."] },
  { lat:["Magister","discipulos","laudat."],
    token:[ {w:"Magister",a:"nominativo sing. — soggetto",it:"il maestro",caso:"nom"},
            {w:"discipulos",a:"accusativo plur. (2ª) — oggetto",it:"gli alunni",caso:"acc"},
            {w:"laudat",a:"verbo, 3ª sing. presente",it:"loda"} ],
    sol:"Il maestro loda gli alunni.", alt:["Gli alunni lodano il maestro.","Il maestro loda l'alunno."] },
  { lat:["Servus","domino","aquam","dat."],
    token:[ {w:"Servus",a:"nominativo sing. — soggetto",it:"lo schiavo",caso:"nom"},
            {w:"domino",a:"dativo sing. (2ª) — a chi (termine)",it:"al padrone",caso:"dat"},
            {w:"aquam",a:"accusativo sing. (1ª) — oggetto",it:"l'acqua",caso:"acc"},
            {w:"dat",a:"verbo, 3ª sing. presente",it:"dà"} ],
    sol:"Lo schiavo dà l'acqua al padrone.", alt:["Il padrone dà l'acqua allo schiavo.","Lo schiavo dà il padrone all'acqua."] },
  { lat:["Puer","librum","magistri","legit."],
    token:[ {w:"Puer",a:"nominativo sing. — soggetto",it:"il ragazzo",caso:"nom"},
            {w:"librum",a:"accusativo sing. (2ª) — oggetto",it:"il libro",caso:"acc"},
            {w:"magistri",a:"genitivo sing. (2ª) — di chi (specificazione)",it:"del maestro",caso:"gen"},
            {w:"legit",a:"verbo, 3ª sing. presente",it:"legge"} ],
    sol:"Il ragazzo legge il libro del maestro.", alt:["Il maestro legge il libro del ragazzo.","Il ragazzo del maestro legge il libro."] },
  { lat:["Milites","cum","gladiis","pugnant."],
    token:[ {w:"Milites",a:"nominativo plur. (3ª) — soggetto",it:"i soldati",caso:"nom"},
            {w:"cum",a:"preposizione (+ abl.)",it:"con"},
            {w:"gladiis",a:"ablativo plur. (2ª) — compagnia/mezzo",it:"le spade",caso:"abl"},
            {w:"pugnant",a:"verbo, 3ª plur. presente",it:"combattono"} ],
    sol:"I soldati combattono con le spade.", alt:["Il soldato combatte con la spada.","Le spade combattono i soldati."] },
  { lat:["Agricola","in","silva","ambulat."],
    token:[ {w:"Agricola",a:"nominativo sing. (1ª, maschile) — soggetto",it:"il contadino",caso:"nom"},
            {w:"in",a:"preposizione (qui + abl. = stato in luogo)",it:"nel"},
            {w:"silva",a:"ablativo sing. (1ª) — stato in luogo",it:"bosco",caso:"abl"},
            {w:"ambulat",a:"verbo, 3ª sing. presente",it:"cammina"} ],
    sol:"Il contadino cammina nel bosco.", alt:["Il bosco cammina nel contadino.","I contadini camminano nei boschi."] }
];

/* ---------- ESERCIZI (scelta multipla) ----------
   t: tipo (f=funzione, c=caso, v=verbo, r=regola, l=lessico, p=preposizione)
*/
const DOMANDE = [
  { t:"f", q:"«Il cane morde <b>il bambino</b>» → «il bambino» è…",
    opz:["Soggetto (nominativo)","Compl. oggetto (accusativo)","Compl. di termine (dativo)","Specificazione (genitivo)"],
    giusta:1, sp:"Subisce l'azione → complemento oggetto → <b class='acc'>accusativo</b>." },
  { t:"f", q:"«Il libro <b>di Marco</b>» → «di Marco» è…",
    opz:["Genitivo (di chi)","Dativo (a chi)","Nominativo","Ablativo"],
    giusta:0, sp:"Dice di chi è il libro → <b class='gen'>genitivo</b>." },
  { t:"f", q:"«Scrivo <b>a Giulia</b>» → «a Giulia» è…",
    opz:["Accusativo","Dativo (a chi)","Genitivo","Vocativo"],
    giusta:1, sp:"La persona a cui scrivo → <b class='dat'>dativo</b>." },
  { t:"f", q:"«<b>Giulia</b>, vieni!» → «Giulia» è…",
    opz:["Nominativo","Vocativo (la chiamo)","Accusativo","Dativo"],
    giusta:1, sp:"La sto chiamando → <b class='voc'>vocativo</b>." },
  { t:"f", q:"«Taglio il pane <b>con il coltello</b>» → è…",
    opz:["Dativo","Genitivo","Ablativo (mezzo)","Accusativo"],
    giusta:2, sp:"Il mezzo con cui taglio → <b class='abl'>ablativo</b>." },
  { t:"f", q:"«Vado <b>a Roma</b>» (moto a luogo) → in latino è…",
    opz:["Ablativo","Accusativo (in/ad + acc.)","Genitivo","Dativo"],
    giusta:1, sp:"Moto a luogo → <b class='acc'>accusativo</b> (in/ad + acc., o acc. semplice per le città)." },
  { t:"c", q:'Che caso è <b>puell<span class="acc">am</span></b>?',
    opz:["Nominativo","Accusativo","Genitivo","Ablativo"],
    giusta:1, sp:"<b>-am</b> (1ª decl.) = <b class='acc'>accusativo</b> singolare." },
  { t:"c", q:'Che caso è <b>domin<span class="gen">orum</span></b>?',
    opz:["Genitivo plurale","Accusativo plurale","Dativo singolare","Nominativo plurale"],
    giusta:0, sp:"<b>-orum</b> (2ª decl.) = <b class='gen'>genitivo</b> plurale." },
  { t:"c", q:'Che caso è <b>civ<span class="gen">ium</span></b>?',
    opz:["Genitivo plurale (3ª in -i)","Accusativo singolare","Dativo plurale","Nominativo singolare"],
    giusta:0, sp:"<b>-ium</b> è il segnale del genitivo plurale della 3ª declinazione in -i." },
  { t:"r", q:"Nei nomi <b>neutri</b>, nominativo e accusativo come sono?",
    opz:["Sempre uguali","Sempre diversi","Uguali solo al singolare","Uguali solo al plurale"],
    giusta:0, sp:"Nei neutri nom. = acc. = voc., e al plurale finiscono in <b>-a</b>." },
  { t:"r", q:"Per dire «<b>alle ragazze</b>» (a chi) uso…",
    opz:["puellas","puellis","puellarum","puellam"],
    giusta:1, sp:"Dativo plurale 1ª decl. = <b>puellis</b>." },
  { t:"r", q:"Per dire «<b>vedo l'amico</b>» (oggetto): «video …»",
    opz:["amicus","amici","amicum","amico"],
    giusta:2, sp:"L'oggetto va in accusativo: amic- + <b class='acc'>-um</b> = amicum." },
  { t:"v", q:"Che cosa significa <b>sumus</b>?",
    opz:["io sono","noi siamo","voi siete","essi sono"],
    giusta:1, sp:"sum, es, est, <b>sumus</b> → noi siamo." },
  { t:"v", q:"Che cosa significa <b>amant</b>?",
    opz:["essi amano","noi amiamo","tu ami","egli ama"],
    giusta:0, sp:"…amamus, amatis, <b>amant</b> → essi amano." },
  { t:"v", q:"<b>legam, leges, leget…</b> che tempo è?",
    opz:["Presente","Futuro semplice","Imperfetto","Passato"],
    giusta:1, sp:"Nella 3ª/4ª coniug. il futuro fa -am, -es, -et… Attenzione a non confonderlo col presente." },
  { t:"v", q:"Che cosa significa l'imperfetto <b>amabat</b>?",
    opz:["egli amava","egli amerà","egli ama","ama!"],
    giusta:0, sp:"Il suffisso <b>-ba-</b> è il segnale dell'imperfetto: amabat = «(egli) amava»." },
  { t:"p", q:"La preposizione <b>cum</b> regge il…",
    opz:["Accusativo","Ablativo","Genitivo","Dativo"],
    giusta:1, sp:"cum + <b class='abl'>ablativo</b> (es. cum amicis = con gli amici)." },
  { t:"p", q:"«<b>ad</b> villam» (verso la villa): ad regge il…",
    opz:["Ablativo","Accusativo","Genitivo","Dativo"],
    giusta:1, sp:"ad + <b class='acc'>accusativo</b> (moto a luogo / direzione)." },
  { t:"l", q:"Che cosa significa <b>aqua</b>?",
    opz:["acqua","terra","fuoco","aria"],
    giusta:0, sp:"aqua = acqua (da cui «acquatico», «acquario»)." },
  { t:"l", q:"Che cosa significa <b>rex, regis</b>?",
    opz:["soldato","re","padre","popolo"],
    giusta:1, sp:"rex = re (da cui «regale», «reggia»)." },
  { t:"l", q:"Da quale parola latina viene «bellico»?",
    opz:["bellum (guerra)","bonus (buono)","bene (?)","bellus (?)"],
    giusta:0, sp:"bellum = guerra → «bellico», «belligerante»." },
  { t:"v", q:"Che cosa significa <b>est</b>?",
    opz:["egli è","essi sono","tu sei","io sono"],
    giusta:0, sp:"sum, es, <b>est</b> → «(egli/ella) è»." }
];

/* ---------- FRASE DEL GIORNO (proverbi latini) ---------- */
const PROVERBI = [
  { la:"Carpe diem.", it:"Cogli l'attimo." },
  { la:"Veni, vidi, vici.", it:"Venni, vidi, vinsi." },
  { la:"Per aspera ad astra.", it:"Attraverso le difficoltà, fino alle stelle." },
  { la:"Dum spiro, spero.", it:"Finché respiro, spero." },
  { la:"Festina lente.", it:"Affréttati con calma." },
  { la:"Verba volant, scripta manent.", it:"Le parole volano, gli scritti restano." },
  { la:"Errare humanum est.", it:"Sbagliare è umano." },
  { la:"Audaces fortuna iuvat.", it:"La fortuna aiuta i coraggiosi." },
  { la:"Nosce te ipsum.", it:"Conosci te stesso." },
  { la:"Ad maiora!", it:"Verso cose più grandi!" },
  { la:"Mens sana in corpore sano.", it:"Mente sana in un corpo sano." },
  { la:"Repetita iuvant.", it:"Ripetere fa bene (le cose ripetute aiutano)." },
  { la:"Historia magistra vitae.", it:"La storia è maestra di vita." },
  { la:"Faber est suae quisque fortunae.", it:"Ognuno è artefice della propria sorte." }
];
