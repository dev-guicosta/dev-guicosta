// Gera um SVG animado com o gráfico de contribuições do GitHub.
// Só as caixinhas com contribuição acendem, uma por uma, em ordem cronológica.
// A contribuição mais recente fica piscando em verde, como o cursor da marca >G_.

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const LOGIN = process.env.GITHUB_USER || "dev-guicosta";
const TOKEN = process.env.GITHUB_TOKEN;
const OUT = process.env.OUT_DIR || "dist";
const FONT = "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";

const PALETAS = {
  dark: {
    vazio: "#161b22",
    niveis: ["#3b2a66", "#5a37b0", "#7044d8", "#8147F6"],
    texto: "#8b949e",
    destaque: "#C8E89E",
  },
  light: {
    vazio: "#ebedf0",
    niveis: ["#e0d4fd", "#c2a7fb", "#a07af8", "#8147F6"],
    texto: "#57606a",
    destaque: "#7cb342",
  },
};

const NIVEL = { FIRST_QUARTILE: 0, SECOND_QUARTILE: 1, THIRD_QUARTILE: 2, FOURTH_QUARTILE: 3 };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

async function buscarCalendario() {
  if (process.env.MOCK_FILE) return JSON.parse(readFileSync(process.env.MOCK_FILE, "utf8"));
  const query = `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{
    totalContributions weeks{ contributionDays{ date contributionCount contributionLevel weekday } } } } } }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.user.contributionsCollection.contributionCalendar;
}

function gerarSVG(cal, tema) {
  const p = PALETAS[tema];
  const C = 11, G = 3, PASSO = C + G, X0 = 32, Y0 = 26;
  const semanas = cal.weeks;
  const largura = X0 + semanas.length * PASSO + 8;
  const altura = Y0 + 7 * PASSO + 34;

  // Ordem cronológica das caixinhas com contribuição
  const ativos = [];
  semanas.forEach((s, x) =>
    s.contributionDays.forEach((d) => {
      if (d.contributionCount > 0) ativos.push({ ...d, x, y: d.weekday });
    })
  );
  ativos.sort((a, b) => a.date.localeCompare(b.date));

  const CICLO = 9; // segundos por volta completa
  const espalhar = Math.min(3.2, Math.max(1.2, ativos.length * 0.035));
  const passo = ativos.length > 1 ? espalhar / (ativos.length - 1) : 0;
  const pct = (s) => ((s / CICLO) * 100).toFixed(2);

  let fundo = "";
  semanas.forEach((s, x) =>
    s.contributionDays.forEach((d) => {
      fundo += `<rect x="${X0 + x * PASSO}" y="${Y0 + d.weekday * PASSO}" width="${C}" height="${C}" rx="2.5" fill="${p.vazio}"/>`;
    })
  );

  let celulas = "";
  let estilos = "";
  ativos.forEach((d, i) => {
    const cx = X0 + d.x * PASSO + C / 2;
    const cy = Y0 + d.y * PASSO + C / 2;
    const ultimo = i === ativos.length - 1;
    const cor = p.niveis[NIVEL[d.contributionLevel] ?? 0];
    celulas += `<rect class="c${ultimo ? " u" : ""}" style="animation-delay:${(i * passo).toFixed(3)}s;transform-origin:${cx}px ${cy}px" x="${cx - C / 2}" y="${cy - C / 2}" width="${C}" height="${C}" rx="2.5" fill="${cor}"><title>${d.date}: ${d.contributionCount}</title></rect>`;
  });

  // Rótulos dos meses
  let meses = "";
  let ultimoMes = -1;
  semanas.forEach((s, x) => {
    const m = new Date(s.contributionDays[0].date + "T12:00:00Z").getUTCMonth();
    if (m !== ultimoMes && x < semanas.length - 2) {
      meses += `<text x="${X0 + x * PASSO}" y="${Y0 - 9}">${MESES[m]}</text>`;
      ultimoMes = m;
    }
  });

  const entrada = 0.35;
  estilos = `
    .t{font-family:"SG",-apple-system,"Segoe UI",sans-serif;font-weight:500;font-size:10px;fill:${p.texto}}
    .n{font-size:12px}
    .c{opacity:0;animation:acende ${CICLO}s cubic-bezier(.3,1.6,.5,1) infinite backwards}
    .u{animation:acende ${CICLO}s cubic-bezier(.3,1.6,.5,1) infinite backwards, pisca 1.1s steps(1) infinite}
    @keyframes acende{
      0%{opacity:0;transform:scale(.2)}
      ${pct(entrada)}%{opacity:1;transform:scale(1)}
      ${pct(CICLO - espalhar - 1.2)}%{opacity:1;transform:scale(1)}
      ${pct(CICLO - espalhar - 0.6)}%{opacity:0;transform:scale(.6)}
      100%{opacity:0;transform:scale(.6)}
    }
    @keyframes pisca{0%{fill:${p.destaque}}50%{fill:${p.niveis[3]}}}
  `;

  const total = cal.totalContributions;
  const legenda = `${total} contribuições no último ano`;
  const yLeg = Y0 + 7 * PASSO + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
<style>@font-face{font-family:"SG";font-weight:500;src:url(data:font/woff2;base64,${FONT}) format("woff2")}${estilos}</style>
<g class="t">${meses}</g>
<g class="t"><text x="0" y="${Y0 + 1 * PASSO + 9}">seg</text><text x="0" y="${Y0 + 3 * PASSO + 9}">qua</text><text x="0" y="${Y0 + 5 * PASSO + 9}">sex</text></g>
<g>${fundo}</g>
<g>${celulas}</g>
<text class="t n" x="${X0}" y="${yLeg}">${legenda}</text>
</svg>`;
}

const cal = await buscarCalendario();
mkdirSync(OUT, { recursive: true });
for (const tema of ["dark", "light"]) {
  writeFileSync(`${OUT}/contribuicoes-${tema}.svg`, gerarSVG(cal, tema));
}
console.log(`OK: ${cal.totalContributions} contribuições`);
