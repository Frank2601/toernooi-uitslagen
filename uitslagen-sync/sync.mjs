// Uitslagen-sync voor toernooi-uitslagen
// Opent MijnKNLTB in een Edge-venster (één keer inloggen), leest elke paar minuten
// de wedstrijden van vandaag en zet wedstrijden.csv op GitHub als er iets veranderd is.
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAP = path.dirname(fileURLToPath(import.meta.url));
const instellingen = JSON.parse(fs.readFileSync(path.join(MAP, "instellingen.json"), "utf8"));
const { toernooiUrl, repo = "", token = "", bestand = "wedstrijden.csv", intervalMinuten = 6, volledigElkeMinuten = 60 } = instellingen;
// Zonder GitHub-gegevens: alleen lokaal opslaan (om te testen), in de map van de website
const LOKAAL = !repo || !token || token.startsWith("PLAK");
const lokaalBestand = path.join(MAP, "..", bestand);

const tijd = () => new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
const log = (...t) => console.log(`[${tijd()}]`, ...t);
const slaap = ms => new Promise(r => setTimeout(r, ms));

const guid = /\/tournament\/([0-9a-f-]{36})/i.exec(toernooiUrl)?.[1];
if (!guid) { console.log("toernooiUrl in instellingen.json klopt niet."); process.exit(1); }
const basis = `https://mijnknltb.toernooi.nl/tournament/${guid}`;

// ---------- GitHub ----------
const gh = (pad, opties = {}) => fetch(`https://api.github.com/repos/${repo}/contents/${pad}`, {
  ...opties,
  headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "uitslagen-sync", ...opties.headers },
});

async function haalVanGitHub() {
  if (LOKAAL) return { sha: "", tekst: fs.existsSync(lokaalBestand) ? fs.readFileSync(lokaalBestand, "utf8") : "" };
  const r = await gh(bestand);
  if (!r.ok) throw new Error(`GitHub gaf ${r.status} bij lezen (klopt de sleutel?)`);
  const j = await r.json();
  return { sha: j.sha, tekst: Buffer.from(j.content, "base64").toString("utf8") };
}

async function zetOpGitHub(tekst, sha, bericht) {
  if (LOKAAL) { fs.writeFileSync(lokaalBestand, tekst, "utf8"); return ""; }
  const r = await gh(bestand, {
    method: "PUT",
    body: JSON.stringify({ message: bericht, content: Buffer.from(tekst, "utf8").toString("base64"), sha }),
  });
  if (!r.ok) throw new Error(`GitHub gaf ${r.status} bij opslaan: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).content.sha;
}

// ---------- MijnKNLTB uitlezen ----------
// Draait in de pagina: geeft alle wedstrijden op de getoonde dag terug.
function leesWedstrijden() {
  const tekst = el => el?.textContent.replace(/\s+/g, " ").trim() || "";
  return [...document.querySelectorAll(".match-group__wrapper")].flatMap(g => {
    const tijd = tekst(g.querySelector(".match-group__header"));
    return [...g.querySelectorAll(".match")].map(w => {
      const kop = [...w.querySelectorAll(".match__header-title-item")].map(tekst);
      const rijen = [...w.querySelectorAll(".match__row")];
      const teams = rijen.map(r => [...r.querySelectorAll(".match__row-title-value-content")].map(tekst).join(" / "));
      const winnaar = rijen.findIndex(r => r.classList.contains("has-won")) + 1;
      // Uitslag: per set een <ul class="points"> met de games van team 1 en team 2
      const sets = [...w.querySelectorAll(".match__result .points")].map(ul =>
        [...ul.querySelectorAll(".points__cell")].map(tekst).join("-"));
      const restTekst = tekst(w.querySelector(".match__result"));
      // Rechtsboven staan blokjes met een tooltip, bijv. "Nu bezig", "Sportpark Rijkevoort - Baan 1"
      // of (na afloop) "Duur: 1h 49m | De Zoetsmeer - 3". De voettekst herhaalt de locatie.
      const labels = [...w.querySelectorAll(".match__header-aside-block")]
        .flatMap(b => [b.getAttribute("title") || "", tekst(b)])
        .concat([...w.querySelectorAll(".match__footer-list-item")].map(tekst))
        .flatMap(s => s.split("|")).map(s => s.trim()).filter(Boolean);
      const bezig = labels.some(s => /^nu bezig$|^live$/i.test(s));
      const baanLabel = labels.find(s => / - .+$/.test(s));
      const baan = baanLabel ? baanLabel.replace(/^.* - /, "").replace(/^baan\s*/i, "").trim() : "";
      return {
        tijd, onderdeel: kop[0] || "", ronde: kop[1] || "",
        speler1: teams[0] || "", speler2: teams[1] || "",
        uitslag: sets.length ? sets.join(" ") : restTekst,
        winnaar: winnaar > 0 ? String(winnaar) : "", baan, bezig,
      };
    });
  });
}

const dagNaarDatum = d => `${d.slice(6, 8)}-${d.slice(4, 6)}-${d.slice(0, 4)}`;
const vandaagCode = () => { const d = new Date(), p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`; };

async function wachtOpToernooi(page) {
  let gemeld = false;
  for (;;) {
    if (await page.$("select#Date")) return;
    if (!gemeld) {
      console.log("\n  >>> Accepteer de cookies en log in op MijnKNLTB in het Edge-venster.");
      console.log("  >>> Daarna gaat dit programma vanzelf verder.\n");
      gemeld = true;
    }
    await slaap(5000);
    // Niet storen tijdens cookies of inloggen: alleen terugsturen naar het toernooi als de
    // gebruiker klaar is en op een gewone MijnKNLTB-pagina staat (bijv. de startpagina na inloggen).
    let url; try { url = new URL(page.url()); } catch { continue; }
    const bezigMetInloggen = url.hostname !== "mijnknltb.toernooi.nl" ||
      /cookie|login|logon|signin|account|auth|user|profile/i.test(url.pathname + url.search);
    const opToernooi = /\/tournament\/.+\/matches/i.test(url.pathname);
    if (!bezigMetInloggen && !opToernooi) {
      await page.goto(`${basis}/matches`, { waitUntil: "domcontentloaded" }).catch(() => {});
    }
  }
}

async function leesDag(page, dag) {
  await page.goto(`${basis}/matches/${dag}`, { waitUntil: "domcontentloaded" });
  await wachtOpToernooi(page);
  await page.waitForSelector(".match-group__wrapper", { timeout: 10000 }).catch(() => {});
  return (await page.evaluate(leesWedstrijden)).map(({ bezig, ...w }) => {
    // MijnKNLTB toont "Nu bezig" zodra de wedstrijd in Tournament Planner op een baan staat
    const status = w.uitslag || w.winnaar ? "Gespeeld" : bezig ? "Bezig" : "Gepland";
    return { datum: dagNaarDatum(dag), ...w, onderdeel: w.onderdeel.replace(/^Tennis\s+/i, "").replace(/ - Groep$/, ""), status };
  });
}

const csvVeld = v => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
function naarCSV(alle) {
  const regels = ["Datum,Onderdeel,Ronde,Tijd,Baan,Speler1,Speler2,Uitslag,Status,Winnaar"];
  for (const w of alle) regels.push([w.datum, w.onderdeel, w.ronde, w.tijd, w.baan, w.speler1, w.speler2,
    w.uitslag, w.status, w.winnaar].map(v => csvVeld(v || "")).join(","));
  return regels.join("\n") + "\n";
}

// ---------- Hoofdprogramma ----------
console.log("\n  Uitslagen-sync" + (instellingen.naam ? " " + instellingen.naam : ""));
console.log("  Laat dit venster en het Edge-venster open staan tijdens het toernooi.\n");
if (LOKAAL) console.log("  TESTSTAND: geen GitHub-sleutel ingesteld. De uitslagen worden alleen opgeslagen in\n  " + lokaalBestand + "\n");

let { sha, tekst: opGitHub } = await haalVanGitHub();
log(LOKAAL ? "Lokaal bestand gevonden." : "Verbonden met GitHub.");

const context = await chromium.launchPersistentContext(path.join(MAP, "profiel"), {
  channel: "msedge", headless: false, viewport: null, args: ["--start-maximized"],
});
const page = context.pages()[0] || await context.newPage();
await page.goto(`${basis}/matches`, { waitUntil: "domcontentloaded" });
await wachtOpToernooi(page);
log("MijnKNLTB is open.");

const perDag = new Map();   // dagcode → wedstrijden
let dagen = [], laatsteVolledig = 0;

for (;;) {
  try {
    const volledig = Date.now() - laatsteVolledig > volledigElkeMinuten * 60000;
    if (volledig) {
      await page.goto(`${basis}/matches`, { waitUntil: "domcontentloaded" });
      await wachtOpToernooi(page);
      dagen = await page.$$eval("select#Date option", os => os.map(o => o.value).filter(Boolean));
    }
    const vandaag = vandaagCode();
    const teLezen = volledig ? dagen : dagen.filter(d => d === vandaag);
    for (const dag of teLezen) {
      perDag.set(dag, await leesDag(page, dag));
      await slaap(1500);
    }
    if (volledig) laatsteVolledig = Date.now();

    const alle = dagen.flatMap(d => perDag.get(d) || []);
    const nieuw = naarCSV(alle);
    if (!alle.length) {
      log("Geen wedstrijden gevonden – niets bijgewerkt.");
    } else if (nieuw === opGitHub) {
      log(`Gecontroleerd (${teLezen.length} dag${teLezen.length === 1 ? "" : "en"}), geen wijzigingen.`);
    } else {
      const gespeeld = alle.filter(w => w.status === "Gespeeld").length;
      sha = await zetOpGitHub(nieuw, sha, `Uitslagen bijgewerkt ${tijd()}`);
      opGitHub = nieuw;
      log(`Bijgewerkt${LOKAAL ? " (lokaal)" : " op de website"}: ${gespeeld}/${alle.length} wedstrijden gespeeld.`);
    }
  } catch (e) {
    log("Probleem:", e.message, "– volgende poging over", intervalMinuten, "minuten.");
    // Bij een conflict (bijv. iemand paste het bestand op GitHub aan) opnieuw ophalen
    try { ({ sha, tekst: opGitHub } = await haalVanGitHub()); } catch {}
    if (context.pages().length === 0) { log("Edge-venster is gesloten. Start het programma opnieuw."); process.exit(1); }
  }
  await slaap(intervalMinuten * 60000);
}
