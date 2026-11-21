/* Tezera docs site: navbar behaviour. Linked from every page by tools/build-site.py.
   Desktop: group buttons open dropdowns (disclosure pattern, click or keyboard).
   Phone (<= 860px): the "Docs" button opens one grouped panel.
   Light / dark switch: the choice is stored in localStorage ("tz-theme") and
   applied in <head> by an inline script before the first paint, so pages never
   flash the wrong theme. With no stored choice the site follows the system. */
(function () {
  var root = document.documentElement;
  var nav = document.querySelector("[data-tz-nav]");
  if (!nav) return;
  var toggle = nav.querySelector(".tz-nav__toggle");
  var themeBtn = nav.querySelector(".tz-nav__theme");
  var groups = Array.prototype.slice.call(nav.querySelectorAll(".tz-nav__gbtn"));
  var small = window.matchMedia("(max-width: 860px)");
  var system = window.matchMedia("(prefers-color-scheme: dark)");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");
  var KEY = "tz-theme";

  /* ---------- Menus ---------- */
  function closeGroups(except) {
    groups.forEach(function (b) { if (b !== except) b.setAttribute("aria-expanded", "false"); });
  }
  function setPanel(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }
  // Desktop with a mouse: groups also open on hover. A short close delay lets
  // the pointer cross the gap between the button and its dropdown.
  var hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
  var closeTimer = null;
  var hoverOpened = null; // the button a hover opened, so a click on it keeps it open
  function canHover() { return hoverable.matches && !small.matches; }

  groups.forEach(function (b) {
    var group = b.parentElement;
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      if (open && hoverOpened === b) { hoverOpened = null; return; }
      hoverOpened = null;
      closeGroups(b);
      b.setAttribute("aria-expanded", String(!open));
    });
    group.addEventListener("mouseenter", function () {
      if (!canHover()) return;
      clearTimeout(closeTimer);
      if (b.getAttribute("aria-expanded") !== "true") {
        closeGroups(b);
        b.setAttribute("aria-expanded", "true");
        hoverOpened = b;
      }
    });
    group.addEventListener("mouseleave", function () {
      if (!canHover()) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        // Stay open if keyboard focus is inside this group
        if (group.contains(document.activeElement) && document.activeElement !== b) return;
        b.setAttribute("aria-expanded", "false");
        if (hoverOpened === b) hoverOpened = null;
      }, 180);
    });
  });
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      setPanel(toggle.getAttribute("aria-expanded") !== "true");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openGroup = groups.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
    if (openGroup) { closeGroups(); openGroup.focus(); }
    else if (nav.classList.contains("is-open")) { setPanel(false); toggle.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) { closeGroups(); setPanel(false); }
  });
  nav.addEventListener("focusout", function (e) {
    if (!small.matches && !nav.contains(e.relatedTarget)) closeGroups();
  });
  listen(small, function () { closeGroups(); setPanel(false); });

  /* ---------- Light / dark ---------- */
  function stored() {
    try { var t = localStorage.getItem(KEY); return t === "light" || t === "dark" ? t : null; } catch (e) { return null; }
  }
  function store(t) {
    try { localStorage.setItem(KEY, t); localStorage.setItem("archify-theme", t); } catch (e) {}
  }
  function current() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function label() {
    if (!themeBtn) return;
    var next = current() === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
    themeBtn.setAttribute("title", "Switch to " + next + " theme");
  }
  var ours = false; // true while this script changes data-theme itself
  function apply(t) { ours = true; root.setAttribute("data-theme", t); label(); }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      store(next);
      if (!document.startViewTransition || still.matches) { apply(next); return; }
      // Fade the whole page, bar included, from one theme to the other
      root.classList.add("tz-theme-fade");
      nav.style.viewTransitionName = "none";
      var vt = document.startViewTransition(function () { apply(next); });
      vt.finished.finally(function () {
        root.classList.remove("tz-theme-fade");
        nav.style.viewTransitionName = "";
      });
    });
  }
  label();

  // No stored choice: follow the system setting live
  listen(system, function () { if (!stored()) apply(system.matches ? "dark" : "light"); });

  // The architecture page has its own theme switch; keep both in step
  new MutationObserver(function () {
    label();
    if (ours) { ours = false; return; }
    if (root.hasAttribute("data-preset")) store(current());
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Printing always uses the light theme
  var before = null;
  window.addEventListener("beforeprint", function () { before = current(); apply("light"); });
  window.addEventListener("afterprint", function () { if (before) apply(before); before = null; });

  function listen(mq, fn) { if (mq.addEventListener) mq.addEventListener("change", fn); else mq.addListener(fn); }
})();
