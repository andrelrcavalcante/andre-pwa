/* André Cavalcante PWA — practice metronome
   Web Audio API with a lookahead scheduler for sample-accurate timing.
   Each song carries its own BPM; the player can slow it down to practice. */

(() => {
  "use strict";

  const Metronome = (() => {
    const LOOKAHEAD_MS = 25;        // how often the scheduler wakes up
    const SCHEDULE_AHEAD_S = 0.12;  // how far ahead notes are scheduled
    const BEATS_PER_BAR = 4;
    const MIN_BPM = 30;
    const MAX_BPM = 280;

    let els = {};
    let audio = null;
    let bpm = 100;
    let songBpm = 100;
    let running = false;
    let currentBeat = 0;
    let nextNoteTime = 0;
    let timerId = null;
    let holdTimer = null;

    function tt(key) { return window.__i18n ? window.__i18n.t(key) : key; }

    function cacheDOM() {
      els.section = document.getElementById("metronome");
      els.bpm     = document.getElementById("metro-bpm");
      els.tempo   = document.getElementById("metro-song-tempo");
      els.toggle  = document.getElementById("metro-toggle");
      els.dec     = document.getElementById("metro-dec");
      els.inc     = document.getElementById("metro-inc");
      els.dots    = document.getElementById("metro-dots");
      els.reset   = document.getElementById("metro-reset");
      els.status  = document.getElementById("metro-status");
    }

    function renderDots() {
      els.dots.innerHTML = "";
      for (let i = 0; i < BEATS_PER_BAR; i++) {
        const d = document.createElement("span");
        d.className = "metro-dot";
        els.dots.appendChild(d);
      }
    }

    function setBpm(value) {
      bpm = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(value)));
      if (els.bpm) els.bpm.textContent = bpm;
      if (els.reset) els.reset.hidden = bpm === songBpm;
    }

    function setSongBpm(value) {
      songBpm = value && value > 0 ? value : 100;
      if (els.tempo) els.tempo.textContent = songBpm + " BPM";
      setBpm(songBpm);
    }

    function highlightDot(beat) {
      const dots = els.dots.querySelectorAll(".metro-dot");
      dots.forEach((d, i) => d.classList.toggle("is-on", i === beat));
    }

    function scheduleClick(beat, time) {
      const accent = beat === 0;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "sine";
      osc.frequency.value = accent ? 1600 : 920;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(accent ? 0.6 : 0.34, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
      osc.connect(gain).connect(audio.destination);
      osc.start(time);
      osc.stop(time + 0.05);

      const delayMs = Math.max(0, (time - audio.currentTime) * 1000);
      setTimeout(() => { if (running) highlightDot(beat); }, delayMs);
    }

    function scheduler() {
      while (nextNoteTime < audio.currentTime + SCHEDULE_AHEAD_S) {
        scheduleClick(currentBeat, nextNoteTime);
        nextNoteTime += 60 / bpm;
        currentBeat = (currentBeat + 1) % BEATS_PER_BAR;
      }
      timerId = setTimeout(scheduler, LOOKAHEAD_MS);
    }

    async function start() {
      if (running) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audio) audio = new Ctx();
      if (audio.state === "suspended") await audio.resume();

      running = true;
      currentBeat = 0;
      nextNoteTime = audio.currentTime + 0.08;
      els.section.classList.add("is-running");
      els.toggle.textContent = tt("metro.stop");
      els.status.textContent = tt("metro.status.running");
      scheduler();
    }

    function stop() {
      running = false;
      if (timerId) clearTimeout(timerId);
      timerId = null;
      if (els.section) {
        els.section.classList.remove("is-running");
        els.toggle.textContent = tt("metro.start");
        els.status.textContent = tt("metro.status.idle");
        els.dots.querySelectorAll(".metro-dot").forEach((d) => d.classList.remove("is-on"));
      }
    }

    function onI18nChange() {
      if (!els.section) return;
      if (running) {
        els.toggle.textContent = tt("metro.stop");
        els.status.textContent = tt("metro.status.running");
      } else {
        els.toggle.textContent = tt("metro.start");
        els.status.textContent = tt("metro.status.idle");
      }
    }

    // Press-and-hold to ramp the tempo quickly.
    function bindHold(btn, delta) {
      const step = () => setBpm(bpm + delta);
      const begin = (e) => {
        e.preventDefault();
        step();
        let speed = 220;
        const tick = () => {
          step();
          speed = Math.max(45, speed - 25);
          holdTimer = setTimeout(tick, speed);
        };
        holdTimer = setTimeout(tick, 380);
      };
      const end = () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
      btn.addEventListener("pointerdown", begin);
      btn.addEventListener("pointerup", end);
      btn.addEventListener("pointerleave", end);
      btn.addEventListener("pointercancel", end);
    }

    function init() {
      cacheDOM();
      if (!els.section) return;
      renderDots();
      els.toggle.addEventListener("click", () => (running ? stop() : start()));
      els.reset.addEventListener("click", () => setBpm(songBpm));
      bindHold(els.dec, -1);
      bindHold(els.inc, +1);
      document.addEventListener("i18n:change", onI18nChange);
    }

    return { init, stop, setSongBpm };
  })();

  window.__metronome = Metronome;
})();
