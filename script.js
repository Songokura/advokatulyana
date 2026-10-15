/* Сайт адвоката Цисневич У. А. Ванильный JS: плиты и ступенчатая кромка, меню, якоря, ленты, форма. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };

  /* ---------- WhatsApp: текст собирается в момент клика (фаза захвата на window, совместимо с LeadBot) ---------- */
  var WA_NUM = "77018222129";
  var WA = {
    "default": "Здравствуйте, Ульяна Андреевна! Пишу с сайта. Нужна консультация.",
    sticky: "Здравствуйте, Ульяна Андреевна! Пишу с сайта. Моя ситуация: ",
    kontakty: "Здравствуйте, Ульяна Андреевна! Пишу с сайта. Моя ситуация: ",
    konsult: "Здравствуйте! Хочу записаться на консультацию (5 000 тг). Моя ситуация: ",
    online: "Здравствуйте! Хочу записаться на онлайн-консультацию. Город и ситуация: ",
    ugolov: "Здравствуйте! Нужна помощь адвоката по уголовному делу. Моя ситуация: ",
    grazhd: "Здравствуйте! Нужна помощь адвоката по гражданскому делу. Моя ситуация: ",
    admin: "Здравствуйте! Нужна помощь по административному делу. Моя ситуация: ",
    sud: "Здравствуйте! Нужно представительство в суде. Моя ситуация: ",
    sledstvie: "Здравствуйте! Нужно участие адвоката в следственных действиях. Моя ситуация: ",
    iski: "Здравствуйте! Нужно составить иск, жалобу или обращение. Моя ситуация: ",
    obzhal: "Здравствуйте! Хочу обжаловать решение суда или приговор. Моя ситуация: ",
    prava: "Здравствуйте! Вопрос по лишению водительских прав. Моя ситуация: ",
    semya: "Здравствуйте! Нужна консультация по семейному спору. Моя ситуация: "
  };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var text = WA[key] || WA["default"];
    a.setAttribute("href", "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- fitText для заголовка героя ---------- */
  var h1 = doc.getElementById("h1");
  function fitText() {
    if (!h1) return;
    var l2 = h1.querySelector(".l2");
    var avail = h1.clientWidth;
    if (!avail || !l2) return;
    h1.style.removeProperty("--fs");
    var fs = parseFloat(getComputedStyle(l2).fontSize);
    var guard = 0;
    while (guard++ < 30 && l2.scrollWidth > avail + 1 && fs > 22) {
      fs *= 0.95; h1.style.setProperty("--fs", fs + "px");
    }
  }

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
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 320);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 70; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Плиты и ступени ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var firstSec = doc.querySelector("main > .sec");
  var sticky = doc.getElementById("sticky"), zay = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;
  var last = {};

  function setVar(el, key, name, val) {
    var k = key + name;
    if (last[k] === val) return;
    last[k] = val; el.style.setProperty(name, val);
  }

  function update() {
    ticking = false;
    var H = W.innerHeight;
    var rects = pws.map(function (el) { return el.getBoundingClientRect(); });
    var secTop = firstSec ? firstSec.getBoundingClientRect().top : null;
    var zayTop = zay ? zay.getBoundingClientRect().top : null;
    var pageY = W.pageYOffset;
    for (var i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i];
      var isHero = pw.classList.contains("pw-hero");
      /* плиты вне экрана не считаем */
      if (r.bottom < -H && !isHero) continue;
      if (r.top > H * 2) break;
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H + 2 ? clamp(-r.top / (r.height - H)) : 0;
      var nxtTop = i + 1 < pws.length ? rects[i + 1].top : secTop;
      var exit = nxtTop !== null ? clamp(1 - nxtTop / H) : 0;
      setVar(pw, i, "--enter", enter.toFixed(4));
      setVar(pw, i, "--stay", stay.toFixed(4));
      setVar(pw, i, "--exit", exit.toFixed(4));
      if (isHero) {
        setVar(pw, i, "--intro", easeOut(INTRO).toFixed(4));
      } else {
        /* кадр открывается ступенями, когда плита въехала почти наполовину */
        var open = REDUCED ? 1 : smooth((enter - 0.42) / 0.5);
        setVar(pw, i, "--open", open.toFixed(4));
      }
      var plate = pw.firstElementChild;
      if (plate) plate.classList.toggle("gone", exit >= 1);
      var txts = pw.querySelectorAll(".txt");
      for (var k = 0; k < txts.length; k++) txts[k].classList.toggle("on", isHero ? INTRO > 0.25 : enter > 0.68);
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (zayTop !== null && zayTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) {
      hdr.classList.toggle("scrolled", pageY > 12);
      var probe = doc.elementFromPoint(Math.min(W.innerWidth - 1, 24), HDR() + 2);
      var themed = probe && probe.closest ? probe.closest("[data-theme]") : null;
      hdr.classList.toggle("on-light", !!(themed && themed.getAttribute("data-theme") === "light"));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  var lastW = W.innerWidth;
  W.addEventListener("resize", function () {
    if (W.innerWidth === lastW) { onScroll(); return; }
    lastW = W.innerWidth; fitText(); onScroll(); updateRails();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1300);
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Ленты со стрелками ---------- */
  var rails = [].slice.call(doc.querySelectorAll(".rail"));
  function railStep(rail) {
    var card = rail.firstElementChild; if (!card) return 300;
    var cs = getComputedStyle(rail);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }
  function updateRail(rail) {
    var btns = doc.querySelectorAll('.arr[data-for="' + rail.id + '"]');
    var max = rail.scrollWidth - rail.clientWidth;
    var none = max <= 1;
    [].forEach.call(btns, function (b) {
      b.hidden = none;
      var dir = +b.getAttribute("data-dir");
      b.disabled = dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2;
    });
  }
  function updateRails() { rails.forEach(updateRail); }
  rails.forEach(function (rail) {
    rail.addEventListener("scroll", function () { updateRail(rail); }, { passive: true });
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); rail.scrollBy({ left: railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); rail.scrollBy({ left: -railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
    });
  });
  [].forEach.call(doc.querySelectorAll(".arr[data-for]"), function (b) {
    b.addEventListener("click", function () {
      var rail = doc.getElementById(b.getAttribute("data-for")); if (!rail) return;
      rail.scrollBy({ left: railStep(rail) * (+b.getAttribute("data-dir")), behavior: REDUCED ? "auto" : "smooth" });
    });
  });

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) el.classList.add("in"); }); }, 1500);
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Публикации: открыта одна карточка ---------- */
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
      var lines = ["Заявка с сайта адвоката Цисневич У. А.", "Имя: " + name, "Телефон: " + phone];
      if (f.message.value.trim()) lines.push("Ситуация: " + f.message.value.trim());
      var url = "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(lines.join("\n"));
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    fitText();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
    updateRails();
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitText(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
