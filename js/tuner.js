/* André Cavalcante PWA — guitar tuner
   Web Audio API + YIN-style pitch detection.
   Works with any custom tuning — each song passes its own 6 strings
   as note names (e.g. "C2", "F#3"); frequencies are derived here.
   Detection range covers B1 (~62 Hz) up through E4 and beyond. */

(() => {
  "use strict";

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Fallback tuning used before any song is selected.
  const DEFAULT_TUNING = ["E2", "A2", "D3", "G3", "B3", "E4"];

  /* ─────────── Note helpers ─────────── */

  // "C2" / "F#3" / "D#4"  →  { name, octave, freq }
  function parseNote(token) {
    const m = /^([A-G]#?)(-?\d)$/.exec(String(token).trim());
    if (!m) return { name: "?", octave: 0, freq: 0 };
    const name = m[1];
    const octave = parseInt(m[2], 10);
    const idx = NOTE_NAMES.indexOf(name);
    const midi = (octave + 1) * 12 + idx;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    return { name, octave, freq };
  }

  function freqToNote(f) {
    const semis = 12 * Math.log2(f / 440);
    const rounded = Math.round(semis);
    const cents = (semis - rounded) * 100;
    const midi = 69 + rounded;
    const name = NOTE_NAMES[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    return { name, octave, cents, midi };
  }

  function rms(buffer) {
    let s = 0;
    for (let i = 0; i < buffer.length; i++) s += buffer[i] * buffer[i];
    return Math.sqrt(s / buffer.length);
  }

  /* ─────────── Pitch detection (YIN) ─────────── */

  let yinBuffer = null;

  function detectPitch(buffer, sampleRate) {
    const N = buffer.length;
    const W = N >> 1;
    if (!yinBuffer || yinBuffer.length !== W) yinBuffer = new Float32Array(W);

    // 1) Difference function.
    yinBuffer[0] = 1;
    for (let tau = 1; tau < W; tau++) {
      let sum = 0;
      for (let i = 0; i < W; i++) {
        const d = buffer[i] - buffer[i + tau];
        sum += d * d;
      }
      yinBuffer[tau] = sum;
    }

    // 2) Cumulative mean normalized difference.
    let runningSum = 0;
    for (let tau = 1; tau < W; tau++) {
      runningSum += yinBuffer[tau];
      yinBuffer[tau] = yinBuffer[tau] * tau / runningSum;
    }

    // 3) Absolute-threshold search — wide enough for a low B1 (~62 Hz).
    const tauMin = Math.max(2, Math.floor(sampleRate / 520));   // ≤ 520 Hz
    const tauMax = Math.min(W - 1, Math.floor(sampleRate / 56)); // ≥ 56 Hz
    // Lenient enough to lock onto the thin, harmonic-heavy treble strings,
    // whose periodicity dip is shallower than the bass strings'.
    const threshold = 0.24;

    let tauEstimate = -1;
    for (let tau = tauMin; tau <= tauMax; tau++) {
      if (yinBuffer[tau] < threshold) {
        while (tau + 1 <= tauMax && yinBuffer[tau + 1] < yinBuffer[tau]) tau++;
        tauEstimate = tau;
        break;
      }
    }
    if (tauEstimate === -1) return { freq: -1, clarity: 0 };

    // 4) Parabolic interpolation for sub-sample precision.
    const x0 = tauEstimate < 1 ? tauEstimate : tauEstimate - 1;
    const x2 = tauEstimate + 1 < W ? tauEstimate + 1 : tauEstimate;
    let betterTau;
    if (x0 === tauEstimate) {
      betterTau = yinBuffer[tauEstimate] <= yinBuffer[x2] ? tauEstimate : x2;
    } else if (x2 === tauEstimate) {
      betterTau = yinBuffer[tauEstimate] <= yinBuffer[x0] ? tauEstimate : x0;
    } else {
      const s0 = yinBuffer[x0];
      const s1 = yinBuffer[tauEstimate];
      const s2 = yinBuffer[x2];
      const denom = 2 * (2 * s1 - s2 - s0);
      betterTau = denom === 0 ? tauEstimate : tauEstimate + (s2 - s0) / denom;
    }

    return {
      freq: sampleRate / betterTau,
      clarity: 1 - yinBuffer[tauEstimate]
    };
  }

  /* ─────────── Tuner controller ─────────── */

  const TunerUI = (() => {
    let els = {};
    let strings = DEFAULT_TUNING.map(parseNote); // [{name, octave, freq}, ...]
    let audio = null;
    let stream = null;
    let analyser = null;
    let timeBuffer = null;
    let rafId = null;
    let listening = false;
    let centsEMA = 0;
    let freqEMA = 0;
    let lastDetectionAt = 0;

    function cacheDOM() {
      els.note    = document.getElementById("tuner-note");
      els.freq    = document.getElementById("tuner-freq");
      els.cents   = document.getElementById("tuner-cents");
      els.needle  = document.getElementById("tuner-needle");
      els.strings = document.getElementById("tuner-strings");
      els.toggle  = document.getElementById("tuner-toggle");
      els.status  = document.getElementById("tuner-status");
      els.tuner   = document.getElementById("tuner");
    }

    function renderStrings() {
      els.strings.innerHTML = strings.map((s, i) => `
        <li class="tuner__string" data-idx="${i}" data-freq="${s.freq.toFixed(2)}">
          <span class="tuner__string-note">${s.name}<sub>${s.octave}</sub></span>
          <span class="tuner__string-hz">${s.freq.toFixed(1)} Hz</span>
        </li>
      `).join("");
    }

    // Accepts an array of note tokens (["C2","G2",...]) or a single note string.
    function setTuning(tuning) {
      const tokens = Array.isArray(tuning) ? tuning : DEFAULT_TUNING;
      strings = (tokens.length === 6 ? tokens : DEFAULT_TUNING).map(parseNote);
      renderStrings();
      resetDisplay();
    }

    function resetDisplay() {
      els.note.textContent = "—";
      els.note.classList.remove("is-ok", "is-flat", "is-sharp");
      els.freq.textContent = "0.0";
      els.cents.textContent = "+0";
      els.needle.style.left = "50%";
      els.strings.querySelectorAll(".tuner__string").forEach((n) => n.classList.remove("is-target"));
    }

    function nearestStringIndex(freq) {
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < strings.length; i++) {
        const dist = Math.abs(1200 * Math.log2(freq / strings[i].freq));
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      }
      // Highlight only when within ~250 cents (2.5 semitones) of a target.
      return bestDist <= 250 ? bestIdx : -1;
    }

    function updateDisplay(freq, cents, name, octave, freshAttack) {
      // On a fresh note attack (or the first reading) snap straight to the
      // detected value so the note appears instantly; otherwise smooth lightly
      // so the needle stays steady without lagging.
      if (freshAttack || !freqEMA) {
        freqEMA = freq;
        centsEMA = cents;
      } else {
        freqEMA  = freqEMA  * 0.5 + freq  * 0.5;
        centsEMA = centsEMA * 0.5 + cents * 0.5;
      }

      els.note.textContent = name + (octave != null ? `${octave}` : "");
      els.freq.textContent = freqEMA.toFixed(1);
      const c = Math.round(centsEMA);
      els.cents.textContent = (c >= 0 ? "+" : "") + c;

      els.note.classList.toggle("is-ok",    Math.abs(c) <= 5);
      els.note.classList.toggle("is-flat",  c < -5);
      els.note.classList.toggle("is-sharp", c > 5);

      const pct = Math.max(0, Math.min(100, 50 + centsEMA));
      els.needle.style.left = pct + "%";

      const idx = nearestStringIndex(freqEMA);
      els.strings.querySelectorAll(".tuner__string").forEach((n, i) => {
        n.classList.toggle("is-target", i === idx);
      });
    }

    function frame() {
      if (!listening) return;
      analyser.getFloatTimeDomainData(timeBuffer);

      // Low gate so the quiet tail of a ringing/decaying string still gets
      // analysed — the YIN threshold is the real arbiter of a real pitch.
      const level = rms(timeBuffer);
      if (level >= 0.0022) {
        const { freq, clarity } = detectPitch(timeBuffer, audio.sampleRate);
        if (freq > 54 && freq < 1200 && clarity > 0.5) {
          const note = freqToNote(freq);
          const now = performance.now();
          // A gap since the last lock means a new string was struck — snap to it.
          const freshAttack = now - lastDetectionAt > 180;
          updateDisplay(freq, note.cents, note.name, note.octave, freshAttack);
          lastDetectionAt = now;
        }
      }

      // Hold the last reading on screen for a good while after the string
      // fades — a tuner has to stay readable while you turn the peg, not
      // blink away the instant the attack loses energy.
      if (lastDetectionAt && performance.now() - lastDetectionAt > 2600) {
        resetDisplay();
        freqEMA = 0;
        centsEMA = 0;
        lastDetectionAt = 0;
      }

      rafId = requestAnimationFrame(frame);
    }

    async function start() {
      if (listening) return;
      try {
        els.status.textContent = "Requesting microphone…";
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            // On: lets the mic boost weak treble strings so you don't have to
            // hold the phone against the guitar. Pitch detection is amplitude-
            // independent, so this doesn't affect tuning accuracy.
            autoGainControl: true
          }
        });

        const Ctx = window.AudioContext || window.webkitAudioContext;
        audio = new Ctx();
        if (audio.state === "suspended") await audio.resume();

        const src = audio.createMediaStreamSource(stream);
        analyser = audio.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0;
        timeBuffer = new Float32Array(analyser.fftSize);
        src.connect(analyser);

        listening = true;
        els.tuner.classList.add("is-listening");
        els.toggle.textContent = "STOP TUNER";
        els.status.textContent = "Listening — play any string.";
        rafId = requestAnimationFrame(frame);
      } catch (err) {
        console.error(err);
        els.status.textContent =
          err && err.name === "NotAllowedError"
            ? "Microphone access denied. Enable it in your browser settings."
            : "Could not access the microphone.";
      }
    }

    function stop() {
      listening = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
      if (audio) {
        try { audio.close(); } catch (_) {}
        audio = null;
      }
      analyser = null;
      timeBuffer = null;
      freqEMA = 0;
      centsEMA = 0;
      lastDetectionAt = 0;
      if (els.tuner) {
        els.tuner.classList.remove("is-listening");
        els.toggle.textContent = "START TUNER";
        els.status.textContent = "Microphone access will be requested.";
        resetDisplay();
      }
    }

    function init() {
      cacheDOM();
      if (!els.tuner) return;
      renderStrings();
      els.toggle.addEventListener("click", () => {
        if (listening) stop(); else start();
      });
    }

    return { init, setTuning, start, stop };
  })();

  window.__tuner = TunerUI;
})();
