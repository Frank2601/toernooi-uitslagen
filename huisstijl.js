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
