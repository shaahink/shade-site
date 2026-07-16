/* Lightbox for gallery pages + tiny niceties. Vanilla JS, no deps. */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(document.querySelectorAll(".gallery a.g"));
  if (!links.length) return;

  // Build lightbox skeleton once
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML =
    '<figure>' +
    '  <img alt="">' +
    '  <figcaption></figcaption>' +
    '</figure>' +
    '<span class="lb-count" aria-hidden="true"></span>' +
    '<button class="lb-close" aria-label="Close (Esc)">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous image">&larr;</button>' +
    '<button class="lb-next" aria-label="Next image">&rarr;</button>';
  document.body.appendChild(lb);

  var img = lb.querySelector("img");
  var cap = lb.querySelector("figcaption");
  var count = lb.querySelector(".lb-count");
  var current = -1;
  var lastFocus = null;

  function show(i) {
    current = (i + links.length) % links.length;
    var a = links[current];
    img.src = a.getAttribute("href");
    img.alt = a.dataset.cap || "";
    cap.textContent = a.dataset.cap || "";
    count.textContent = (current + 1) + " / " + links.length;
    // Preload neighbours for snappy arrows
    [current + 1, current - 1].forEach(function (n) {
      var pre = new Image();
      pre.src = links[(n + links.length) % links.length].getAttribute("href");
    });
  }

  function open(i) {
    lastFocus = document.activeElement;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    show(i);
    lb.querySelector(".lb-close").focus();
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    img.src = "";
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      open(i);
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });

  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.tagName === "FIGURE") close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      // keep focus inside the dialog
      var focusables = lb.querySelectorAll("button");
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });

  // Swipe support
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });
})();
