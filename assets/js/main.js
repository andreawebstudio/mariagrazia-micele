(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var CFG = window.SITE_CONFIG || {};
  var EMAIL = "micelemariagrazia@gmail.com";
  var PHONE = "+39 333 673 1263";
  var MOBILE_NAV = 1023;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Anno dinamico ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header: ombra allo scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }

  /* ---------- Menu burger (solo mobile/tablet) ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  function setNav(open) {
    if (!toggle || !header) return;
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > MOBILE_NAV) setNav(false); });
  }

  /* ---------- Voce di menu attiva ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  if ("IntersectionObserver" in window && navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Fade-in ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- COME FUNZIONA: timeline che si disegna allo scroll ---------- */
  var proc = document.getElementById("process");
  var track = proc && proc.querySelector(".process-track");
  var steps = proc ? Array.prototype.slice.call(proc.querySelectorAll(".pstep")) : [];

  function layoutTrack() {
    if (!proc || !track || steps.length < 2) return;
    var pr = proc.getBoundingClientRect();
    var a = steps[0].querySelector(".pstep-mark").getBoundingClientRect();
    var b = steps[steps.length - 1].querySelector(".pstep-mark").getBoundingClientRect();
    var vertical = Math.abs(a.left - b.left) < 4;
    proc.classList.toggle("is-vertical", vertical);
    if (vertical) {
      track.style.left = (a.left + a.width / 2 - pr.left - 1) + "px";
      track.style.right = "auto";
      track.style.top = (a.top + a.height / 2 - pr.top) + "px";
      track.style.bottom = "auto";
      track.style.width = "2px";
      track.style.height = (b.top - a.top) + "px";
    } else {
      track.style.top = (a.top + a.height / 2 - pr.top - 1) + "px";
      track.style.bottom = "auto";
      track.style.left = (a.left + a.width / 2 - pr.left) + "px";
      track.style.right = "auto";
      track.style.height = "2px";
      track.style.width = (b.left - a.left) + "px";
    }
  }

  function updateProcess() {
    if (!proc || !steps.length) return;
    var p;
    if (reduceMotion) {
      p = 1;
    } else {
      var r = proc.getBoundingClientRect();
      var vh = window.innerHeight;
      if (proc.classList.contains("is-vertical")) {
        p = (vh * 0.62 - (r.top + 48)) / Math.max(1, r.height - 96);
      } else {
        p = (vh * 0.85 - r.top) / (vh * 0.45);
      }
      p = Math.max(0, Math.min(1, p));
    }
    proc.style.setProperty("--p", p.toFixed(4));
    var last = -1;
    steps.forEach(function (s, i) {
      var on = p >= (i / (steps.length - 1)) - 0.02;
      s.classList.toggle("is-active", on);
      if (on) last = i;
    });
    steps.forEach(function (s, i) { s.classList.toggle("is-current", i === last && p < 0.999); });
  }

  /* ---------- APPROCCIO: linea sinuosa che si disegna allo scroll ---------- */
  var flow = document.getElementById("flow");
  var flowSteps = flow ? Array.prototype.slice.call(flow.querySelectorAll(".flow-step")) : [];
  function updateFlow() {
    if (!flow) return;
    var p = 1;
    if (!reduceMotion) {
      var r = flow.getBoundingClientRect();
      p = (window.innerHeight * 0.62 - r.top) / Math.max(1, r.height);
      p = Math.max(0, Math.min(1, p));
    }
    flow.style.setProperty("--fp", p.toFixed(4));
    flowSteps.forEach(function (s, i) {
      s.classList.toggle("is-on", p >= (i + 0.5) / flowSteps.length);
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScrollHeader(); updateProcess(); updateFlow(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { layoutTrack(); updateProcess(); updateFlow(); });
  window.addEventListener("load", function () { layoutTrack(); updateProcess(); updateFlow(); });
  layoutTrack(); onScrollHeader(); updateProcess(); updateFlow();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("is-open", !open);
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.setAttribute("aria-hidden", String(open));
    });
  });

  /* ---------- Modulo contatti ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector("button[type=submit]");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(field, msg) {
      var input = form.elements[field];
      var err = document.getElementById(field + "-error");
      if (!input) return;
      if (msg) { input.setAttribute("aria-invalid", "true"); } else { input.removeAttribute("aria-invalid"); }
      if (err) err.textContent = msg || "";
    }
    function showStatus(type, html) {
      status.className = "form-status is-visible is-" + type;
      status.innerHTML = html;
      status.focus();
    }
    function validate() {
      var ok = true, first = null;
      var nome = form.elements.nome.value.trim();
      var email = form.elements.email.value.trim();
      var tel = form.elements.telefono.value.trim();
      var msg = form.elements.messaggio.value.trim();
      var priv = form.elements.privacy.checked;

      function check(name, cond, text) {
        if (!cond) { setError(name, text); ok = false; if (!first) first = form.elements[name]; }
        else setError(name, "");
      }
      check("nome", nome.length >= 3, "Inserisci nome e cognome.");
      check("email", emailRe.test(email), "Inserisci un indirizzo email valido.");
      check("telefono", !tel || /^[+\d][\d\s().-]{5,}$/.test(tel), "Inserisci un numero di telefono valido oppure lascia il campo vuoto.");
      check("messaggio", msg.length >= 10, "Scrivi un breve messaggio (almeno 10 caratteri).");
      check("privacy", priv, "Per inviare la richiesta è necessario prendere visione dell'informativa privacy.");
      if (first) first.focus();
      return ok;
    }

    ["nome", "email", "telefono", "messaggio"].forEach(function (n) {
      form.elements[n].addEventListener("blur", function () {
        if (form.elements[n].getAttribute("aria-invalid") === "true") validate();
      });
    });

    var fallback = 'Puoi scrivermi direttamente a <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> oppure chiamare il <a href="tel:+393336731263">' + PHONE + '</a>.';

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      if (form.elements._gotcha && form.elements._gotcha.value) return; // bot
      if (!validate()) return;

      var endpoint = CFG.form && CFG.form.endpoint;
      if (!endpoint) {
        showStatus("error", "<strong>Il modulo online non è ancora attivo</strong> e la tua richiesta non è stata inviata. " + fallback);
        return;
      }

      var data = {
        nome: form.elements.nome.value.trim(),
        email: form.elements.email.value.trim(),
        telefono: form.elements.telefono.value.trim(),
        sede: form.elements.sede ? form.elements.sede.value : "",
        messaggio: form.elements.messaggio.value.trim(),
        consenso_privacy: "Sì",
        _subject: CFG.form.oggetto,
        subject: CFG.form.oggetto,
        from_name: "Sito Mariagrazia Micele"
      };
      if (CFG.form.accessKey) data.access_key = CFG.form.accessKey;

      submitBtn.disabled = true;
      var label = submitBtn.textContent;
      submitBtn.textContent = "Invio in corso…";

      var ctrl = "AbortController" in window ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok || body.success === false || body.ok === false) {
            throw new Error((body && body.message) || ("HTTP " + res.status));
          }
          return body;
        });
      }).then(function () {
        form.reset();
        showStatus("success", "<strong>Grazie, la tua richiesta è stata inviata.</strong> Ti risponderò il prima possibile ai recapiti che hai indicato.");
      }).catch(function () {
        showStatus("error", "<strong>Non è stato possibile inviare la richiesta.</strong> Riprova tra qualche minuto. " + fallback);
      }).then(function () {
        if (timer) clearTimeout(timer);
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      });
    });
  }
})();
