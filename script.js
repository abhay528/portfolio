/* Abhay Jadon — Portfolio */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Project imagery (fetched data-URI text files) ---------- */
  [
    ["img-ids", "assets/ids.txt"],
    ["img-auth", "assets/auth.txt"],
    ["img-filecomp", "assets/filecomp.txt"],
    ["img-phish", "assets/phish.txt"],
    ["img-vuln", "assets/vuln.txt"],
    ["img-pass", "assets/pass.txt"],
  ].forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    if (!el || !window.fetch) return;
    fetch(pair[1])
      .then(function (res) {
        return res.ok ? res.text() : Promise.reject(res.status);
      })
      .then(function (text) {
        el.src = text.replace(/\s+/g, "");
      })
      .catch(function () {});
  });

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Typewriter ---------- */
  var words = [
    "Software Engineer",
    "Full-Stack Developer",
    "Security Enthusiast",
    "ML Builder",
  ];
  var typedEl = document.getElementById("typed");

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = words[0];
    } else {
      var wordIndex = 0;
      var charIndex = words[0].length;
      var deleting = true;

      // Start by deleting the SSR word for a clean loop.
      setTimeout(tick, 900);

      function tick() {
        var word = words[wordIndex];
        if (deleting) {
          charIndex--;
          if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        } else {
          charIndex++;
          if (charIndex === words[wordIndex].length) {
            deleting = true;
            typedEl.textContent = words[wordIndex];
            setTimeout(tick, 1700);
            return;
          }
        }
        typedEl.textContent = words[wordIndex].slice(0, charIndex);
        setTimeout(tick, deleting ? 38 : 68);
      }
    }
  }

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  var nav = document.getElementById("siteNav");
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Starfield ---------- */
  var canvas = document.getElementById("stars");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (prefersReducedMotion) draw(0);
    }

    function seed() {
      var count = Math.min(160, Math.floor((width * height) / 9000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.4 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.05,
          violet: Math.random() < 0.3,
        });
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var alpha = 0.25 + 0.55 * Math.abs(Math.sin(time / 1600 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.violet
          ? "rgba(201, 162, 255, " + alpha + ")"
          : "rgba(255, 255, 255, " + alpha * 0.8 + ")";
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -4) {
          s.y = height + 4;
          s.x = Math.random() * width;
        }
      }
    }

    function loop(time) {
      draw(time);
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    if (!prefersReducedMotion) requestAnimationFrame(loop);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
