/* Сайт адвоката Цисневич У. А. Ванильный JS: меню, выпадающий список, шапка, липкая панель, форма. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 240);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest && e.target.closest('a[href*="#"]')) setMenu(false); });

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
  /* цель якоря из адреса видна сразу */
  if (location.hash.length > 1) {
    var t = doc.getElementById(location.hash.slice(1));
    if (t) [].forEach.call(t.querySelectorAll(".rv"), function (el) { el.classList.add("in"); });
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
  update();
})();
