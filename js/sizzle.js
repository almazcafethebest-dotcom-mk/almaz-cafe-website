/* A short "sizzle" sound synthesized entirely in the browser with the Web
   Audio API — filtered white noise, like a kebab hitting a hot grill.
   No audio file is used (avoids any licensing question entirely), and
   nothing plays until the visitor explicitly clicks the toggle. */
(function () {
  let ctx = null;
  let playing = false;
  let stopFn = null;

  function ensureContext() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function startSizzle() {
    const audioCtx = ensureContext();
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 3200;
    bandpass.Q.value = 0.6;

    const gain = audioCtx.createGain();
    gain.gain.value = 0;

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
    gain.gain.linearRampToValueAtTime(0.09, audioCtx.currentTime + 0.4);

    // Gentle random flutter so it reads as a sizzle, not a flat hiss
    const flutter = setInterval(() => {
      const now = audioCtx.currentTime;
      gain.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.07, now + 0.15);
    }, 180);

    stopFn = () => {
      clearInterval(flutter);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      setTimeout(() => noise.stop(), 350);
    };
  }

  function init() {
    const btn = document.getElementById("sizzle-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      playing = !playing;
      btn.classList.toggle("playing", playing);
      btn.querySelector(".sizzle-label").textContent = playing ? "Sizzle sound on" : "Hear it sizzle";
      if (playing) {
        startSizzle();
      } else if (stopFn) {
        stopFn();
      }
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
