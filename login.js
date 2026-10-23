// School demo. Account records stay in this browser (localStorage), not on a server.
// Stores a salted SHA-256 password verifier instead of the password itself.
// UI additions: show/hide password + strength meter. Core auth logic unchanged.
const ACCOUNT_KEY = "nepalSpiceAccountsV1";
let creatingAccount = false;
const $ = id => document.getElementById(id);

function accounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "{}"); }
  catch (e) { return {}; }
}
function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure browser encryption is unavailable. Open this project in a modern browser or through localhost.");
  }
  const input = new TextEncoder().encode(salt + ":" + password);
  return bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", input)));
}

/* --- password visibility --- */
$("eyeBtn").addEventListener("click", () => {
  const input = $("password");
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  $("eyeIcon").innerHTML = show ? '<use href="#i-eyeoff"/>' : '<use href="#i-eye"/>';
  $("eyeBtn").setAttribute("aria-label", show ? "Hide password" : "Show password");
});

/* --- strength meter (visual hint only, not a security control) --- */
function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4); // 0..4
}
const STRENGTH = [
  { w: "12%", c: "#c2410c", en: "very weak", ja: "とても弱い", ne: "धेरै कमजोर" },
  { w: "32%", c: "#c2410c", en: "weak", ja: "弱い", ne: "कमजोर" },
  { w: "55%", c: "#d98324", en: "okay", ja: "まあまあ", ne: "ठीक" },
  { w: "78%", c: "#8aa63c", en: "good", ja: "良好", ne: "राम्रो" },
  { w: "100%", c: "#1e7a46", en: "strong", ja: "強い", ne: "बलियो" }
];
$("password").addEventListener("input", () => {
  if (!creatingAccount) return;
  const pw = $("password").value;
  $("meterWrap").hidden = pw.length === 0;
  $("meterLabel").hidden = pw.length === 0;
  if (!pw) return;
  const s = STRENGTH[strength(pw)];
  $("meterBar").style.width = s.w;
  $("meterBar").style.background = s.c;
  $("meterLabel").textContent = "Password strength: " + s.en;
});

function setMode(register) {
  creatingAccount = register;
  $("formTitle").textContent = register ? "Create Account" : "Login";
  $("formHint").textContent = register
    ? "Choose a name and password (at least 8 characters)."
    : "Login using the name and password you created.";
  $("confirmArea").hidden = !register;
  $("confirmPassword").required = register;
  $("password").autocomplete = register ? "new-password" : "current-password";
  $("submitButton").textContent = register ? "Save Account" : "Login";
  $("switchPrompt").textContent = register ? "Already have an account?" : "Don't have an account?";
  $("toggleMode").textContent = register ? "Login" : "Create Account";
  $("meterWrap").hidden = !register || !$("password").value;
  $("meterLabel").hidden = !register || !$("password").value;
  $("loginError").textContent = "";
  $("loginMessage").textContent = "";
  $("password").value = "";
  $("confirmPassword").value = "";
  $("meterBar").style.width = "0";
}
$("toggleMode").addEventListener("click", () => setMode(!creatingAccount));

$("accountForm").addEventListener("submit", async event => {
  event.preventDefault();
  $("loginError").textContent = "";
  $("loginMessage").textContent = "";
  const name = $("name").value.trim();
  const password = $("password").value;
  if (!name || password.length < 8) {
    $("loginError").textContent = "Enter your name and a password with at least 8 characters.";
    return;
  }
  const key = name.toLowerCase();
  const saved = accounts();
  $("submitButton").disabled = true;
  try {
    if (creatingAccount) {
      if (password !== $("confirmPassword").value) {
        $("loginError").textContent = "Passwords do not match.";
        return;
      }
      if (saved[key]) {
        $("loginError").textContent = "This name already exists. Please log in or choose another name.";
        return;
      }
      const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      saved[key] = { name, salt, hash: await hashPassword(password, salt) };
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(saved));
      setMode(false);
      $("loginMessage").textContent = "Account saved! Log in with your new password.";
    } else {
      const account = saved[key];
      if (!account || (await hashPassword(password, account.salt)) !== account.hash) {
        $("loginError").textContent = "Incorrect name or password.";
        return;
      }
      sessionStorage.setItem("customerName", account.name);
      sessionStorage.setItem("demoLoggedIn", "yes");
      window.location.href = "index.html";
    }
  } catch (error) {
    $("loginError").textContent = error.message || "Could not save account in this browser.";
  } finally {
    $("submitButton").disabled = false;
  }
});

setMode(false);
