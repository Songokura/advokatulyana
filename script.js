/* Сайт адвоката Цисневич У. А. - «Свод законов». Меню, шапка, форма, Lenis + GSAP: интро полок, полёт кодекса, сцены прокрутки. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lenis = null;

  /* ---------- WhatsApp: текст собирается в момент клика (фаза захвата на window, совместимо с LeadBot) ---------- */
  var WA_NUM = "77018222129";
  var WA = {
    "default": "Здравствуйте, Ульяна Андреевна! Пишу с сайта. Нужна консультация.",
    sticky: "Здравствуйте, Ульяна Андреевна! Пишу с сайта. Моя ситуация: ",
    kontakty: "Здравствуйте, Ульяна Андреевна! Хочу записаться на приём. Моя ситуация: ",
    ugolov: "Здравствуйте! Нужна помощь адвоката по уголовному делу. Моя ситуация: ",
    grazhd: "Здравствуйте! Нужна помощь адвоката по гражданскому делу. Моя ситуация: ",
    admin: "Здравствуйте! Нужна помощь по административному делу. Моя ситуация: ",
    gos: "Здравствуйте! Нужна защита прав в споре с государственным органом. Моя ситуация: ",
    obzhal: "Здравствуйте! Хочу обжаловать судебный акт. Моя ситуация: ",
    konst: "Здравствуйте! Вопрос по конституционной защите прав. Моя ситуация: ",
    praktika: "Здравствуйте, Ульяна Андреевна! Пишу с сайта. Моя ситуация: ",
    publik: "Здравствуйте, Ульяна Андреевна! Прочитал(а) разъяснения на сайте. Мой вопрос: ",
    stoimost: "Здравствуйте! Хочу узнать стоимость юридической помощи по моему делу. Ситуация: "
  };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var text = WA[a.getAttribute("data-wa")] || WA["default"];
    a.setAttribute("href", "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add("open"); }); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 400);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest && e.target.closest('a[href*="#"]')) setMenu(false); });
  [].forEach.call(doc.querySelectorAll(".menu-in > a"), function (a, i) { a.style.transitionDelay = (0.04 + i * 0.03) + "s"; });

  /* ---------- Выпадающий список «Направления» ---------- */
  var dd = doc.querySelector(".dd"), ddBtn = dd ? dd.querySelector(".dd-btn") : null, ddTimer = 0;
  function setDd(open) {
    if (!dd) return;
    clearTimeout(ddTimer);
    dd.classList.toggle("open", open);
    ddBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (dd) {
    ddBtn.addEventListener("click", function () { setDd(!dd.classList.contains("open")); });
    dd.addEventListener("mouseenter", function () { if (W.matchMedia("(hover:hover)").matches) setDd(true); });
    dd.addEventListener("mouseleave", function () { if (W.matchMedia("(hover:hover)").matches) ddTimer = setTimeout(function () { setDd(false); }, 160); });
    dd.addEventListener("focusout", function (e) { if (!dd.contains(e.relatedTarget)) setDd(false); });
    doc.addEventListener("click", function (e) { if (!dd.contains(e.target)) setDd(false); });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (doc.body.classList.contains("menu-open")) setMenu(false, true);
    if (dd && dd.classList.contains("open")) { setDd(false); ddBtn.focus(); }
  });

  /* ---------- Шапка и липкая панель ---------- */
  var hdr = doc.getElementById("hdr"), sticky = doc.getElementById("sticky"), zapis = doc.getElementById("zapis");
  var ticking = false;
  function update() {
    ticking = false;
    var H = W.innerHeight, y = W.pageYOffset;
    if (hdr) {
      hdr.classList.toggle("scrolled", y > 12);
      var hh = hdr.offsetHeight;
      var probe = doc.elementFromPoint(Math.min(W.innerWidth - 1, 24), hh + 2);
      var themed = probe && probe.closest ? probe.closest("[data-theme]") : null;
      hdr.classList.toggle("on-light", !!(themed && themed.getAttribute("data-theme") === "light"));
    }
    if (sticky) {
      var show = y > H * 0.5;
      if (zapis && zapis.getBoundingClientRect().top < H * 0.6 && zapis.getBoundingClientRect().bottom > 0) show = false;
      sticky.classList.toggle("show", show);
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", onScroll);

  /* ---------- Мягкое проявление блоков ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) el.classList.add("in"); }); }, 1200);
  } else rv.forEach(function (el) { el.classList.add("in"); });
  if (location.hash.length > 1) {
    var t0 = doc.getElementById(location.hash.slice(1));
    if (t0) [].forEach.call(t0.querySelectorAll(".rv"), function (el) { el.classList.add("in"); });
  }

  /* ---------- Разъяснения: на телефоне открыта одна карточка ---------- */
  var posts = [].slice.call(doc.querySelectorAll(".post details"));
  posts.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open && W.innerWidth <= 900) posts.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("zayavka"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badName = !name, badPhone = phone.replace(/\D/g, "").length < 10;
      f.name.classList.toggle("bad", badName); f.phone.classList.toggle("bad", badPhone);
      f.name.setAttribute("aria-invalid", badName ? "true" : "false"); f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badName || badPhone) { if (ferr) ferr.hidden = false; (badName ? f.name : f.phone).focus(); return; }
      if (ferr) ferr.hidden = true;
      var lines = ["Заявка с сайта адвоката Цисневич У. А.", "Страница: " + doc.title.split(" - ")[0], "Имя: " + name, "Телефон: " + phone];
      if (f.message.value.trim()) lines.push("Ситуация: " + f.message.value.trim());
      W.open("https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Герой: книги встают на полку, ниша раскрывается ---------- */
  var hero = doc.querySelector(".hero");
  if (hero) {
    [].forEach.call(hero.querySelectorAll(".bk-l"), function (b, i) { b.style.setProperty("--i", i); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add("ready"); }); });
    setTimeout(function () { hero.classList.add("done"); W.dispatchEvent(new Event("hero:done")); }, REDUCED ? 0 : 2300);
    if ("IntersectionObserver" in W) {
      new IntersectionObserver(function (es) { hero.classList.toggle("off", !es[0].isIntersecting); }).observe(hero);
    }
  }
  /* обложки на телефоне приоткрываются в центре экрана */
  if ("IntersectionObserver" in W && W.matchMedia("(hover: none)").matches) {
    var pk = new IntersectionObserver(function (es) {
      es.forEach(function (x) { x.target.classList.toggle("peek", x.isIntersecting); });
    }, { rootMargin: "-42% 0px -42% 0px" });
    [].forEach.call(doc.querySelectorAll(".dc"), function (el) { pk.observe(el); });
  }

  update();

  /* ---------- GSAP + Lenis ---------- */
  function motion() {
    var gsap = W.gsap, ST = W.ScrollTrigger;
    if (!gsap || !ST || REDUCED) return;
    gsap.registerPlugin(ST);
    if (W.SplitText) gsap.registerPlugin(W.SplitText);
    var EASE = "power3.out";

    if (W.Lenis) {
      lenis = new W.Lenis({ duration: 1.15, easing: function (t) { return 1 - Math.pow(1 - t, 3.2); }, anchors: false });
      lenis.on("scroll", ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      root.classList.add("lenis");
      doc.addEventListener("click", function (e) {
        var a = e.target.closest ? e.target.closest('a[href*="#"]') : null;
        if (!a || e.defaultPrevented) return;
        var url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        var tgt = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!tgt) return;
        e.preventDefault();
        setMenu(false);
        lenis.scrollTo(tgt, { offset: -(hdr ? hdr.offsetHeight : 70) - 8 });
        history.pushState(null, "", url.hash);
      });
    }

    /* заголовки секций: строки поднимаются из-под маски */
    function splitHeads() {
      if (!W.SplitText) return;
      gsap.utils.toArray("h2.split").forEach(function (h) {
        var s = W.SplitText.create(h, { type: "lines", mask: "lines", linesClass: "ln" });
        gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
      });
    }
    (doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve()).then(splitHeads);

    /* герой: параллакс планов */
    if (hero) {
      var stH = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".ly-far", { yPercent: 9, ease: "none", scrollTrigger: stH });
      gsap.to(".ly-niche", { y: function () { return W.innerHeight * 0.1; }, ease: "none", scrollTrigger: stH });
      gsap.to(".hero-txt", { y: -60, opacity: 0.25, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom 20%", scrub: true } });
    }

    /* полёт кодекса: корешок УК РК выезжает из ряда, разворачивается обложкой и ложится первой карточкой направлений */
    var slot = doc.querySelector(".fly-slot"), fly = doc.querySelector(".b3-fly"), card = doc.querySelector(".dc .cover");
    var cards = gsap.utils.toArray(".dc");
    var restCards = cards;
    if (hero && slot && fly && card) {
      restCards = cards.slice(1);
      var geo = {};
      var measure = function () {
        var hr = hero.getBoundingClientRect(), sr = slot.getBoundingClientRect(), cr = card.getBoundingClientRect();
        var bt = sr.width, bh = sr.height, bw = Math.round(bh * 0.75);
        fly.style.setProperty("--bt", bt + "px"); fly.style.setProperty("--bh", bh + "px"); fly.style.setProperty("--bw", bw + "px");
        fly.style.left = (sr.left - hr.left + bt / 2 - bw / 2) + "px";
        fly.style.top = (sr.top - hr.top) + "px";
        geo.dx = (cr.left + cr.width / 2) - (sr.left + sr.width / 2);
        geo.dy = (cr.top + cr.height / 2) - (sr.top + sr.height / 2);
        geo.sx = cr.width / bw; geo.sy = cr.height / bh;
        /* на телефоне текст героя стоит под сценой: книга проходит за текстовым блоком, а не поверх строк */
        var layer = fly.parentNode, txt = hero.querySelector(".hero-txt");
        if (layer && txt && W.innerWidth <= 900) {
          var tr = txt.getBoundingClientRect(), t = tr.top - hr.top - 80, b = tr.bottom - hr.top + 16;
          var m = "linear-gradient(to bottom,#000 " + (t - 70) + "px,transparent " + t + "px,transparent " + b + "px,#000 " + (b + 70) + "px)";
          /* маска действует только в границах слоя: слой тянем вниз, центр перспективы держим прежним */
          layer.style.bottom = "-2400px"; layer.style.perspectiveOrigin = "50% " + Math.round(hr.height * 0.3) + "px";
          layer.style.webkitMaskImage = m; layer.style.maskImage = m;
        } else if (layer) { layer.style.webkitMaskImage = ""; layer.style.maskImage = ""; layer.style.bottom = ""; layer.style.perspectiveOrigin = ""; }
      };
      var flightTl = null;
      var build = function () {
        measure();
        hero.classList.add("fly-on");
        flightTl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", endTrigger: card, end: "center 60%", scrub: 1.2, invalidateOnRefresh: true, onRefreshInit: measure }
        });
        flightTl
          .to(fly, { x: function () { return Math.min(26, geo.dx * 0.05); }, y: -14, scale: 1.08, duration: 0.12, ease: "power2.out" }, 0)
          .to(fly, { "--ry": "0deg", duration: 0.42, ease: "power1.inOut" }, 0.1)
          .to(fly, { x: function () { return geo.dx; }, y: function () { return geo.dy; }, scaleX: function () { return geo.sx; }, scaleY: function () { return geo.sy; }, duration: 0.8, ease: "power2.inOut" }, 0.12)
          .fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.07, ease: "none", immediateRender: true }, 0.9)
          .to(fly, { opacity: 0, duration: 0.06, ease: "none" }, 0.93);
        ST.refresh();
      };
      if (hero.classList.contains("done")) build(); else W.addEventListener("hero:done", build, { once: true });
    }

    /* остальные обложки поднимаются на полку */
    if (restCards.length) {
      gsap.set(restCards, { opacity: 0, y: 70, rotateX: -10, transformPerspective: 1200, transformOrigin: "50% 100%" });
      ST.batch(restCards, { start: "top 90%", once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: EASE, stagger: 0.1 }); } });
    }

    /* стопка книг сдвигается при прокрутке */
    gsap.utils.toArray(".stack").forEach(function (st) {
      gsap.utils.toArray(st.querySelectorAll(".sb")).forEach(function (b, i) {
        gsap.fromTo(b, { x: (i % 2 ? -1 : 1) * (26 + i * 4) }, { x: 0, ease: "none", scrollTrigger: { trigger: st, start: "top 95%", end: "center 45%", scrub: true } });
      });
    });

    /* цитата: тиснение рамки и проявление слов */
    gsap.utils.toArray(".sec-quote").forEach(function (sec) {
      var rects = sec.querySelectorAll(".q-frame rect");
      gsap.fromTo(rects, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.15, scrollTrigger: { trigger: sec, start: "top 85%", end: "center 55%", scrub: true } });
      gsap.from(sec.querySelectorAll(".qc"), { scale: 0, rotate: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.08, scrollTrigger: { trigger: sec, start: "top 60%", once: true } });
      var q = sec.querySelector(".q");
      if (q && W.SplitText) {
        var s = W.SplitText.create(q, { type: "words", wordsClass: "w" });
        gsap.fromTo(s.words, { opacity: 0.12 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: q, start: "top 85%", end: "bottom 50%", scrub: true } });
      }
    });

    /* шаги: золотая линия и узлы */
    gsap.utils.toArray(".steps-wrap").forEach(function (sw) {
      var line = sw.querySelector(".steps-line span"), lis = sw.querySelectorAll(".steps li");
      ST.create({
        trigger: sw, start: "top 75%", end: "bottom 55%", scrub: true,
        onUpdate: function (s) {
          if (line) line.style.setProperty("--p", s.progress.toFixed(3));
          [].forEach.call(lis, function (li, i) { li.classList.toggle("on", s.progress >= i / lis.length + 0.02); });
        }
      });
      if (line) line.style.setProperty("--p", "0");
    });

    /* внутренние страницы: книги достаются с полки и поворачиваются обложкой */
    gsap.utils.toArray(".vitr").forEach(function (sh) {
      var books = sh.querySelectorAll(".b3-show");
      gsap.from(books, { "--ry": "90deg", y: -40, opacity: 0, duration: 1.6, ease: "power3.inOut", stagger: 0.2, delay: 0.25 });
      gsap.to(sh, { rotateY: 6, y: 40, transformOrigin: "50% 100%", ease: "none", scrollTrigger: { trigger: sh, start: "top 30%", end: "bottom top", scrub: true } });
    });
    gsap.utils.toArray(".pm-niche .niche").forEach(function (n) {
      gsap.from(n.querySelector(".niche-in"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", delay: 0.2 });
      gsap.from(n.querySelector(".niche-line"), { clipPath: "inset(100% -2px 0% -2px)", duration: 1.8, ease: "power3.inOut", delay: 0.5 });
    });
    gsap.utils.toArray(".b3-side").forEach(function (b, i) {
      gsap.fromTo(b, { "--ry": "84deg" }, { "--ry": (i % 2 ? "40deg" : "22deg"), ease: "none", scrollTrigger: { trigger: b.closest(".lst-grid"), start: "top 85%", end: "bottom 45%", scrub: true } });
    });
    gsap.utils.toArray(".phero-far, .far-wrap").forEach(function (f) {
      gsap.to(f, { yPercent: 10, ease: "none", scrollTrigger: { trigger: f.parentNode, start: "top top", end: "bottom top", scrub: true } });
    });

    W.addEventListener("load", function () { ST.refresh(); });
  }
  if (doc.readyState === "complete" || doc.readyState === "interactive") motion();
  else doc.addEventListener("DOMContentLoaded", motion);
})();
