/* André Cavalcante PWA — internationalization
   Tiny dependency-free i18n: a flat dictionary per language, a `t(key)`
   lookup, and a DOM walker that swaps text/attrs based on data-* hooks.
   Language preference is persisted to localStorage; the picker re-renders
   the whole UI without a reload. */

(() => {
  "use strict";

  const SUPPORTED = ["en", "pt", "es", "de", "ja", "zh", "ko"];
  const DEFAULT = "en";

  const LANG_META = {
    en: { flag: "🇺🇸", code: "EN", name: "English" },
    pt: { flag: "🇧🇷", code: "PT", name: "Português" },
    es: { flag: "🇪🇸", code: "ES", name: "Español" },
    de: { flag: "🇩🇪", code: "DE", name: "Deutsch" },
    ja: { flag: "🇯🇵", code: "JA", name: "日本語" },
    zh: { flag: "🇨🇳", code: "ZH", name: "中文" },
    ko: { flag: "🇰🇷", code: "KO", name: "한국어" }
  };

  /* ─────────── Translations ─────────── */

  const dict = {
    /* ─────────── ENGLISH ─────────── */
    en: {
      "meta.description": "Official app of fingerstyle guitarist André Cavalcante — music, tour, tabs, and an integrated guitar tuner.",

      "nav.home": "Home",
      "nav.music": "Music",
      "nav.tuner": "Tuner",
      "nav.live": "Live",
      "nav.tabs": "Tabs",

      "home.eyebrow": "FINGERSTYLE GUITARIST",
      "home.hero.sub1": "This is not just guitar.",
      "home.hero.sub2": "This is cinematic fingerstyle.",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "Views",
      "home.stats.countries": "Countries",
      "home.shows.title": "<em>Upcoming</em> shows",
      "home.shows.cta": "FULL TOUR",
      "home.story.kicker": "THE STORY BEHIND THE SOUND",
      "home.story.title": "Every note carries <em>emotion.</em><br/>Every silence tells a <em>story.</em>",
      "home.story.body": "I'm André Cavalcante — a cinematic fingerstyle guitarist. Blending classical technique, flamenco influences and modern percussive elements, my music is designed to be felt — not just heard.",
      "home.story.closer": "<em>I don't just play the guitar. I create atmosphere.</em>",
      "home.collection.kicker": "THE COLLECTION",
      "home.collection.title": "MasterTabs &amp; <em>Tablatures</em>",
      "home.collection.body": "Cinematic fingerstyle arrangements and full studio video lessons — designed to be played, studied and felt.",
      "home.collection.cta": "EXPLORE THE COLLECTION",
      "home.follow.title": "<em>Follow</em>",

      "shows.tickets": "Tickets",

      "music.eyebrow": "LISTEN",
      "music.title": "<em>Music</em>",
      "music.featured": "<em>Featured</em> video",
      "music.catalog": "<em>Full</em> catalog",
      "music.also-on": "<em>Also on</em>",

      "play.eyebrow": "PLAY ALONG",
      "play.title": "<em>Songs</em>",
      "play.sub": "Pick a track. The tuner is preset to its tuning.",
      "play.back": "← BACK",
      "play.tuning": "Tuning",
      "play.capo": "Capo",
      "play.capo.none": "None",
      "play.capo.format": "{n}{ord} fret",

      "tuner.eyebrow": "TUNER",
      "tuner.tune-to": "<em>Tune to</em>",
      "tuner.start": "START TUNER",
      "tuner.stop": "STOP TUNER",
      "tuner.status.idle": "Microphone access will be requested.",
      "tuner.status.requesting": "Requesting microphone…",
      "tuner.status.listening": "Listening — play any string.",
      "tuner.status.denied": "Microphone access denied. Enable it in your browser settings.",
      "tuner.status.error": "Could not access the microphone.",

      "metro.eyebrow": "METRONOME",
      "metro.practice-at": "<em>Practice at</em>",
      "metro.start": "START METRONOME",
      "metro.stop": "STOP METRONOME",
      "metro.reset": "RESET TO SONG TEMPO",
      "metro.status.idle": "Tap start to practice in time.",
      "metro.status.running": "Counting in 4/4 — adjust the tempo to practice.",

      "song.buy": "BUY THE TAB",
      "song.mastertab": "GET MASTERTAB",
      "song.tablature": "GET SIGNATURE TABLATURE",
      "song.offline": "Offline — reconnect to play",

      "live.eyebrow": "EUROPEAN TOUR 2026",
      "live.title": "The music comes<br/><em>alive</em> on stage.",
      "live.sub": "Each performance is unique. Each moment, unrepeatable.",

      "tabs.eyebrow": "LEARN",
      "tabs.title": "<em>Tabs</em>",
      "tabs.sub": "The same notation André uses in the studio.",
      "tabs.video.kicker": "THE VIDEO LESSONS",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "Studio-filmed close-ups, slow walkthroughs and full tablature — measure by measure.",
      "tabs.video.cta": "EXPLORE MASTERTABS",
      "tabs.tab.kicker": "THE TABLATURES",
      "tabs.tab.title": "Signature <em>Tablatures</em>",
      "tabs.tab.body": "Standard notation, tablature and Guitar Pro file — collectible cinematic arrangements.",
      "tabs.tab.cta": "BROWSE TABLATURES",
      "tabs.from": "From",
      "tabs.purchase-note": "All purchases happen on",

      "install.eyebrow": "INSTALL",
      "install.title": "<em>Add to Home Screen</em>",
      "install.step1": "Tap the <strong>Share</strong> icon in Safari.",
      "install.step2": "Choose <strong>Add to Home Screen</strong>.",
      "install.step3": "Tap <strong>Add</strong> to finish.",
      "install.got-it": "GOT IT",
      "install.pill": "INSTALL APP",

      "country.Austria": "Austria",
      "country.Germany": "Germany",
      "country.Netherlands": "Netherlands",

      "lang.picker.aria": "Change language"
    },

    /* ─────────── PORTUGUÊS ─────────── */
    pt: {
      "meta.description": "App oficial do violonista fingerstyle André Cavalcante — música, turnê, partituras e afinador integrado.",

      "nav.home": "Início",
      "nav.music": "Música",
      "nav.tuner": "Afinador",
      "nav.live": "Ao Vivo",
      "nav.tabs": "Cifras",

      "home.eyebrow": "VIOLONISTA FINGERSTYLE",
      "home.hero.sub1": "Isto não é apenas violão.",
      "home.hero.sub2": "Isto é fingerstyle cinematográfico.",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "Views",
      "home.stats.countries": "Países",
      "home.shows.title": "Próximos <em>shows</em>",
      "home.shows.cta": "TURNÊ COMPLETA",
      "home.story.kicker": "A HISTÓRIA POR TRÁS DO SOM",
      "home.story.title": "Cada nota carrega <em>emoção.</em><br/>Cada silêncio conta uma <em>história.</em>",
      "home.story.body": "Sou o André Cavalcante — um violonista fingerstyle cinematográfico. Misturando técnica clássica, influências flamencas e elementos percussivos modernos, minha música é feita para ser sentida — não apenas ouvida.",
      "home.story.closer": "<em>Eu não apenas toco violão. Eu crio atmosfera.</em>",
      "home.collection.kicker": "A COLEÇÃO",
      "home.collection.title": "MasterTabs &amp; <em>Tablaturas</em>",
      "home.collection.body": "Arranjos fingerstyle cinematográficos e videoaulas completas de estúdio — feitos para serem tocados, estudados e sentidos.",
      "home.collection.cta": "EXPLORAR A COLEÇÃO",
      "home.follow.title": "<em>Siga</em>",

      "shows.tickets": "Ingressos",

      "music.eyebrow": "OUÇA",
      "music.title": "<em>Música</em>",
      "music.featured": "Vídeo em <em>destaque</em>",
      "music.catalog": "Catálogo <em>completo</em>",
      "music.also-on": "<em>Também em</em>",

      "play.eyebrow": "TOQUE JUNTO",
      "play.title": "<em>Músicas</em>",
      "play.sub": "Escolha uma faixa. O afinador já vem na afinação dela.",
      "play.back": "← VOLTAR",
      "play.tuning": "Afinação",
      "play.capo": "Capotraste",
      "play.capo.none": "Sem capo",
      "play.capo.format": "{n}ª casa",

      "tuner.eyebrow": "AFINADOR",
      "tuner.tune-to": "<em>Afinar para</em>",
      "tuner.start": "INICIAR AFINADOR",
      "tuner.stop": "PARAR AFINADOR",
      "tuner.status.idle": "Será solicitado acesso ao microfone.",
      "tuner.status.requesting": "Solicitando microfone…",
      "tuner.status.listening": "Ouvindo — toque qualquer corda.",
      "tuner.status.denied": "Acesso ao microfone negado. Habilite nas configurações do navegador.",
      "tuner.status.error": "Não foi possível acessar o microfone.",

      "metro.eyebrow": "METRÔNOMO",
      "metro.practice-at": "<em>Praticar a</em>",
      "metro.start": "INICIAR METRÔNOMO",
      "metro.stop": "PARAR METRÔNOMO",
      "metro.reset": "VOLTAR AO TEMPO DA MÚSICA",
      "metro.status.idle": "Toque em iniciar para praticar no tempo.",
      "metro.status.running": "Contando em 4/4 — ajuste o tempo para praticar.",

      "song.buy": "COMPRAR A TAB",
      "song.mastertab": "OBTER MASTERTAB",
      "song.tablature": "OBTER TABLATURA SIGNATURE",
      "song.offline": "Offline — reconecte para reproduzir",

      "live.eyebrow": "TURNÊ EUROPEIA 2026",
      "live.title": "A música ganha<br/><em>vida</em> no palco.",
      "live.sub": "Cada apresentação é única. Cada momento, irrepetível.",

      "tabs.eyebrow": "APRENDA",
      "tabs.title": "<em>Cifras</em>",
      "tabs.sub": "A mesma notação que o André usa no estúdio.",
      "tabs.video.kicker": "AS VIDEOAULAS",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "Close-ups filmados em estúdio, passagens em câmera lenta e tablatura completa — compasso a compasso.",
      "tabs.video.cta": "EXPLORAR MASTERTABS",
      "tabs.tab.kicker": "AS TABLATURAS",
      "tabs.tab.title": "Tablaturas <em>Signature</em>",
      "tabs.tab.body": "Notação padrão, tablatura e arquivo Guitar Pro — arranjos cinematográficos colecionáveis.",
      "tabs.tab.cta": "VER TABLATURAS",
      "tabs.from": "A partir de",
      "tabs.purchase-note": "Todas as compras acontecem em",

      "install.eyebrow": "INSTALAR",
      "install.title": "<em>Adicionar à Tela de Início</em>",
      "install.step1": "Toque no ícone <strong>Compartilhar</strong> no Safari.",
      "install.step2": "Escolha <strong>Adicionar à Tela de Início</strong>.",
      "install.step3": "Toque em <strong>Adicionar</strong> para concluir.",
      "install.got-it": "ENTENDI",
      "install.pill": "INSTALAR APP",

      "country.Austria": "Áustria",
      "country.Germany": "Alemanha",
      "country.Netherlands": "Holanda",

      "lang.picker.aria": "Mudar idioma"
    },

    /* ─────────── ESPAÑOL ─────────── */
    es: {
      "meta.description": "App oficial del guitarrista fingerstyle André Cavalcante — música, gira, tablaturas y afinador integrado.",

      "nav.home": "Inicio",
      "nav.music": "Música",
      "nav.tuner": "Afinador",
      "nav.live": "En Vivo",
      "nav.tabs": "Tablaturas",

      "home.eyebrow": "GUITARRISTA FINGERSTYLE",
      "home.hero.sub1": "Esto no es solo guitarra.",
      "home.hero.sub2": "Es fingerstyle cinematográfico.",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "Vistas",
      "home.stats.countries": "Países",
      "home.shows.title": "Próximos <em>conciertos</em>",
      "home.shows.cta": "GIRA COMPLETA",
      "home.story.kicker": "LA HISTORIA DETRÁS DEL SONIDO",
      "home.story.title": "Cada nota lleva <em>emoción.</em><br/>Cada silencio cuenta una <em>historia.</em>",
      "home.story.body": "Soy André Cavalcante — un guitarrista fingerstyle cinematográfico. Mezclando técnica clásica, influencias flamencas y elementos percusivos modernos, mi música está hecha para sentirse — no solo escucharse.",
      "home.story.closer": "<em>No solo toco la guitarra. Creo atmósfera.</em>",
      "home.collection.kicker": "LA COLECCIÓN",
      "home.collection.title": "MasterTabs &amp; <em>Tablaturas</em>",
      "home.collection.body": "Arreglos fingerstyle cinematográficos y videoclases completas de estudio — hechos para tocarse, estudiarse y sentirse.",
      "home.collection.cta": "EXPLORAR LA COLECCIÓN",
      "home.follow.title": "<em>Sígueme</em>",

      "shows.tickets": "Entradas",

      "music.eyebrow": "ESCUCHA",
      "music.title": "<em>Música</em>",
      "music.featured": "Vídeo <em>destacado</em>",
      "music.catalog": "Catálogo <em>completo</em>",
      "music.also-on": "<em>También en</em>",

      "play.eyebrow": "TOCA CONMIGO",
      "play.title": "<em>Canciones</em>",
      "play.sub": "Elige una pista. El afinador ya viene en su afinación.",
      "play.back": "← VOLVER",
      "play.tuning": "Afinación",
      "play.capo": "Cejilla",
      "play.capo.none": "Sin cejilla",
      "play.capo.format": "Traste {n}",

      "tuner.eyebrow": "AFINADOR",
      "tuner.tune-to": "<em>Afinar a</em>",
      "tuner.start": "INICIAR AFINADOR",
      "tuner.stop": "DETENER AFINADOR",
      "tuner.status.idle": "Se solicitará acceso al micrófono.",
      "tuner.status.requesting": "Solicitando micrófono…",
      "tuner.status.listening": "Escuchando — toca cualquier cuerda.",
      "tuner.status.denied": "Acceso al micrófono denegado. Habilítalo en los ajustes del navegador.",
      "tuner.status.error": "No se pudo acceder al micrófono.",

      "metro.eyebrow": "METRÓNOMO",
      "metro.practice-at": "<em>Practicar a</em>",
      "metro.start": "INICIAR METRÓNOMO",
      "metro.stop": "DETENER METRÓNOMO",
      "metro.reset": "VOLVER AL TEMPO ORIGINAL",
      "metro.status.idle": "Toca iniciar para practicar a tiempo.",
      "metro.status.running": "Contando en 4/4 — ajusta el tempo para practicar.",

      "song.buy": "COMPRAR LA TAB",
      "song.mastertab": "OBTENER MASTERTAB",
      "song.tablature": "OBTENER TABLATURA SIGNATURE",
      "song.offline": "Sin conexión — reconéctate para reproducir",

      "live.eyebrow": "GIRA EUROPEA 2026",
      "live.title": "La música cobra<br/><em>vida</em> en el escenario.",
      "live.sub": "Cada actuación es única. Cada momento, irrepetible.",

      "tabs.eyebrow": "APRENDE",
      "tabs.title": "<em>Tablaturas</em>",
      "tabs.sub": "La misma notación que André usa en el estudio.",
      "tabs.video.kicker": "LAS VIDEOCLASES",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "Primeros planos filmados en estudio, repasos en cámara lenta y tablatura completa — compás a compás.",
      "tabs.video.cta": "EXPLORAR MASTERTABS",
      "tabs.tab.kicker": "LAS TABLATURAS",
      "tabs.tab.title": "Tablaturas <em>Signature</em>",
      "tabs.tab.body": "Notación estándar, tablatura y archivo Guitar Pro — arreglos cinematográficos coleccionables.",
      "tabs.tab.cta": "VER TABLATURAS",
      "tabs.from": "Desde",
      "tabs.purchase-note": "Todas las compras se realizan en",

      "install.eyebrow": "INSTALAR",
      "install.title": "<em>Añadir a la Pantalla de Inicio</em>",
      "install.step1": "Toca el icono <strong>Compartir</strong> en Safari.",
      "install.step2": "Elige <strong>Añadir a la Pantalla de Inicio</strong>.",
      "install.step3": "Toca <strong>Añadir</strong> para terminar.",
      "install.got-it": "ENTENDIDO",
      "install.pill": "INSTALAR APP",

      "country.Austria": "Austria",
      "country.Germany": "Alemania",
      "country.Netherlands": "Países Bajos",

      "lang.picker.aria": "Cambiar idioma"
    },

    /* ─────────── DEUTSCH ─────────── */
    de: {
      "meta.description": "Offizielle App des Fingerstyle-Gitarristen André Cavalcante — Musik, Tour, Tabs und ein integriertes Stimmgerät.",

      "nav.home": "Start",
      "nav.music": "Musik",
      "nav.tuner": "Stimmer",
      "nav.live": "Live",
      "nav.tabs": "Tabs",

      "home.eyebrow": "FINGERSTYLE-GITARRIST",
      "home.hero.sub1": "Das ist nicht einfach nur Gitarre.",
      "home.hero.sub2": "Das ist cineastisches Fingerstyle.",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "Aufrufe",
      "home.stats.countries": "Länder",
      "home.shows.title": "<em>Kommende</em> Shows",
      "home.shows.cta": "GESAMTE TOUR",
      "home.story.kicker": "DIE GESCHICHTE HINTER DEM SOUND",
      "home.story.title": "Jede Note trägt <em>Emotion.</em><br/>Jede Stille erzählt eine <em>Geschichte.</em>",
      "home.story.body": "Ich bin André Cavalcante — ein cineastischer Fingerstyle-Gitarrist. Klassische Technik, Flamenco-Einflüsse und moderne perkussive Elemente verschmelzen zu Musik, die gefühlt — nicht nur gehört — werden soll.",
      "home.story.closer": "<em>Ich spiele nicht nur Gitarre. Ich erschaffe Atmosphäre.</em>",
      "home.collection.kicker": "DIE KOLLEKTION",
      "home.collection.title": "MasterTabs &amp; <em>Tablaturen</em>",
      "home.collection.body": "Cineastische Fingerstyle-Arrangements und komplette Studio-Videolektionen — zum Spielen, Studieren und Fühlen.",
      "home.collection.cta": "KOLLEKTION ENTDECKEN",
      "home.follow.title": "<em>Folgen</em>",

      "shows.tickets": "Tickets",

      "music.eyebrow": "HÖREN",
      "music.title": "<em>Musik</em>",
      "music.featured": "<em>Empfohlenes</em> Video",
      "music.catalog": "<em>Gesamter</em> Katalog",
      "music.also-on": "<em>Auch auf</em>",

      "play.eyebrow": "MITSPIELEN",
      "play.title": "<em>Songs</em>",
      "play.sub": "Wähle einen Track. Das Stimmgerät ist auf seine Stimmung voreingestellt.",
      "play.back": "← ZURÜCK",
      "play.tuning": "Stimmung",
      "play.capo": "Kapodaster",
      "play.capo.none": "Kein Kapo",
      "play.capo.format": "{n}. Bund",

      "tuner.eyebrow": "STIMMGERÄT",
      "tuner.tune-to": "<em>Stimmen auf</em>",
      "tuner.start": "STIMMGERÄT STARTEN",
      "tuner.stop": "STIMMGERÄT STOPPEN",
      "tuner.status.idle": "Mikrofonzugriff wird angefragt.",
      "tuner.status.requesting": "Mikrofon wird angefragt…",
      "tuner.status.listening": "Höre zu — spiel eine beliebige Saite.",
      "tuner.status.denied": "Mikrofonzugriff verweigert. Aktiviere ihn in den Browser-Einstellungen.",
      "tuner.status.error": "Mikrofon konnte nicht aufgerufen werden.",

      "metro.eyebrow": "METRONOM",
      "metro.practice-at": "<em>Üben mit</em>",
      "metro.start": "METRONOM STARTEN",
      "metro.stop": "METRONOM STOPPEN",
      "metro.reset": "AUF SONG-TEMPO ZURÜCKSETZEN",
      "metro.status.idle": "Tippe auf Start, um im Takt zu üben.",
      "metro.status.running": "Zählt in 4/4 — passe das Tempo zum Üben an.",

      "song.buy": "TAB KAUFEN",
      "song.mastertab": "MASTERTAB HOLEN",
      "song.tablature": "SIGNATURE-TABLATUR HOLEN",
      "song.offline": "Offline — wieder verbinden zum Abspielen",

      "live.eyebrow": "EUROPATOUR 2026",
      "live.title": "Die Musik erwacht<br/>auf der <em>Bühne</em>.",
      "live.sub": "Jede Performance ist einzigartig. Jeder Moment, unwiederholbar.",

      "tabs.eyebrow": "LERNEN",
      "tabs.title": "<em>Tabs</em>",
      "tabs.sub": "Dieselbe Notation, die André im Studio verwendet.",
      "tabs.video.kicker": "DIE VIDEOLEKTIONEN",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "Studio-Nahaufnahmen, langsame Durchgänge und vollständige Tablatur — Takt für Takt.",
      "tabs.video.cta": "MASTERTABS ENTDECKEN",
      "tabs.tab.kicker": "DIE TABLATUREN",
      "tabs.tab.title": "Signature-<em>Tablaturen</em>",
      "tabs.tab.body": "Standardnotation, Tablatur und Guitar-Pro-Datei — sammelbare cineastische Arrangements.",
      "tabs.tab.cta": "TABLATUREN ANSEHEN",
      "tabs.from": "Ab",
      "tabs.purchase-note": "Alle Käufe erfolgen über",

      "install.eyebrow": "INSTALLIEREN",
      "install.title": "<em>Zum Home-Bildschirm hinzufügen</em>",
      "install.step1": "Tippe in Safari auf das <strong>Teilen</strong>-Symbol.",
      "install.step2": "Wähle <strong>Zum Home-Bildschirm</strong>.",
      "install.step3": "Tippe auf <strong>Hinzufügen</strong>, um abzuschließen.",
      "install.got-it": "VERSTANDEN",
      "install.pill": "APP INSTALLIEREN",

      "country.Austria": "Österreich",
      "country.Germany": "Deutschland",
      "country.Netherlands": "Niederlande",

      "lang.picker.aria": "Sprache ändern"
    },

    /* ─────────── 日本語 ─────────── */
    ja: {
      "meta.description": "フィンガースタイル・ギタリスト André Cavalcante 公式アプリ — 音楽、ツアー、タブ譜、内蔵チューナー。",

      "nav.home": "ホーム",
      "nav.music": "ミュージック",
      "nav.tuner": "チューナー",
      "nav.live": "ライブ",
      "nav.tabs": "タブ譜",

      "home.eyebrow": "フィンガースタイル・ギタリスト",
      "home.hero.sub1": "これは単なるギターではない。",
      "home.hero.sub2": "これはシネマティック・フィンガースタイル。",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "再生数",
      "home.stats.countries": "ヶ国",
      "home.shows.title": "<em>今後の</em>公演",
      "home.shows.cta": "全ツアー",
      "home.story.kicker": "音の背景にある物語",
      "home.story.title": "すべての音に<em>感情</em>が宿る。<br/>すべての沈黙が<em>物語</em>を語る。",
      "home.story.body": "André Cavalcante です — シネマティック・フィンガースタイル・ギタリスト。クラシック技法、フラメンコの影響、現代的なパーカッシブ要素を融合させた音楽は、ただ聴くためではなく、感じるために作られています。",
      "home.story.closer": "<em>私はギターを弾くだけではない。空気をつくる。</em>",
      "home.collection.kicker": "コレクション",
      "home.collection.title": "MasterTabs &amp; <em>タブラチュア</em>",
      "home.collection.body": "シネマティックなフィンガースタイル・アレンジと、スタジオ撮影の本格的ビデオレッスン — 演奏し、学び、感じるためにデザインされています。",
      "home.collection.cta": "コレクションを見る",
      "home.follow.title": "<em>フォロー</em>",

      "shows.tickets": "チケット",

      "music.eyebrow": "聴く",
      "music.title": "<em>ミュージック</em>",
      "music.featured": "<em>注目の</em>動画",
      "music.catalog": "<em>全</em>カタログ",
      "music.also-on": "<em>他のプラットフォーム</em>",

      "play.eyebrow": "一緒に演奏",
      "play.title": "<em>楽曲</em>",
      "play.sub": "曲を選んでください。チューナーはその曲のチューニングに設定されます。",
      "play.back": "← 戻る",
      "play.tuning": "チューニング",
      "play.capo": "カポ",
      "play.capo.none": "なし",
      "play.capo.format": "{n}フレット",

      "tuner.eyebrow": "チューナー",
      "tuner.tune-to": "<em>チューニング先</em>",
      "tuner.start": "チューナー開始",
      "tuner.stop": "チューナー停止",
      "tuner.status.idle": "マイクへのアクセス許可が求められます。",
      "tuner.status.requesting": "マイクをリクエスト中…",
      "tuner.status.listening": "リスニング中 — いずれかの弦を弾いてください。",
      "tuner.status.denied": "マイクへのアクセスが拒否されました。ブラウザの設定で有効にしてください。",
      "tuner.status.error": "マイクにアクセスできませんでした。",

      "metro.eyebrow": "メトロノーム",
      "metro.practice-at": "<em>テンポ</em>",
      "metro.start": "メトロノーム開始",
      "metro.stop": "メトロノーム停止",
      "metro.reset": "曲のテンポに戻す",
      "metro.status.idle": "スタートを押して、テンポに合わせて練習しましょう。",
      "metro.status.running": "4/4 拍子でカウント中 — テンポを調整して練習してください。",

      "song.buy": "タブを購入",
      "song.mastertab": "MASTERTAB を入手",
      "song.tablature": "SIGNATURE タブラチュアを入手",
      "song.offline": "オフライン — 再生するには再接続してください",

      "live.eyebrow": "ヨーロッパツアー 2026",
      "live.title": "音楽はステージで<br/><em>息づく</em>。",
      "live.sub": "すべての公演はユニーク。すべての瞬間は二度と訪れない。",

      "tabs.eyebrow": "学ぶ",
      "tabs.title": "<em>タブ譜</em>",
      "tabs.sub": "André がスタジオで使用するのと同じ記譜法。",
      "tabs.video.kicker": "ビデオレッスン",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "スタジオ撮影のクローズアップ、スローでの解説、完全なタブ譜 — 一小節ずつ。",
      "tabs.video.cta": "MASTERTABS を見る",
      "tabs.tab.kicker": "タブラチュア",
      "tabs.tab.title": "Signature <em>タブラチュア</em>",
      "tabs.tab.body": "標準記譜、タブラチュア、Guitar Pro ファイル — コレクション級のシネマティック・アレンジ。",
      "tabs.tab.cta": "タブラチュアを見る",
      "tabs.from": "From",
      "tabs.purchase-note": "すべてのご購入はこちらから:",

      "install.eyebrow": "インストール",
      "install.title": "<em>ホーム画面に追加</em>",
      "install.step1": "Safari の <strong>共有</strong> アイコンをタップ。",
      "install.step2": "<strong>ホーム画面に追加</strong> を選択。",
      "install.step3": "<strong>追加</strong> をタップして完了。",
      "install.got-it": "わかりました",
      "install.pill": "アプリをインストール",

      "country.Austria": "オーストリア",
      "country.Germany": "ドイツ",
      "country.Netherlands": "オランダ",

      "lang.picker.aria": "言語を変更"
    },

    /* ─────────── 中文 ─────────── */
    zh: {
      "meta.description": "指弹吉他手 André Cavalcante 官方应用 — 音乐、巡演、谱集与内置调音器。",

      "nav.home": "首页",
      "nav.music": "音乐",
      "nav.tuner": "调音器",
      "nav.live": "现场",
      "nav.tabs": "谱集",

      "home.eyebrow": "指弹吉他手",
      "home.hero.sub1": "这不只是吉他。",
      "home.hero.sub2": "这是电影感的指弹艺术。",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "播放",
      "home.stats.countries": "国家",
      "home.shows.title": "<em>即将开演</em>",
      "home.shows.cta": "完整巡演",
      "home.story.kicker": "声音背后的故事",
      "home.story.title": "每一个音符都承载<em>情感。</em><br/>每一段静默都讲述<em>故事。</em>",
      "home.story.body": "我是 André Cavalcante — 一位富有电影感的指弹吉他手。融合古典技法、弗拉门戈影响与现代打击元素,我的音乐是为感受而生 — 而不仅仅是聆听。",
      "home.story.closer": "<em>我不仅弹奏吉他。我创造氛围。</em>",
      "home.collection.kicker": "全套作品",
      "home.collection.title": "MasterTabs &amp; <em>谱集</em>",
      "home.collection.body": "电影感的指弹编曲与全套录影棚视频教学 — 为弹奏、研习与感受而设计。",
      "home.collection.cta": "探索全套作品",
      "home.follow.title": "<em>关注</em>",

      "shows.tickets": "门票",

      "music.eyebrow": "聆听",
      "music.title": "<em>音乐</em>",
      "music.featured": "<em>精选</em>视频",
      "music.catalog": "<em>完整</em>目录",
      "music.also-on": "<em>也可在</em>",

      "play.eyebrow": "一起弹奏",
      "play.title": "<em>曲目</em>",
      "play.sub": "选择一首曲子,调音器会自动调到对应的定弦。",
      "play.back": "← 返回",
      "play.tuning": "定弦",
      "play.capo": "变调夹",
      "play.capo.none": "无",
      "play.capo.format": "第 {n} 品",

      "tuner.eyebrow": "调音器",
      "tuner.tune-to": "<em>调到</em>",
      "tuner.start": "启动调音器",
      "tuner.stop": "停止调音器",
      "tuner.status.idle": "将请求麦克风权限。",
      "tuner.status.requesting": "正在请求麦克风…",
      "tuner.status.listening": "正在聆听 — 弹任意一根弦。",
      "tuner.status.denied": "麦克风权限被拒绝。请在浏览器设置中开启。",
      "tuner.status.error": "无法访问麦克风。",

      "metro.eyebrow": "节拍器",
      "metro.practice-at": "<em>练习速度</em>",
      "metro.start": "启动节拍器",
      "metro.stop": "停止节拍器",
      "metro.reset": "回到曲目原速",
      "metro.status.idle": "点击启动,跟节拍一起练习。",
      "metro.status.running": "4/4 拍计数中 — 调整速度进行练习。",

      "song.buy": "购买谱子",
      "song.mastertab": "获取 MASTERTAB",
      "song.tablature": "获取 SIGNATURE 谱",
      "song.offline": "离线 — 重新联网以播放",

      "live.eyebrow": "2026 欧洲巡演",
      "live.title": "音乐在<br/>舞台上<em>苏醒</em>。",
      "live.sub": "每场演出都独一无二。每个瞬间,都不可复制。",

      "tabs.eyebrow": "学习",
      "tabs.title": "<em>谱集</em>",
      "tabs.sub": "André 在录音棚使用的同款记谱法。",
      "tabs.video.kicker": "视频教学",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "录音棚特写拍摄、慢速演示与完整谱面 — 一小节一小节地讲解。",
      "tabs.video.cta": "探索 MASTERTABS",
      "tabs.tab.kicker": "全部谱集",
      "tabs.tab.title": "Signature <em>谱集</em>",
      "tabs.tab.body": "标准记谱、六线谱与 Guitar Pro 文件 — 值得收藏的电影感编曲。",
      "tabs.tab.cta": "浏览全部谱集",
      "tabs.from": "起售",
      "tabs.purchase-note": "所有购买请前往",

      "install.eyebrow": "安装",
      "install.title": "<em>添加到主屏幕</em>",
      "install.step1": "在 Safari 中点击 <strong>分享</strong> 图标。",
      "install.step2": "选择 <strong>添加到主屏幕</strong>。",
      "install.step3": "点击 <strong>添加</strong> 完成。",
      "install.got-it": "知道了",
      "install.pill": "安装应用",

      "country.Austria": "奥地利",
      "country.Germany": "德国",
      "country.Netherlands": "荷兰",

      "lang.picker.aria": "切换语言"
    },

    /* ─────────── 한국어 ─────────── */
    ko: {
      "meta.description": "핑거스타일 기타리스트 André Cavalcante 공식 앱 — 음악, 투어, 타브, 내장 튜너.",

      "nav.home": "홈",
      "nav.music": "음악",
      "nav.tuner": "튜너",
      "nav.live": "라이브",
      "nav.tabs": "타브",

      "home.eyebrow": "핑거스타일 기타리스트",
      "home.hero.sub1": "이것은 단순한 기타가 아닙니다.",
      "home.hero.sub2": "이것은 시네마틱 핑거스타일입니다.",
      "home.stats.instagram": "Instagram",
      "home.stats.youtube": "YouTube",
      "home.stats.views": "조회수",
      "home.stats.countries": "국가",
      "home.shows.title": "<em>다가오는</em> 공연",
      "home.shows.cta": "전체 투어",
      "home.story.kicker": "사운드 뒤의 이야기",
      "home.story.title": "모든 음에는 <em>감정</em>이 담겨 있고<br/>모든 침묵은 <em>이야기</em>를 들려줍니다.",
      "home.story.body": "저는 André Cavalcante입니다 — 시네마틱 핑거스타일 기타리스트. 클래식 기법, 플라멩코의 영향, 현대적인 퍼커시브 요소를 어우른 저의 음악은 단순히 듣는 것이 아닌 — 느끼기 위해 만들어졌습니다.",
      "home.story.closer": "<em>저는 단지 기타를 연주하지 않습니다. 분위기를 만들어냅니다.</em>",
      "home.collection.kicker": "컬렉션",
      "home.collection.title": "MasterTabs &amp; <em>타블러처</em>",
      "home.collection.body": "시네마틱 핑거스타일 편곡과 스튜디오 비디오 레슨 — 연주하고, 공부하고, 느끼기 위해.",
      "home.collection.cta": "컬렉션 둘러보기",
      "home.follow.title": "<em>팔로우</em>",

      "shows.tickets": "티켓",

      "music.eyebrow": "감상",
      "music.title": "<em>음악</em>",
      "music.featured": "<em>추천</em> 영상",
      "music.catalog": "<em>전체</em> 카탈로그",
      "music.also-on": "<em>다른 플랫폼</em>",

      "play.eyebrow": "함께 연주",
      "play.title": "<em>곡 목록</em>",
      "play.sub": "곡을 선택하세요. 튜너가 해당 곡의 튜닝으로 설정됩니다.",
      "play.back": "← 뒤로",
      "play.tuning": "튜닝",
      "play.capo": "카포",
      "play.capo.none": "없음",
      "play.capo.format": "{n}프렛",

      "tuner.eyebrow": "튜너",
      "tuner.tune-to": "<em>튜닝</em>",
      "tuner.start": "튜너 시작",
      "tuner.stop": "튜너 정지",
      "tuner.status.idle": "마이크 접근 권한이 요청됩니다.",
      "tuner.status.requesting": "마이크 요청 중…",
      "tuner.status.listening": "듣는 중 — 아무 줄이나 튕겨 보세요.",
      "tuner.status.denied": "마이크 접근이 거부되었습니다. 브라우저 설정에서 허용해 주세요.",
      "tuner.status.error": "마이크에 접근할 수 없습니다.",

      "metro.eyebrow": "메트로놈",
      "metro.practice-at": "<em>연습 템포</em>",
      "metro.start": "메트로놈 시작",
      "metro.stop": "메트로놈 정지",
      "metro.reset": "곡 템포로 되돌리기",
      "metro.status.idle": "시작을 눌러 박자에 맞춰 연습하세요.",
      "metro.status.running": "4/4 박자로 카운트 중 — 템포를 조정해 연습하세요.",

      "song.buy": "타브 구매",
      "song.mastertab": "MASTERTAB 받기",
      "song.tablature": "SIGNATURE 타블러처 받기",
      "song.offline": "오프라인 — 재생하려면 다시 연결하세요",

      "live.eyebrow": "2026 유럽 투어",
      "live.title": "음악이 무대 위에서<br/><em>살아납니다</em>.",
      "live.sub": "모든 공연은 유일무이합니다. 모든 순간은 다시 오지 않습니다.",

      "tabs.eyebrow": "배우기",
      "tabs.title": "<em>타브</em>",
      "tabs.sub": "André가 스튜디오에서 사용하는 동일한 표기법.",
      "tabs.video.kicker": "비디오 레슨",
      "tabs.video.title": "MasterTab <em>Experience</em>",
      "tabs.video.body": "스튜디오 클로즈업, 느린 해설, 완전한 타블러처 — 마디 단위로.",
      "tabs.video.cta": "MASTERTABS 둘러보기",
      "tabs.tab.kicker": "타블러처",
      "tabs.tab.title": "Signature <em>타블러처</em>",
      "tabs.tab.body": "표준 표기법, 타블러처, Guitar Pro 파일 — 소장가치 있는 시네마틱 편곡.",
      "tabs.tab.cta": "타블러처 보기",
      "tabs.from": "From",
      "tabs.purchase-note": "모든 구매는 여기에서 진행됩니다:",

      "install.eyebrow": "설치",
      "install.title": "<em>홈 화면에 추가</em>",
      "install.step1": "Safari에서 <strong>공유</strong> 아이콘을 탭하세요.",
      "install.step2": "<strong>홈 화면에 추가</strong>를 선택하세요.",
      "install.step3": "<strong>추가</strong>를 탭해 완료합니다.",
      "install.got-it": "확인",
      "install.pill": "앱 설치",

      "country.Austria": "오스트리아",
      "country.Germany": "독일",
      "country.Netherlands": "네덜란드",

      "lang.picker.aria": "언어 변경"
    }
  };

  /* ─────────── Core ─────────── */

  let current = DEFAULT;

  function detect() {
    try {
      const saved = localStorage.getItem("lang");
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (_) {}
    const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : DEFAULT;
  }

  function t(key, params) {
    let str = (dict[current] && dict[current][key]);
    if (str == null) str = dict[DEFAULT][key];
    if (str == null) return key;
    if (!params) return str;
    return String(str).replace(/\{(\w+)\}/g, (_, k) =>
      params[k] != null ? params[k] : ""
    );
  }

  function ordinalEn(n) {
    const v = n % 100;
    if (v >= 11 && v <= 13) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // Format a capo position for the current language.
  function capoText(n) {
    if (!n) return t("play.capo.none");
    if (current === "en") {
      return t("play.capo.format", { n, ord: ordinalEn(n) });
    }
    return t("play.capo.format", { n });
  }

  function applyToDOM(root) {
    root = root || document;

    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      // Some strings carry inline <em>/<strong>/<br>; preserve them via innerHTML.
      if (/[<>]/.test(val)) el.innerHTML = val;
      else el.textContent = val;
    });

    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // Format: "attr:key;attr2:key2"
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    // Always sync the <html lang> and the meta description.
    document.documentElement.lang = current;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.description"));
  }

  function set(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT;
    current = lang;
    try { localStorage.setItem("lang", lang); } catch (_) {}
    applyToDOM();
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } }));
  }

  function get() { return current; }
  function supported() { return SUPPORTED.slice(); }
  function meta(lang) { return LANG_META[lang || current]; }

  // Initialise as early as possible — before DOMContentLoaded if scripts are
  // parser-blocking, otherwise on DOM ready. Either way, lang attribute is set
  // immediately so layout-affecting CSS doesn't flash the wrong language.
  current = detect();
  document.documentElement.lang = current;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyToDOM());
  } else {
    applyToDOM();
  }

  window.__i18n = {
    t,
    set,
    get,
    supported,
    meta,
    capoText,
    apply: applyToDOM,
    LANG_META
  };
})();
