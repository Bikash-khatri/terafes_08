/* ============================================================
   Nepal Spice — app logic (classroom demo, offline-friendly)
   Cart, filters, i18n (en/ja/ne), checkout demo, order history.
   ============================================================ */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---- session guard (same behaviour as the original demo) ----
     If sessionStorage is unavailable (e.g. a sandboxed preview iframe with an
     opaque origin), fall back to an in-memory guest session so the menu can
     still be viewed. In a normal browser this never triggers.            */
  var sessionOK = (function () {
    try { sessionStorage.setItem("__ns_t", "1"); sessionStorage.removeItem("__ns_t"); return true; }
    catch (e) { return false; }
  })();
  function sGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sDel(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  var customer = sessionOK ? sGet("customerName") : "Guest";
  var loggedIn = sessionOK ? sGet("demoLoggedIn") === "yes" : true;
  if (!customer || !loggedIn) {
    window.location.replace("login.html"); return;
  }

  var LS = {
    lang: "nepalSpiceLanguage", theme: "nepalSpiceTheme",
    cart: "nepalSpiceCartV2", orders: "nepalSpiceOrdersV1", tax: "nepalSpiceTaxMode"
  };
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }

  var language = read(LS.lang, "en"); if (!I18N[language]) language = "en";
  var theme = read(LS.theme, "light");
  var taxMode = read(LS.tax, "takeout"); if (taxMode !== "dinein") taxMode = "takeout";
  var cart = {}; try { cart = JSON.parse(read(LS.cart, "{}")) || {}; } catch (e) { cart = {}; }
  var activeCat = "all", vegOnly = false, query = "", sortMode = "popular";
  var detailId = null, booted = false;

  function t(k) { return (I18N[language] && I18N[language][k]) || I18N.en[k] || k; }
  function food(id) { for (var i = 0; i < FOODS.length; i++) if (FOODS[i].id === id) return FOODS[i]; return null; }
  function money(n) { return RESTAURANT.currency + n.toLocaleString(language === "ja" ? "ja-JP" : (language === "ne" ? "ne-NP" : "en-US")); }
  function num(n) { // localized digits for Nepali
    if (language !== "ne") return String(n);
    var d = "०१२३४५६७८९"; return String(n).replace(/\d/g, function (c) { return d[+c]; });
  }

  /* ---------- theme ---------- */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    var use = document.getElementById("themeIcon");
    if (use) use.setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon");
    store(LS.theme, theme);
  }
  $("#themeToggle").addEventListener("click", function () { theme = theme === "dark" ? "light" : "dark"; applyTheme(); });

  /* ---------- i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = language;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    $("#language").value = language;
    $("#welcomeFoot").textContent = t("welcome") + ", " + customer + "!";
    $("#taxLabel").textContent = t("tax") + " · " + t(taxMode === "dinein" ? "dinein" : "takeout");
    $("#payCashNote").textContent = ""; $("#payCardNote").textContent = "";
  }
  $("#language").addEventListener("change", function () {
    language = this.value; if (!I18N[language]) language = "en";
    store(LS.lang, language); applyI18n(); renderChips(); renderMenu(false); renderCart();
    if (detailId) fillDetails(detailId);
    if ($("#checkout").open) fillCheckoutSummary();
    if ($("#orders").open) fillOrders();
  });

  /* ---------- image fallback (keeps UI intact even if a photo is missing) ---------- */
  function fallbackSrc(f) {
    var label = (f.name.en || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='#a2231b'/><stop offset='1' stop-color='#d98324'/></linearGradient></defs>" +
      "<rect width='800' height='600' fill='url(#g)'/>" +
      "<text x='50%' y='47%' font-family='Arial' font-size='120' fill='#ffffff' opacity='.9' text-anchor='middle'>🍽</text>" +
      "<text x='50%' y='66%' font-family='Arial' font-size='40' fill='#ffe9d6' text-anchor='middle'>" + label + "</text></svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function wireImg(img, f) {
    img.src = f.img; img.alt = f.name[language] || f.name.en; img.loading = "lazy";
    img.addEventListener("error", function () { img.src = fallbackSrc(f); }, { once: true });
  }

  /* ---------- filtering / sorting ---------- */
  function visibleFoods() {
    var q = query.trim().toLowerCase();
    var list = FOODS.filter(function (f) {
      if (activeCat !== "all" && f.cat !== activeCat) return false;
      if (vegOnly && !f.veg) return false;
      if (!q) return true;
      return (f.name.en + " " + f.name.ja + " " + f.name.ne + " " + f.desc.en).toLowerCase().indexOf(q) > -1;
    });
    var by = {
      popular: function (a, b) { return b.reviews - a.reviews; },
      rating: function (a, b) { return b.rating - a.rating; },
      asc: function (a, b) { return a.price - b.price; },
      desc: function (a, b) { return b.price - a.price; }
    }[sortMode];
    return list.sort(by);
  }

  /* ---------- chips ---------- */
  function renderChips() {
    var box = $("#chips"); box.replaceChildren();
    var mk = function (id, label) {
      var b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.textContent = label;
      b.setAttribute("aria-pressed", String(activeCat === id));
      b.addEventListener("click", function () { activeCat = id; renderChips(); renderMenu(false); });
      box.appendChild(b);
    };
    mk("all", t("all"));
    CATEGORIES.forEach(function (c) { mk(c.id, c.name[language] || c.name.en); });
  }

  /* ---------- spice meter ---------- */
  function spiceMeter(n) {
    var s = document.createElement("span"); s.className = "spice"; s.title = t("spice") + " " + n + "/3";
    for (var i = 1; i <= 3; i++) {
      var e = document.createElement("i"); e.textContent = "🌶"; if (i > n) e.className = "off"; s.appendChild(e);
    }
    return s;
  }
  function flagsFor(f) {
    var frag = document.createDocumentFragment();
    if (f.veg) { var v = document.createElement("span"); v.className = "flag veg"; v.textContent = t("veg"); frag.appendChild(v); }
    (f.tags || []).slice(0, 2).forEach(function (tag) {
      var el = document.createElement("span");
      el.className = "flag " + (tag === "spicy" ? "hot" : (tag === "popular" || tag === "chef" ? "gold" : ""));
      el.textContent = t("tag_" + tag) || tag; frag.appendChild(el);
    });
    return frag;
  }

  /* ---------- menu ---------- */
  function renderMenu(skeleton) {
    var grid = $("#menu");
    if (skeleton) {
      grid.replaceChildren();
      for (var i = 0; i < 8; i++) { var sk = document.createElement("div"); sk.className = "skel"; grid.appendChild(sk); }
      setTimeout(function () { paintMenu(); }, 380);
    } else paintMenu();

    function paintMenu() {
      var list = visibleFoods();
      grid.replaceChildren();
      $("#countLabel").textContent = num(list.length) + " / " + num(FOODS.length);
      if (!list.length) {
        var e = document.createElement("div"); e.className = "empty";
        e.innerHTML = "<div class='big'>🔍</div>";
        var p = document.createElement("p"); p.textContent = t("resultsNone"); e.appendChild(p);
        var b = document.createElement("button"); b.className = "btn ghost"; b.textContent = t("clearFilters");
        b.addEventListener("click", function () { query = ""; $("#search").value = ""; vegOnly = false; $("#vegToggle").setAttribute("aria-pressed", "false"); activeCat = "all"; renderChips(); renderMenu(false); });
        e.appendChild(b); grid.appendChild(e); return;
      }
      list.forEach(function (f) {
        var card = document.createElement("article"); card.className = "card";

        var media = document.createElement("div"); media.className = "media";
        var img = document.createElement("img"); wireImg(img, f);
        var flags = document.createElement("div"); flags.className = "flags"; flags.appendChild(flagsFor(f));
        var priceTag = document.createElement("span"); priceTag.className = "price-tag"; priceTag.textContent = money(f.price);
        media.append(img, flags, priceTag);

        var body = document.createElement("div"); body.className = "body";
        var h = document.createElement("h3"); h.textContent = f.name[language] || f.name.en;
        var meta = document.createElement("div"); meta.className = "meta";
        var rate = document.createElement("span"); rate.className = "rate";
        rate.innerHTML = "<svg><use href='#i-star'/></svg>"; rate.appendChild(document.createTextNode(num(f.rating.toFixed(1))));
        var rev = document.createElement("span"); rev.textContent = "(" + num(f.reviews) + ")";
        meta.append(rate, rev);
        meta.appendChild(sep()); meta.appendChild(txt(num(f.kcal) + " " + t("kcal")));
        meta.appendChild(sep()); meta.appendChild(txt(num(f.time) + " " + t("min")));
        if (f.spice > 0) { meta.appendChild(sep()); meta.appendChild(spiceMeter(f.spice)); }
        var actions = document.createElement("div"); actions.className = "actions";
        var add = document.createElement("button"); add.className = "btn"; add.style.flex = "1";
        add.innerHTML = "<svg><use href='#i-plus'/></svg>";
        var addLbl = document.createElement("span"); addLbl.textContent = t("add"); add.appendChild(addLbl);
        add.addEventListener("click", function () { addToCart(f.id, 1); });
        var det = document.createElement("button"); det.className = "btn ghost"; det.textContent = t("details");
        det.addEventListener("click", function () { openDetails(f.id); });
        actions.append(add, det);
        body.append(h, meta, actions);
        card.append(media, body);
        grid.appendChild(card);
      });
    }
    function sep() { var s = document.createElement("span"); s.className = "sep"; return s; }
    function txt(s) { var e = document.createElement("span"); e.textContent = s; return e; }
  }

  /* ---------- details dialog ---------- */
  function openDetails(id) { detailId = id; fillDetails(id); $("#details").showModal(); }
  function fillDetails(id) {
    var f = food(id); if (!f) return;
    wireImg($("#dImage"), f);
    var fl = $("#dFlags"); fl.replaceChildren(); fl.appendChild(flagsFor(f));
    $("#dTitle").textContent = f.name[language] || f.name.en;
    $("#dDesc").textContent = f.desc[language] || f.desc.en;
    var meta = $("#dMeta"); meta.replaceChildren();
    var r = document.createElement("span"); r.className = "rate"; r.style.color = "var(--ink)"; r.style.fontWeight = "700";
    r.innerHTML = "<svg style='width:14px;height:14px;color:var(--star)'><use href='#i-star'/></svg>";
    r.appendChild(document.createTextNode(num(f.rating.toFixed(1)) + " "));
    var rs = document.createElement("span"); rs.textContent = num(f.reviews) + " " + t("reviews");
    meta.append(r, rs);
    var kpi = $("#dKpi"); kpi.replaceChildren();
    [["v", money(f.price), "k", t("total")], ["v", num(f.kcal), "k", t("kcal")], ["v", num(f.time) + "′", "k", t("prep")], ["v", num(f.spice) + "/3", "k", t("spice")]]
      .forEach(function (kv) {
        var d = document.createElement("div"); d.className = "kpi";
        var v = document.createElement("div"); v.className = "v"; v.textContent = kv[1];
        var k = document.createElement("div"); k.className = "k"; k.textContent = kv[3];
        d.append(v, k); kpi.appendChild(d);
      });
    var facts = $("#dFacts"); facts.replaceChildren();
    var catName = ""; CATEGORIES.forEach(function (c) { if (c.id === f.cat) catName = c.name[language] || c.name.en; });
    var rows = [
      [t("all"), catName],
      [t("vegOnly"), f.veg ? "✓" : "—"],
      [t("allergens"), (f.allergens && f.allergens.length) ? f.allergens.join(", ") : t("none")]
    ];
    rows.forEach(function (rw) {
      var row = document.createElement("div"); row.className = "row";
      var k = document.createElement("span"); k.className = "k"; k.textContent = rw[0];
      var v = document.createElement("span"); v.textContent = rw[1];
      row.append(k, v); facts.appendChild(row);
    });
    var tags = document.createElement("div"); tags.className = "tagline-list"; tags.style.marginTop = "10px";
    (f.tags || []).forEach(function (tag) { var m = document.createElement("span"); m.className = "mini-tag"; m.textContent = t("tag_" + tag) || tag; tags.appendChild(m); });
    facts.appendChild(tags);
    $("#dAdd").onclick = function () { addToCart(f.id, 1); $("#details").close(); };
  }
  $("#dClose").addEventListener("click", function () { $("#details").close(); });
  $("#dCloseTop").addEventListener("click", function () { $("#details").close(); });

  /* ---------- cart ---------- */
  function cartEntries() {
    return Object.keys(cart).map(function (id) { return { f: food(id), qty: cart[id] }; }).filter(function (e) { return e.f; });
  }
  function addToCart(id, n) {
    cart[id] = (cart[id] || 0) + n; persistCart(); renderCart();
    var f = food(id); toast((f.name[language] || f.name.en) + " " + t("toastAdded"));
  }
  function setQty(id, n) {
    if (n <= 0) { delete cart[id]; var f = food(id); if (f) toast((f.name[language] || f.name.en) + " " + t("toastRemoved")); }
    else cart[id] = n;
    persistCart(); renderCart();
  }
  function persistCart() { store(LS.cart, JSON.stringify(cart)); }
  function totals() {
    var sub = 0; cartEntries().forEach(function (e) { sub += e.f.price * e.qty; });
    var rate = taxMode === "dinein" ? RESTAURANT.taxDineIn : RESTAURANT.taxTakeout;
    var tax = Math.round(sub * rate);
    var del = sub === 0 ? 0 : (sub >= RESTAURANT.freeDeliveryFrom ? 0 : RESTAURANT.deliveryFee);
    return { sub: sub, tax: tax, del: del, total: sub + tax + del, count: cartEntries().reduce(function (a, e) { return a + e.qty; }, 0) };
  }
  function renderCart() {
    var box = $("#cartLines"); box.replaceChildren();
    var T = totals();
    if (!cartEntries().length) {
      var e = document.createElement("div"); e.className = "cart-empty";
      e.innerHTML = "<div class='big'>🛒</div>";
      var b = document.createElement("b"); b.textContent = t("cartEmpty");
      var p = document.createElement("p"); p.textContent = t("cartEmptySub");
      e.append(b, p); box.appendChild(e);
    } else {
      cartEntries().forEach(function (en) {
        var row = document.createElement("div"); row.className = "line";
        var img = document.createElement("img"); wireImg(img, en.f);
        var info = document.createElement("div"); info.className = "info";
        var b = document.createElement("b"); b.textContent = en.f.name[language] || en.f.name.en;
        var s = document.createElement("span"); s.textContent = money(en.f.price) + " × " + num(en.qty);
        info.append(b, s);
        var st = document.createElement("div"); st.className = "stepper";
        var minus = document.createElement("button"); minus.setAttribute("aria-label", "-");
        minus.innerHTML = "<svg style='width:14px;height:14px'><use href='#i-minus'/></svg>";
        minus.addEventListener("click", function () { setQty(en.f.id, en.qty - 1); });
        var n = document.createElement("span"); n.className = "n"; n.textContent = num(en.qty);
        var plus = document.createElement("button"); plus.setAttribute("aria-label", "+");
        plus.innerHTML = "<svg style='width:14px;height:14px'><use href='#i-plus'/></svg>";
        plus.addEventListener("click", function () { setQty(en.f.id, en.qty + 1); });
        st.append(minus, n, plus);
        var lt = document.createElement("span"); lt.className = "lt"; lt.textContent = money(en.f.price * en.qty);
        row.append(img, info, st, lt);
        box.appendChild(row);
      });
    }
    $("#subT").textContent = money(T.sub);
    $("#taxT").textContent = money(T.tax);
    $("#delT").innerHTML = T.del === 0 && T.sub > 0 ? "<span class='free'>" + t("free") + "</span>" : money(T.del);
    $("#totT").textContent = money(T.total);
    $("#cartCount").textContent = num(T.count);
    $("#mbTotal").textContent = money(T.total);
    $("#mbCount").textContent = num(T.count) + " " + t("items");
    $("#mobilebar").classList.toggle("show", T.count > 0);
    $("#checkoutBtn").disabled = T.count === 0;
    $("#clearCart").disabled = T.count === 0;
  }

  /* drawer open/close */
  function openCart(o) {
    $("#drawer").classList.toggle("open", o);
    $("#scrim").classList.toggle("open", o);
    document.body.style.overflow = o ? "hidden" : "";
  }
  $("#cartBtn").addEventListener("click", function () { openCart(true); });
  $("#mbOpen").addEventListener("click", function () { openCart(true); });
  $("#closeCart").addEventListener("click", function () { openCart(false); });
  $("#scrim").addEventListener("click", function () { openCart(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") openCart(false); });
  $("#clearCart").addEventListener("click", function () { cart = {}; persistCart(); renderCart(); toast(t("toastCleared")); });

  /* ---------- toolbar events ---------- */
  $("#search").addEventListener("input", function () { query = this.value; renderMenu(false); });
  $("#sortSel").addEventListener("change", function () { sortMode = this.value; renderMenu(false); });
  $("#vegToggle").addEventListener("click", function () {
    vegOnly = !vegOnly; this.setAttribute("aria-pressed", String(vegOnly)); renderMenu(false);
  });

  /* ---------- checkout ---------- */
  function fillCheckoutSummary() {
    var T = totals(); var box = $("#checkoutSummary"); box.replaceChildren();
    cartEntries().forEach(function (en) {
      var l = document.createElement("div"); l.className = "sline";
      var a = document.createElement("span"); a.textContent = (en.f.name[language] || en.f.name.en) + " × " + num(en.qty);
      var b = document.createElement("b"); b.textContent = money(en.f.price * en.qty);
      l.append(a, b); box.appendChild(l);
    });
    var rows = [[t("subtotal"), money(T.sub)], [t("tax") + " (" + t(taxMode === "dinein" ? "dinein" : "takeout") + ")", money(T.tax)],
      [t("delivery"), T.del === 0 ? t("free") : money(T.del)]];
    rows.forEach(function (r) {
      var l = document.createElement("div"); l.className = "sline";
      var a = document.createElement("span"); a.textContent = r[0];
      var b = document.createElement("b"); b.textContent = r[1]; if (r[1] === t("free")) b.style.color = "var(--green)";
      l.append(a, b); box.appendChild(l);
    });
    var tot = document.createElement("div"); tot.className = "sline"; tot.style.borderTop = "1px dashed var(--line)"; tot.style.marginTop = "6px"; tot.style.paddingTop = "8px";
    var ta = document.createElement("span"); ta.innerHTML = "<b>" + t("total") + "</b>";
    var tb = document.createElement("b"); tb.style.fontSize = "18px"; tb.textContent = money(T.total);
    tot.append(ta, tb); box.appendChild(tot);
    var eta = document.createElement("div"); eta.className = "sline"; eta.style.color = "var(--ink-soft)";
    eta.innerHTML = "<span>🛵 " + num(RESTAURANT.etaMin) + "–" + num(RESTAURANT.etaMax) + " " + t("min") + "</span><span></span>";
    box.appendChild(eta);
  }
  $("#checkoutBtn").addEventListener("click", function () {
    if (!cartEntries().length) { toast(t("need")); return; }
    openCart(false); fillCheckoutSummary();
    if (!$("#deliveryName").value) $("#deliveryName").value = customer || "";
    $("#checkout").showModal();
  });
  $("#cClose").addEventListener("click", function () { $("#checkout").close(); });
  $("#cCancel").addEventListener("click", function () { $("#checkout").close(); });
  $("#taxMode").addEventListener("change", function () {
    taxMode = this.value; store(LS.tax, taxMode); applyI18n(); renderCart(); fillCheckoutSummary();
  });

  $("#checkoutForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!this.checkValidity()) { this.reportValidity(); return; }
    if (!cartEntries().length) return;
    var T = totals();
    var id = "NS-" + Date.now().toString(36).toUpperCase();
    var order = {
      id: id, at: new Date().toISOString(), demo: true,
      items: cartEntries().map(function (e) {
        return { id: e.f.id, qty: e.qty, price: e.f.price, name: { en: e.f.name.en, ja: e.f.name.ja, ne: e.f.name.ne } };
      }),
      subtotal: T.sub, tax: T.tax, delivery: T.del, total: T.total,
      taxMode: taxMode, payment: (document.querySelector('input[name="payment"]:checked') || {}).value || "cash",
      customer: customer
    };
    var orders = []; try { orders = JSON.parse(read(LS.orders, "[]")) || []; } catch (e) {}
    orders.unshift(order); orders = orders.slice(0, 20); store(LS.orders, JSON.stringify(orders));
    $("#checkout").close();
    showReceipt(order);
    cart = {}; persistCart(); renderCart();
    this.reset(); if (!$("#deliveryName").value) $("#deliveryName").value = customer || "";
  });

  function showReceipt(o) {
    var body = $("#receiptBody"); body.replaceChildren();
    var tick = document.createElement("div"); tick.className = "tick"; tick.innerHTML = "<svg><use href='#i-check'/></svg>";
    var h = document.createElement("h3"); h.textContent = t("orderPlaced");
    var oid = document.createElement("div"); oid.className = "oid"; oid.textContent = o.id;
    var note = document.createElement("p"); note.style.color = "var(--ink-soft)"; note.textContent = t("orderConfirmed");
    var rbox = document.createElement("div"); rbox.className = "rbox";
    o.items.forEach(function (it) {
      var l = document.createElement("div"); l.className = "sline"; l.style.display = "flex"; l.style.justifyContent = "space-between"; l.style.padding = "3px 0"; l.style.fontSize = "14px";
      var a = document.createElement("span"); a.textContent = (it.name[language] || it.name.en) + " × " + num(it.qty);
      var b = document.createElement("b"); b.textContent = money(it.price * it.qty);
      l.append(a, b); rbox.appendChild(l);
    });
    var tot = document.createElement("div"); tot.style.display = "flex"; tot.style.justifyContent = "space-between"; tot.style.borderTop = "1px dashed var(--line)"; tot.style.marginTop = "6px"; tot.style.paddingTop = "8px"; tot.style.fontWeight = "800";
    tot.innerHTML = "<span>" + t("total") + "</span><span>" + money(o.total) + "</span>";
    rbox.appendChild(tot);
    var pay = document.createElement("p"); pay.style.fontSize = "13px"; pay.style.color = "var(--ink-soft)";
    pay.textContent = t("payment2") + ": " + t(o.payment === "card" ? "card" : "cash") + " · " + t("taxMode") + ": " + t(o.taxMode === "dinein" ? "dinein" : "takeout");
    var btn = document.createElement("button"); btn.className = "btn block"; btn.style.marginTop = "8px";
    btn.textContent = t("continueShopping");
    btn.addEventListener("click", function () { $("#receipt").close(); });
    body.append(tick, h, oid, note, rbox, pay, btn);
    $("#receipt").showModal();
  }

  /* ---------- order history ---------- */
  function fillOrders() {
    var body = $("#ordersBody"); body.replaceChildren();
    var orders = []; try { orders = JSON.parse(read(LS.orders, "[]")) || []; } catch (e) {}
    if (!orders.length) {
      var e = document.createElement("div"); e.className = "cart-empty";
      e.innerHTML = "<div class='big'>🧾</div>";
      var p = document.createElement("p"); p.textContent = t("noOrders"); e.appendChild(p); body.appendChild(e); return;
    }
    orders.forEach(function (o) {
      var c = document.createElement("div"); c.className = "order-card";
      var top = document.createElement("div"); top.className = "top";
      var b = document.createElement("b"); b.textContent = o.id;
      var d = document.createElement("span"); d.textContent = new Date(o.at).toLocaleString();
      top.append(b, d);
      var ul = document.createElement("ul");
      o.items.forEach(function (it) {
        var li = document.createElement("li");
        li.textContent = (it.name[language] || it.name.en) + " × " + num(it.qty) + " — " + money(it.price * it.qty);
        ul.appendChild(li);
      });
      var foot = document.createElement("div"); foot.style.display = "flex"; foot.style.justifyContent = "space-between"; foot.style.marginTop = "8px"; foot.style.fontWeight = "800";
      foot.innerHTML = "<span>" + t(o.payment === "card" ? "card" : "cash") + "</span><span>" + money(o.total) + "</span>";
      c.append(top, ul, foot); body.appendChild(c);
    });
  }
  $("#ordersBtn").addEventListener("click", function () { fillOrders(); $("#orders").showModal(); });
  $("#oClose").addEventListener("click", function () { $("#orders").close(); });

  /* ---------- toasts ---------- */
  function toast(msg) {
    var el = document.createElement("div"); el.className = "toast";
    var ic = document.createElement("span"); ic.className = "ic"; ic.innerHTML = "<svg><use href='#i-check'/></svg>";
    var s = document.createElement("span"); s.textContent = msg;
    el.append(ic, s); $("#toasts").appendChild(el);
    setTimeout(function () { el.style.transition = "opacity .3s,transform .3s"; el.style.opacity = "0"; el.style.transform = "translateY(8px)"; setTimeout(function () { el.remove(); }, 320); }, 2400);
  }

  /* ---------- logout (same behaviour as original) ---------- */
  $("#logoutBtn").addEventListener("click", function () {
    sDel("customerName"); sDel("demoLoggedIn");
    window.location.href = "login.html";
  });

  /* ---------- boot ---------- */
  $("#customerName").textContent = customer;
  applyTheme(); applyI18n(); renderChips();
  $("#taxMode").value = taxMode;
  renderMenu(true);
  renderCart();
  booted = true;
})();
