// ============================================================================
// BUILD ESTÁTICO DROP-READY PARA NETLIFY
// ----------------------------------------------------------------------------
// Gera UM ÚNICO index.html auto-contido com:
//   • Tailwind + Font Awesome via CDN
//   • CSS inline (style.css embutido em <style>)
//   • JS inline (app.js embutido em <script>)
//   • DADOS embutidos (window.__SCHEDULE__) — não precisa de API
//   • supabase-schema.sql como arquivo extra para o usuário copiar
//
// Resultado: o usuário arrasta a PASTA dist-static/ no Netlify Drop e PRONTO.
// Pode também abrir o index.html diretamente no navegador (file://) que funciona.
// ============================================================================

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'dist-static')
const PUBLIC_DIR = path.join(ROOT, 'public')
const API_BASE = process.env.API_BASE || 'http://localhost:3000'

console.log('🏗️  Build estático DROP-READY para Netlify\n')

// ============ 1) BUSCAR DADOS DA API LOCAL ============
async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao buscar ${url}: ${res.status}`)
  return res.json()
}
const fullData = await fetchJSON(`${API_BASE}/api/schedule`)
console.log(`   ✓ ${fullData.tasks.length} tarefas, ${fullData.partners.length} parceiros`)

// ============ 2) LIMPAR E PREPARAR DIRETÓRIO ============
await fs.rm(OUT_DIR, { recursive: true, force: true })
await fs.mkdir(OUT_DIR, { recursive: true })

// ============ 3) LER CSS E JS PARA EMBUTIR ============
const cssContent = await fs.readFile(path.join(PUBLIC_DIR, 'static', 'style.css'), 'utf-8')
let jsContent = await fs.readFile(path.join(PUBLIC_DIR, 'static', 'app.js'), 'utf-8')

// Substituir referência ao SQL para apontar localmente
jsContent = jsContent.replace(
  /href="static\/supabase-schema\.sql"/g,
  'href="supabase-schema.sql"'
)

console.log(`   ✓ CSS embutido (${(cssContent.length/1024).toFixed(1)} KB)`)
console.log(`   ✓ JS embutido (${(jsContent.length/1024).toFixed(1)} KB)`)

// ============ 4) COPIAR ARQUIVOS AUXILIARES ============
const sqlSrc = path.join(ROOT, 'supabase-schema.sql')
const sqlContent = await fs.readFile(sqlSrc, 'utf-8')
await fs.writeFile(path.join(OUT_DIR, 'supabase-schema.sql'), sqlContent)
console.log(`   ✓ supabase-schema.sql copiado (${(sqlContent.length/1024).toFixed(1)} KB)`)

// ============ 5) GERAR INDEX.HTML AUTO-CONTIDO ============
const stats = fullData.stats

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cronograma Mestrado — S. cumini Nanoformulação Neuroprotetora</title>
<meta name="description" content="Cronograma interativo do projeto de mestrado em nanobiotecnologia com Syzygium cumini para qualificação em Agosto/2026. Inclui sync Supabase opcional." />
<meta name="theme-color" content="#0d9488" />
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
<style>
${cssContent}
</style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased">

<header class="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-xl">
  <div class="max-w-[1600px] mx-auto px-6 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <i class="fa-solid fa-leaf text-3xl text-emerald-200"></i>
          <h1 class="text-2xl md:text-4xl font-bold tracking-tight">Cronograma de Mestrado</h1>
        </div>
        <p class="text-emerald-100 text-sm md:text-base">
          <i class="fa-solid fa-flask-vial mr-2"></i>
          Nanoformulação Polimérica de <em class="italic font-semibold">Syzygium cumini</em> com potencial neuroprotetor contra Alzheimer
        </p>
        <p class="text-emerald-200 text-xs md:text-sm mt-1">
          <i class="fa-solid fa-calendar-days mr-2"></i>
          ${stats.startDate} → <strong>${stats.endDate}</strong>
        </p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
        <div class="bg-white/10 backdrop-blur rounded-lg px-3 py-3 border border-white/20">
          <div class="text-2xl md:text-3xl font-black">${stats.totalWeeks}</div>
          <div class="text-[10px] uppercase tracking-wider text-emerald-100">Semanas</div>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-lg px-3 py-3 border border-white/20">
          <div class="text-2xl md:text-3xl font-black">${stats.totalTasks}</div>
          <div class="text-[10px] uppercase tracking-wider text-emerald-100">Tarefas</div>
        </div>
        <div class="bg-red-500/30 backdrop-blur rounded-lg px-3 py-3 border border-red-300/40">
          <div class="text-2xl md:text-3xl font-black">${stats.criticalTasks}</div>
          <div class="text-[10px] uppercase tracking-wider text-red-100">Críticas</div>
        </div>
        <div class="bg-yellow-400/30 backdrop-blur rounded-lg px-3 py-3 border border-yellow-200/40">
          <div class="text-2xl md:text-3xl font-black">${stats.milestones}</div>
          <div class="text-[10px] uppercase tracking-wider text-yellow-100">Marcos</div>
        </div>
        <div class="bg-blue-500/30 backdrop-blur rounded-lg px-3 py-3 border border-blue-300/40">
          <div class="text-2xl md:text-3xl font-black">${stats.partners}</div>
          <div class="text-[10px] uppercase tracking-wider text-blue-100">Parceiros</div>
        </div>
      </div>
    </div>
  </div>
</header>

<nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
  <div class="max-w-[1600px] mx-auto px-6">
    <div class="flex gap-1 overflow-x-auto" id="tab-nav">
      <button data-tab="gantt" class="tab-btn active px-5 py-4 text-sm font-semibold border-b-2 border-emerald-600 text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-chart-gantt mr-2"></i>Gráfico de Gantt</button>
      <button data-tab="phases" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-layer-group mr-2"></i>Por Fase</button>
      <button data-tab="critical" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-route mr-2"></i>Caminho Crítico</button>
      <button data-tab="partners" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-handshake mr-2"></i>Parcerias</button>
      <button data-tab="weeks" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-calendar-week mr-2"></i>Semana a Semana</button>
      <button data-tab="writing" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-pen-to-square mr-2"></i>Plano de Escrita</button>
      <button data-tab="strategy" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-lightbulb mr-2"></i>Estratégia Q1</button>
      <button data-tab="howto" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap"><i class="fa-solid fa-circle-question mr-2"></i>Como Usar</button>
    </div>
  </div>
</nav>

<div class="bg-white border-b border-slate-200 sticky top-[57px] z-20">
  <div class="max-w-[1600px] mx-auto px-4 md:px-6 py-3">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2 flex-shrink-0">
        <i class="fa-solid fa-chart-line text-emerald-600"></i>
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Progresso Geral</span>
      </div>
      <div class="flex-1 min-w-[200px]">
        <div class="relative h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div id="progress-bar-fill" class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out rounded-full" style="width: 0%"></div>
          <div id="progress-bar-label" class="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">0 / 0 tarefas (0%)</div>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <button id="btn-export" class="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 font-semibold transition" title="Exportar progresso para arquivo JSON"><i class="fa-solid fa-download mr-1"></i>Exportar</button>
        <label for="file-import" class="cursor-pointer text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 font-semibold transition" title="Importar progresso de arquivo JSON"><i class="fa-solid fa-upload mr-1"></i>Importar</label>
        <input type="file" id="file-import" accept=".json" class="hidden" />
        <button id="btn-reset" class="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 font-semibold transition" title="Resetar todo o progresso"><i class="fa-solid fa-trash-can mr-1"></i>Resetar</button>
        <button id="btn-supabase" class="text-xs px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg border border-teal-200 font-semibold transition" title="Configurar sincronização Supabase (multi-dispositivo)"><i class="fa-solid fa-database mr-1"></i>Supabase</button>
        <button id="sb-status" class="text-xs px-2 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer" title="Status de sincronização"><i class="fa-solid fa-cloud-arrow-up text-slate-400"></i><span class="hidden md:inline text-slate-400">Local apenas</span></button>
      </div>
    </div>
  </div>
</div>

<main class="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8">
  <section id="phase-legend" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-sm font-bold uppercase tracking-wider text-slate-600"><i class="fa-solid fa-palette mr-2"></i>Legenda das Fases</h2>
      <button id="toggle-critical" class="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full border border-red-200 font-semibold transition"><i class="fa-solid fa-eye mr-1"></i><span id="toggle-critical-label">Destacar Caminho Crítico</span></button>
    </div>
    <div class="flex flex-wrap gap-2" id="phase-chips"></div>
  </section>

  <section id="tab-gantt" class="tab-content">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 bg-slate-50">
        <h2 class="text-lg font-bold text-slate-800"><i class="fa-solid fa-chart-gantt text-emerald-600 mr-2"></i>Visão Geral — Gráfico de Gantt</h2>
        <p class="text-xs text-slate-500 mt-1">Clique em qualquer barra para ver detalhes. Tarefas em <span class="text-red-600 font-semibold">vermelho pulsante</span> são do caminho crítico.</p>
      </div>
      <div class="overflow-x-auto" id="gantt-container"></div>
    </div>
  </section>

  <section id="tab-phases" class="tab-content hidden"><div id="phases-container" class="space-y-4"></div></section>

  <section id="tab-critical" class="tab-content hidden">
    <div class="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-5 mb-6">
      <h2 class="text-xl font-bold text-red-900 mb-2"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Caminho Crítico</h2>
      <p class="text-red-800 text-sm">Estas são as tarefas que <strong>não podem atrasar de jeito nenhum</strong>. Qualquer atraso aqui empurra a data da Qualificação.</p>
    </div>
    <div id="critical-container" class="space-y-3"></div>
  </section>

  <section id="tab-partners" class="tab-content hidden"><div id="partners-container"></div></section>
  <section id="tab-weeks" class="tab-content hidden"><div id="weeks-container" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"></div></section>

  <section id="tab-writing" class="tab-content hidden">
    <div class="bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-500 rounded-lg p-5 mb-6">
      <h2 class="text-xl font-bold text-slate-800 mb-2"><i class="fa-solid fa-pen-to-square mr-2"></i>Plano de Escrita Paralela</h2>
      <p class="text-slate-700 text-sm"><strong>Princípio chave:</strong> escrever EM TEMPO REAL, não no final.</p>
    </div>
    <div id="writing-container" class="space-y-4"></div>
  </section>

  <section id="tab-strategy" class="tab-content hidden"><div id="strategy-container"></div></section>
  <section id="tab-howto" class="tab-content hidden"><div id="howto-container"></div></section>

  <footer class="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
    <p><i class="fa-solid fa-graduation-cap mr-1"></i>Cronograma elaborado para qualificação de Mestrado — Programa de Pós-Graduação em Nanobiotecnologia</p>
    <p class="mt-1">Referências base: DA ROSA et al. (2024) · IMRAN et al. (2025) · RAJKUMAR et al. (2025) · MORAES et al. (2026)</p>
    <p class="mt-2 text-slate-400">Build estático auto-contido · ${new Date().toISOString().split('T')[0]}</p>
  </footer>
</main>

<div id="task-modal" class="hidden fixed inset-0 bg-black/60 z-50 items-center justify-center p-4 backdrop-blur-sm">
  <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div id="modal-content"></div>
  </div>
</div>

<!-- ============ DADOS EMBUTIDOS ============ -->
<script id="schedule-data">
window.__SCHEDULE__ = ${JSON.stringify(fullData)};
</script>

<!-- ============ APP ============ -->
<script>
${jsContent}
</script>

</body>
</html>`

await fs.writeFile(path.join(OUT_DIR, 'index.html'), html)
const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1)
console.log(`   ✓ index.html gerado (${sizeKB} KB — auto-contido)`)

// ============ 6) NETLIFY HEADERS (cache otimizado) ============
const netlifyToml = `# Netlify configuration — Cronograma Mestrado S. cumini
[build]
  publish = "."

# Cache HTML por menos tempo (atualiza facilmente quando você re-deploya)
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=300, must-revalidate"

[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "public, max-age=300, must-revalidate"

# SQL pode ser cacheado mais
[[headers]]
  for = "/*.sql"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
    Cache-Control = "public, max-age=3600"
`
await fs.writeFile(path.join(OUT_DIR, 'netlify.toml'), netlifyToml)

const headers = `/*.html
  Cache-Control: public, max-age=300, must-revalidate

/*.sql
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
`
await fs.writeFile(path.join(OUT_DIR, '_headers'), headers)

// ============ 7) README NA RAIZ DA PASTA ============
const readme = `# 🌿 Cronograma Mestrado — S. cumini

Site estático **drop-ready** para o Netlify.

## 🚀 Como hospedar (30 segundos)

1. Acesse https://app.netlify.com/drop
2. Arraste **esta pasta inteira** (\`dist-static\`) para a área de drop
3. Pronto, no ar!

## 📁 Estrutura (mínima)

\`\`\`
dist-static/
├── index.html              ← TUDO está aqui (HTML + CSS + JS + dados)
├── supabase-schema.sql     ← Script SQL para configurar o Supabase
├── netlify.toml            ← Config Netlify
├── _headers                ← Headers HTTP
└── README.md               ← Este arquivo
\`\`\`

## ☁️ Sincronização Supabase (opcional)

Para sincronizar entre dispositivos:

1. Crie conta gratuita em https://supabase.com
2. Crie um novo projeto
3. No Dashboard → **SQL Editor** → cole o conteúdo de \`supabase-schema.sql\` → **RUN**
4. No site, clique no botão **"Supabase"** no topo
5. Cole \`Project URL\` e \`anon public key\` (Settings → API)
6. Salvar — pronto, multi-dispositivo!

## ✅ Sem Supabase?

Tudo funciona em modo local (localStorage do navegador). Use os botões **Exportar/Importar** para backup manual.

---

📅 Build: ${new Date().toISOString().split('T')[0]}
`
await fs.writeFile(path.join(OUT_DIR, 'README.md'), readme)

// ============ RESUMO FINAL ============
const files = await fs.readdir(OUT_DIR)
console.log('\n📦 Conteúdo de dist-static/:')
for (const f of files) {
  const stat = await fs.stat(path.join(OUT_DIR, f))
  console.log(`   ${f.padEnd(28)} ${(stat.size/1024).toFixed(1).padStart(6)} KB`)
}

console.log('\n✅ Build concluído!')
console.log('\n🚀 Próximo passo:')
console.log('   1. Arraste a pasta dist-static/ em https://app.netlify.com/drop')
console.log('   2. OU: descompacte o ZIP cronograma-netlify.zip e arraste o conteúdo\n')
