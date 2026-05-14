/* André Cavalcante PWA — app shell
   Tabs, data loading, song detail wiring, PWA install flow. */

(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    tab: "home",
    songs: [],
    shows: [],
    currentSong: null,
    deferredInstall: null
  };

  /* ─────────── Tab navigation ─────────── */

  function goTo(tab) {
    if (tab === state.tab && tab !== "play") return;
    state.tab = tab;

    $$(".tab").forEach((el) => {
      const isActive = el.dataset.tab === tab;
      el.hidden = !isActive;
    });
    $$(".nav-item").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.go === tab);
    });

    if (tab === "play") {
      $("#play-list-view").hidden = false;
      $("#play-detail-view").hidden = true;
      if (window.__tuner) window.__tuner.stop();
      if (window.__metronome) window.__metronome.stop();
      stopSongVideo();
    }

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    history.replaceState(null, "", `#${tab}`);
  }

  function bindNav() {
    $$("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => goTo(btn.dataset.go));
    });
  }

  /* ─────────── Data loading ─────────── */

  async function loadJSON(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
  }

  function formatShowDate(iso) {
    const d = new Date(iso + "T20:00:00");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = d.toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase();
    return { day, month };
  }

  function renderShowsPreview() {
    const ul = $("#home-shows");
    if (!ul) return;
    ul.innerHTML = state.shows.slice(0, 4).map((s) => {
      const { day, month } = formatShowDate(s.date);
      return `
        <li class="show-row">
          <div class="show-row__date"><strong>${day}</strong><span>${month}</span></div>
          <div class="show-row__place">
            ${s.city}
            <small>${s.country} · ${s.venue}</small>
          </div>
          <a class="show-row__cta" href="${s.ticketUrl}" target="_blank" rel="noopener">Tickets</a>
        </li>
      `;
    }).join("");
  }

  function renderLiveShows() {
    const ul = $("#live-shows");
    if (!ul) return;
    ul.innerHTML = state.shows.map((s) => {
      const { day, month } = formatShowDate(s.date);
      return `
        <li class="show-card">
          <div class="show-card__date"><strong>${day}</strong><span>${month} 2026</span></div>
          <div class="show-card__place">
            ${s.city}
            <small>${s.country} · ${s.venue}</small>
          </div>
          <a class="show-card__cta" href="${s.ticketUrl}" target="_blank" rel="noopener">Tickets</a>
        </li>
      `;
    }).join("");
  }

  // YouTube thumbnail for a video id; hqdefault is 4:3 — cover-cropped to 16:9 in CSS.
  function ytThumb(id) {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  function renderSongs() {
    const ul = $("#song-list");
    if (!ul) return;
    ul.innerHTML = state.songs.map((s) => {
      const thumb = s.youtubeId ? ytThumb(s.youtubeId) : s.cover;
      return `
      <li class="song-row" data-song-id="${s.id}">
        <img class="song-row__cover" src="${thumb}" alt="" loading="lazy"
             onerror="this.style.visibility='hidden'"/>
        <div class="song-row__main">
          <h3 class="song-row__title"><em>${s.title}</em></h3>
          <p class="song-row__meta"><b>${s.tuningLabel}</b>${s.capo ? " · CAPO " + s.capo : ""} · ${s.bpm} BPM</p>
        </div>
        <span class="song-row__arrow">→</span>
      </li>`;
    }).join("");

    $$(".song-row").forEach((row) => {
      row.addEventListener("click", () => openSong(row.dataset.songId));
      // YouTube serves a 120×90 grey placeholder for unavailable videos —
      // detect it and fall back to the product cover.
      const img = row.querySelector(".song-row__cover");
      const song = state.songs.find((s) => s.id === row.dataset.songId);
      img.addEventListener("load", () => {
        if (img.naturalWidth <= 120 && song.cover && !img.src.includes(song.cover)) {
          img.src = song.cover;
        }
      });
    });
  }

  /* ─────────── Song detail + tuner ─────────── */

  // Builds the video area: a lightweight facade that swaps in the YouTube
  // iframe only when tapped. Offline → just the thumbnail. No video id →
  // falls back to the product cover image.
  function renderSongVideo(song) {
    const wrap = $("#song-video");
    if (!wrap) return;
    const id = song.youtubeId;

    if (!id) {
      wrap.innerHTML = song.cover
        ? `<img class="song-video__img" src="${song.cover}" alt="${song.title}"/>`
        : "";
      return;
    }

    const thumb = ytThumb(id);

    if (navigator.onLine === false) {
      wrap.innerHTML = `
        <div class="song-video__facade is-offline">
          <img class="song-video__img" src="${thumb}" alt="${song.title}"/>
          <span class="song-video__overlay"></span>
          <span class="song-video__badge">Offline — reconnect to play</span>
        </div>`;
      return;
    }

    wrap.innerHTML = `
      <button class="song-video__facade" type="button" aria-label="Play ${song.title} on YouTube">
        <img class="song-video__img" src="${thumb}" alt="${song.title}"/>
        <span class="song-video__overlay"></span>
        <span class="song-video__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      </button>`;

    // If the video is unavailable (YouTube returns a 120×90 placeholder),
    // drop the player and show the product cover instead.
    wrap.querySelector(".song-video__img").addEventListener("load", function () {
      if (this.naturalWidth <= 120) {
        wrap.innerHTML = song.cover
          ? `<img class="song-video__img" src="${song.cover}" alt="${song.title}"/>`
          : "";
      }
    });

    wrap.querySelector(".song-video__facade").addEventListener("click", () => {
      wrap.innerHTML = `
        <div class="song-video__frame">
          <iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1"
                  title="${song.title}"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowfullscreen loading="lazy"></iframe>
        </div>`;
    });
  }

  function stopSongVideo() {
    const wrap = $("#song-video");
    if (wrap) wrap.innerHTML = "";
  }

  function openSong(id) {
    const song = state.songs.find((s) => s.id === id);
    if (!song) return;
    state.currentSong = song;

    const ordinal = (n) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th") + " fret";

    $("#song-title").textContent = song.title;
    $("#song-tuning-eyebrow").textContent = song.tuningLabel;
    $("#song-tuning").textContent = song.tuningLabel;
    $("#song-capo").textContent = song.capo ? ordinal(song.capo) : "None";

    renderSongVideo(song);

    const metaEl = $("#song-meta-line");
    if (metaEl) metaEl.textContent = song.meta || "";

    $("#tuner-tuning-name").textContent = song.tuningLabel;
    const noteEl = $("#tuner-note-line");
    if (noteEl) {
      noteEl.textContent = song.tuningNote || "";
      noteEl.hidden = !song.tuningNote;
    }

    $("#song-buy").href = song.masterTabUrl;
    $("#song-mastertab").href = song.masterTabUrl;
    $("#song-tablature").href = song.tablatureUrl;

    $("#play-list-view").hidden = true;
    $("#play-detail-view").hidden = false;
    window.scrollTo(0, 0);

    if (window.__tuner) window.__tuner.setTuning(song.strings);
    if (window.__metronome) window.__metronome.setSongBpm(song.bpm);
  }

  function bindSongDetail() {
    $("#song-back").addEventListener("click", () => {
      if (window.__tuner) window.__tuner.stop();
      if (window.__metronome) window.__metronome.stop();
      stopSongVideo();
      $("#play-list-view").hidden = false;
      $("#play-detail-view").hidden = true;
      window.scrollTo(0, 0);
    });

    // Coming back online while a facade is still showing — upgrade it to playable.
    window.addEventListener("online", () => {
      const wrap = $("#song-video");
      if (state.currentSong && wrap && !$("#play-detail-view").hidden
          && !wrap.querySelector(".song-video__frame")) {
        renderSongVideo(state.currentSong);
      }
    });
  }

  /* ─────────── PWA install ─────────── */

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function setupAndroidInstall() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      state.deferredInstall = e;
      const pill = $("#install-pill");
      pill.hidden = false;
      pill.onclick = async () => {
        pill.hidden = true;
        state.deferredInstall.prompt();
        await state.deferredInstall.userChoice;
        state.deferredInstall = null;
      };
    });
    window.addEventListener("appinstalled", () => {
      $("#install-pill").hidden = true;
    });
  }

  function setupIOSModal() {
    const KEY = "ios-install-seen";
    if (!isIOS() || isStandalone() || localStorage.getItem(KEY)) return;

    setTimeout(() => {
      const modal = $("#ios-install-modal");
      if (!modal) return;
      modal.hidden = false;
      $("#ios-install-close").addEventListener("click", () => {
        modal.hidden = true;
        localStorage.setItem(KEY, "1");
      });
    }, 4000);
  }

  /* ─────────── Service worker ─────────── */

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch((err) => {
        console.warn("SW registration failed:", err);
      });
    });
  }

  /* ─────────── Init ─────────── */

  async function init() {
    bindNav();
    bindSongDetail();
    setupAndroidInstall();
    setupIOSModal();
    registerSW();

    try {
      const [songs, shows] = await Promise.all([
        loadJSON("/data/songs.json"),
        loadJSON("/data/shows.json")
      ]);
      state.songs = songs;
      state.shows = shows;
      renderShowsPreview();
      renderLiveShows();
      renderSongs();
    } catch (err) {
      console.error("Data load failed:", err);
    }

    const hash = (location.hash || "").replace("#", "");
    if (["home", "music", "play", "live", "tabs"].includes(hash)) goTo(hash);

    if (window.__tuner) window.__tuner.init();
    if (window.__metronome) window.__metronome.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
