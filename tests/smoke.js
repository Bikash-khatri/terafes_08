const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
html = html.replace(/<link rel="stylesheet"[^>]*>/, "")
  .replace(/<script src="data\.js"><\/script>/, () => "<script>" + fs.readFileSync(path.join(root, "data.js"), "utf8") + "</scr" + "ipt>")
  .replace(/<script src="app\.js"><\/script>/, () => "<script>" + fs.readFileSync(path.join(root, "app.js"), "utf8") + "</scr" + "ipt>");


const errors = [];
const dom = new JSDOM(html, {
  url: "http://localhost/index.html",
  runScripts: "dangerously",
  resources: undefined,
  pretendToBeVisual: true,
  beforeParse(window) {
    window.sessionStorage.setItem("customerName", "Tester");
    window.sessionStorage.setItem("demoLoggedIn", "yes");
    window.localStorage.setItem("nepalSpiceLanguage", "en");
    const { webcrypto } = require("crypto");
    try { Object.defineProperty(window, "crypto", { value: webcrypto, configurable: true }); } catch (e) {}
    // minimal <dialog> support (jsdom lacks showModal)
    const proto = window.HTMLDialogElement ? window.HTMLDialogElement.prototype : window.HTMLElement.prototype;
    if (!proto.showModal) proto.showModal = function () { this.open = true; };
    if (!proto.close) proto.close = function () { this.open = false; this.dispatchEvent(new window.Event("close")); };
    window.addEventListener("error", e => errors.push("window error: " + e.message));
  }
});

const { window } = dom;
const { document } = window;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
function check(name, cond) { if (cond) { pass++; console.log("  ok  " + name); } else { fail++; console.log("  FAIL " + name); } }

(async () => {
  await new Promise(r => window.addEventListener("load", r));
  await sleep(800); // skeleton -> paint

  check("20 food cards rendered", document.querySelectorAll("#menu .card").length === 20);
  check("category chips = 6 (all + 5)", document.querySelectorAll("#chips .chip").length === 6);
  check("cart starts empty", document.getElementById("cartCount").textContent === "0");
  check("hero title present", document.querySelector(".hero h1").textContent.length > 5);

  // add to cart from first card
  const firstAdd = document.querySelector("#menu .card .actions .btn:not(.ghost)");
  firstAdd.click();
  await sleep(30);
  check("cart badge = 1 after add", document.getElementById("cartCount").textContent === "1");
  check("drawer opens", document.getElementById("drawer").classList.contains("open") === false); // add should not open drawer
  document.getElementById("cartBtn").click();
  check("drawer open class", document.getElementById("drawer").classList.contains("open"));
  check("one cart line", document.querySelectorAll("#cartLines .line").length === 1);

  // quantity stepper +
  const plus = document.querySelector("#cartLines .stepper button:last-child");
  plus.click(); await sleep(20);
  check("qty stepper increments to 2", document.getElementById("cartCount").textContent === "2");

  // totals math: takeout 8% + delivery 300 (under 2500)
  const sub = parseInt(document.getElementById("subT").textContent.replace(/[^\d]/g, ""), 10);
  const tax = parseInt(document.getElementById("taxT").textContent.replace(/[^\d]/g, ""), 10);
  const del = parseInt(document.getElementById("delT").textContent.replace(/[^\d]/g, ""), 10);
  const tot = parseInt(document.getElementById("totT").textContent.replace(/[^\d]/g, ""), 10);
  check("tax = round(sub*0.08)", tax === Math.round(sub * 0.08));
  check("delivery fee applied under threshold", del === 300);
  check("total = sub+tax+del", tot === sub + tax + del);

  // free delivery above threshold: add many
  for (let i = 0; i < 6; i++) document.querySelectorAll("#menu .card .actions .btn:not(.ghost)")[5].click();
  await sleep(20);
  check("free delivery above ¥2500", document.getElementById("delT").textContent.includes("FREE"));

  // filters: veg only
  document.getElementById("vegToggle").click(); await sleep(20);
  const vegCards = document.querySelectorAll("#menu .card").length;
  check("veg filter reduces list (8 veg items)", vegCards === 8);
  document.getElementById("vegToggle").click(); await sleep(20);

  // search
  const search = document.getElementById("search");
  search.value = "momo"; search.dispatchEvent(new window.Event("input", { bubbles: true }));
  await sleep(20);
  check("search 'momo' shows 5", document.querySelectorAll("#menu .card").length === 5);
  search.value = ""; search.dispatchEvent(new window.Event("input", { bubbles: true })); await sleep(20);

  // category chip
  document.querySelectorAll("#chips .chip")[3].click(); await sleep(20); // noodle
  check("noodle category shows 3", document.querySelectorAll("#menu .card").length === 3);
  document.querySelectorAll("#chips .chip")[0].click(); await sleep(20);

  // details dialog
  document.querySelector("#menu .card .actions .btn.ghost").click(); await sleep(20);
  check("details dialog opens", document.getElementById("details").open === true);
  check("details title filled", document.getElementById("dTitle").textContent.length > 2);
  document.getElementById("dClose").click();

  // checkout flow
  document.getElementById("checkoutBtn").click(); await sleep(20);
  check("checkout opens", document.getElementById("checkout").open === true);
  document.getElementById("deliveryName").value = "Tester";
  document.getElementById("deliveryPhone").value = "090-1234-5678";
  document.getElementById("postalCode").value = "123-4567";
  document.getElementById("deliveryAddress").value = "1-2-3 Test, Tokyo";
  document.getElementById("checkoutForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await sleep(40);
  check("receipt dialog opens", document.getElementById("receipt").open === true);
  check("cart cleared after order", document.getElementById("cartCount").textContent === "0");
  const orders = JSON.parse(window.localStorage.getItem("nepalSpiceOrdersV1") || "[]");
  check("order saved to history", orders.length === 1 && orders[0].id.startsWith("NS-"));

  // order history dialog
  document.getElementById("ordersBtn").click(); await sleep(20);
  check("history shows 1 order", document.querySelectorAll("#ordersBody .order-card").length === 1);
  document.getElementById("oClose").click();

  // language switch to Japanese
  const lang = document.getElementById("language");
  lang.value = "ja"; lang.dispatchEvent(new window.Event("change", { bubbles: true }));
  await sleep(30);
  const firstTitle = document.querySelector("#menu .card h3").textContent;
  check("japanese names render", /[\u30a0-\u30ff\u4e00-\u9faf]/.test(firstTitle));
  // Nepali
  lang.value = "ne"; lang.dispatchEvent(new window.Event("change", { bubbles: true }));
  await sleep(30);
  check("nepali digits render", /[\u0966-\u096f]/.test(document.getElementById("cartCount").textContent) || document.getElementById("countLabel").textContent.match(/[\u0966-\u096f]/));
  lang.value = "en"; lang.dispatchEvent(new window.Event("change", { bubbles: true })); await sleep(20);

  // theme
  document.getElementById("themeToggle").click();
  check("dark theme applied", document.documentElement.getAttribute("data-theme") === "dark");
  check("theme persisted", window.localStorage.getItem("nepalSpiceTheme") === "dark");

  // cart persistence
  check("cart persisted key exists", window.localStorage.getItem("nepalSpiceCartV2") !== null);

  console.log("\nerrors:", errors.length ? errors : "none");
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail || errors.length ? 1 : 0);
})().catch(e => { console.error("CRASH", e); process.exit(1); });
