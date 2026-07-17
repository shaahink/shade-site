/* Two small things, no dependencies:
   1. Home — the name casts a shadow that answers the cursor
      (the cursor is the light; سایه falls the other way).
   2. Project 03 — a quiet custom video player. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- shadow play (home) ---------- */

  var name = document.querySelector("[data-shade]");
  if (name) {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var raf = null;

    var cast = function (dx, dy) {
      var d = Math.hypot(dx, dy) || 1;
      var k = Math.min(d / 340, 1);              // how far the light is, 0..1
      var len = 5 + 21 * k;                      // shadow grows as light recedes
      name.style.setProperty("--sx", ((-dx / d) * len).toFixed(1) + "px");
      name.style.setProperty("--sy", ((-dy / d) * len).toFixed(1) + "px");
      name.style.setProperty("--sb", (6 + 24 * k).toFixed(1) + "px");
      name.style.setProperty("--so", (0.26 - 0.12 * k).toFixed(3));
    };

    if (!reduced && fine) {
      window.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = name.getBoundingClientRect();
          cast(e.clientX - (r.left + r.width / 2),
               e.clientY - (r.top + r.height / 2));
        });
      }, { passive: true });
    } else if (!reduced) {
      // no cursor: the light drifts by itself, slow as an afternoon
      var t0 = performance.now();
      var drift = function (t) {
        var a = (t - t0) / 9000;
        cast(Math.cos(a) * 300, Math.sin(a) * 300 - 120);
        requestAnimationFrame(drift);
      };
      requestAnimationFrame(drift);
    }
  }

  /* ---------- video player (project 03) ---------- */

  var player = document.querySelector("[data-player]");
  if (player) {
    var video = player.querySelector("video");
    var big   = player.querySelector(".p-big");
    var play  = player.querySelector(".p-play");
    var seek  = player.querySelector(".p-seek");
    var time  = player.querySelector(".p-time");
    var mute  = player.querySelector(".p-mute");
    var full  = player.querySelector(".p-full");

    var ICON = {
      play:  '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M3 1l11 7-11 7z"/></svg>',
      pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M3 1h4v14H3zM9 1h4v14H9z"/></svg>',
      sound: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M1 5h3l4-4v14l-4-4H1z"/><path fill="none" stroke="currentColor" stroke-width="1.4" d="M10.5 5c1.6 1.6 1.6 4.4 0 6"/></svg>',
      muted: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M1 5h3l4-4v14l-4-4H1z"/><path fill="none" stroke="currentColor" stroke-width="1.4" d="M10 6l4 4m0-4l-4 4"/></svg>',
      full:  '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4"/></svg>'
    };
    full.innerHTML = ICON.full;

    var fmt = function (s) {
      if (!isFinite(s)) return "0:00";
      s = Math.round(s);
      return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
    };

    var paint = function () {
      var playing = !video.paused && !video.ended;
      player.classList.toggle("playing", playing);
      play.innerHTML = playing ? ICON.pause : ICON.play;
      play.setAttribute("aria-label", playing ? "Pause" : "Play");
      mute.innerHTML = video.muted ? ICON.muted : ICON.sound;
      mute.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
    };

    var tick = function () {
      var d = video.duration;
      time.textContent = fmt(video.currentTime) + " / " + fmt(d);
      if (isFinite(d) && d > 0) {
        var pct = (video.currentTime / d) * 100;
        seek.value = pct;
        seek.style.backgroundSize = pct + "% 100%";
      }
    };

    var toggle = function () { video.paused || video.ended ? video.play() : video.pause(); };

    big.addEventListener("click", toggle);
    play.addEventListener("click", toggle);
    video.addEventListener("click", toggle);
    video.addEventListener("play", paint);
    video.addEventListener("pause", paint);
    video.addEventListener("ended", paint);
    video.addEventListener("timeupdate", tick);
    video.addEventListener("loadedmetadata", tick);

    seek.addEventListener("input", function () {
      if (isFinite(video.duration)) {
        video.currentTime = (seek.value / 100) * video.duration;
        seek.style.backgroundSize = seek.value + "% 100%";
      }
    });

    mute.addEventListener("click", function () {
      video.muted = !video.muted;
      paint();
    });

    full.addEventListener("click", function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();   // iOS Safari
      }
    });

    paint();
    tick();
  }
})();
