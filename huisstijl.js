// Past de instellingen uit config.js toe op de pagina: naam, club, logo en kleuren.
// In de HTML: data-tekst="naam" / "club" / "scherm-titel", en <img data-logo>.
(function () {
  const C = window.TOERNOOI || {};

  // Kleur lichter (+) of donkerder (-) maken; f tussen -1 en 1
  const meng = (hex, f) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return null;
    const n = parseInt(m[1], 16), doel = f < 0 ? 0 : 255, a = Math.abs(f);
    return "#" + [16, 8, 0].map(s => {
      const c = (n >> s) & 255;
      return Math.round(c + (doel - c) * a).toString(16).padStart(2, "0");
    }).join("");
  };
  const root = document.documentElement.style;
  if (meng(C.KLEUR, 0)) {
    root.setProperty("--club", meng(C.KLEUR, 0));
    root.setProperty("--club-donker", meng(C.KLEUR, -0.3));
    root.setProperty("--club-licht", meng(C.KLEUR, 0.4));
    root.setProperty("--club-zacht", meng(C.KLEUR, 0.9));
  }
  if (meng(C.ACCENT, 0)) {
    root.setProperty("--accent", meng(C.ACCENT, 0));
    root.setProperty("--accent-donker", meng(C.ACCENT, -0.4));
  }

  const vul = () => {
    const teksten = { naam: C.NAAM, club: C.CLUB, "scherm-titel": C.SCHERM_TITEL };
    document.querySelectorAll("[data-tekst]").forEach(el => {
      const t = teksten[el.dataset.tekst];
      if (t) el.textContent = t;
    });
    document.querySelectorAll("img[data-logo]").forEach(img => {
      if (C.LOGO) { img.src = C.LOGO; img.alt = C.CLUB || ""; } else img.remove();
    });
    if (C.LOGO) {
      const icon = document.querySelector("link[rel=icon]") || document.head.appendChild(document.createElement("link"));
      icon.rel = "icon"; icon.href = C.LOGO;
    }
    if (C.NAAM) document.title = document.title.replace(/^[^–]*/, C.NAAM + " ");
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", vul); else vul();
})();

// Banen voor het "Nu bezig"-blok: eerste helft links, tweede helft rechts
function baanKolommen() {
  const n = Math.max(1, Number((window.TOERNOOI || {}).BANEN) || 4);
  const alle = Array.from({ length: n }, (_, i) => String(i + 1));
  const helft = Math.ceil(n / 2);
  return { links: alle.slice(0, helft), rechts: alle.slice(helft), alle };
}

// Finalestijl (goud) op het tv-scherm. Instelling FINALE_STIJL in config.js:
//   "auto" = alleen op de laatste 2 dagen van het toernooi, "aan" = altijd, "uit" = nooit.
// Om te bekijken kan het ook in het adres: scherm.html?finale=aan (of =uit).
function finaleStijlActief(wedstrijden) {
  const C = window.TOERNOOI || {};
  const keuze = (new URLSearchParams(location.search).get("finale") || C.FINALE_STIJL || "auto").toLowerCase();
  if (keuze === "aan") return true;
  if (keuze === "uit") return false;
  // Laatste toernooidag: LAATSTE_DAG uit config.js, anders de laatste dag in het programma.
  // Finalestijl vanaf de dag ervoor.
  const datums = /^\d{2}-\d{2}-\d{4}$/.test(C.LAATSTE_DAG || "") ? [C.LAATSTE_DAG] : wedstrijden.map(w => w.datum);
  const sleutels = datums.map(d => /^(\d{2})-(\d{2})-(\d{4})$/.exec(d || "")).filter(Boolean)
    .map(m => new Date(+m[3], m[2] - 1, +m[1]).getTime());
  if (!sleutels.length) return false;
  const vanaf = new Date(Math.max(...sleutels)); vanaf.setDate(vanaf.getDate() - 1);
  const nu = new Date(); nu.setHours(0, 0, 0, 0);
  return nu >= vanaf;
}

function pasFinaleStijlToe(aan) {
  const C = window.TOERNOOI || {};
  document.documentElement.classList.toggle("finale-stijl", aan);
  // Ondertitel: op finaledagen "Finaleweekend", anders de clubnaam
  document.querySelectorAll('[data-tekst="scherm-titel"]').forEach(el => {
    el.textContent = aan ? (C.SCHERM_TITEL || "🏆 Finaleweekend") : (C.CLUB || "");
  });
}

// Finaledag-weergave op het tv-scherm: per onderdeel de halve finales klein met de finale groot erachter.
// Instelling FINALEDAG_SCHERM in config.js: "auto" = alleen op de laatste toernooidag, "aan" = altijd, "uit" = nooit.
// Om te bekijken kan het ook in het adres: scherm.html?finaledag=aan (of =uit).
function finaledagActief(wedstrijden) {
  const C = window.TOERNOOI || {};
  const keuze = (new URLSearchParams(location.search).get("finaledag") || C.FINALEDAG_SCHERM || "auto").toLowerCase();
  if (keuze === "aan") return true;
  if (keuze === "uit") return false;
  const datums = /^\d{2}-\d{2}-\d{4}$/.test(C.LAATSTE_DAG || "") ? [C.LAATSTE_DAG] : wedstrijden.map(w => w.datum);
  const sleutels = datums.map(d => /^(\d{2})-(\d{2})-(\d{4})$/.exec(d || "")).filter(Boolean)
    .map(m => new Date(+m[3], m[2] - 1, +m[1]).getTime());
  if (!sleutels.length) return false;
  const nu = new Date(); nu.setHours(0, 0, 0, 0);
  return nu.getTime() >= Math.max(...sleutels);
}
