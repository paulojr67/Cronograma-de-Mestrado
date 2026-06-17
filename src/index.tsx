import { Hono } from 'hono'
import { renderer } from './renderer'
import { tasks, phases, weeks, criticalPath, stats, partners } from './data/schedule'

const app = new Hono()

app.use(renderer)

// API: dados do cronograma em JSON
app.get('/api/schedule', (c) => {
  return c.json({ tasks, phases, weeks, criticalPath, stats, partners })
})

// API: tarefas filtradas por fase
app.get('/api/tasks/:phaseId', (c) => {
  const phaseId = c.req.param('phaseId')
  const filtered = tasks.filter(t => t.phaseId === phaseId)
  return c.json({ phaseId, count: filtered.length, tasks: filtered })
})

// API: caminho crítico detalhado
app.get('/api/critical-path', (c) => {
  const criticalTasks = tasks.filter(t => criticalPath.includes(t.id))
  return c.json({ count: criticalTasks.length, tasks: criticalTasks })
})

// API: tarefas por parceiro
app.get('/api/partners/:partnerId', (c) => {
  const partnerId = c.req.param('partnerId')
  const partner = partners.find(p => p.id === partnerId)
  const partnerTasks = tasks.filter(t => t.partnerId === partnerId)
  return c.json({ partner, count: partnerTasks.length, tasks: partnerTasks })
})

// Página principal
app.get('/', (c) => {
  return c.render(
    <>
      {/* HEADER */}
      <header class="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white shadow-xl">
        <div class="max-w-[1600px] mx-auto px-6 py-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <i class="fa-solid fa-leaf text-3xl text-emerald-200"></i>
                <h1 class="text-2xl md:text-4xl font-bold tracking-tight">
                  Cronograma de Mestrado
                </h1>
              </div>
              <p class="text-emerald-100 text-sm md:text-base">
                <i class="fa-solid fa-flask-vial mr-2"></i>
                Nanoformulação Polimérica de <em class="italic font-semibold">Syzygium cumini</em> com potencial neuroprotetor contra Alzheimer
              </p>
              <p class="text-emerald-200 text-xs md:text-sm mt-1">
                <i class="fa-solid fa-calendar-days mr-2"></i>
                {stats.startDate} → <strong>{stats.endDate}</strong>
              </p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
              <div class="bg-white/10 backdrop-blur rounded-lg px-3 py-3 border border-white/20">
                <div class="text-2xl md:text-3xl font-black">{stats.totalWeeks}</div>
                <div class="text-[10px] uppercase tracking-wider text-emerald-100">Semanas</div>
              </div>
              <div class="bg-white/10 backdrop-blur rounded-lg px-3 py-3 border border-white/20">
                <div class="text-2xl md:text-3xl font-black">{stats.totalTasks}</div>
                <div class="text-[10px] uppercase tracking-wider text-emerald-100">Tarefas</div>
              </div>
              <div class="bg-red-500/30 backdrop-blur rounded-lg px-3 py-3 border border-red-300/40">
                <div class="text-2xl md:text-3xl font-black">{stats.criticalTasks}</div>
                <div class="text-[10px] uppercase tracking-wider text-red-100">Críticas</div>
              </div>
              <div class="bg-yellow-400/30 backdrop-blur rounded-lg px-3 py-3 border border-yellow-200/40">
                <div class="text-2xl md:text-3xl font-black">{stats.milestones}</div>
                <div class="text-[10px] uppercase tracking-wider text-yellow-100">Marcos</div>
              </div>
              <div class="bg-blue-500/30 backdrop-blur rounded-lg px-3 py-3 border border-blue-300/40">
                <div class="text-2xl md:text-3xl font-black">{stats.partners}</div>
                <div class="text-[10px] uppercase tracking-wider text-blue-100">Parceiros</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NAVEGAÇÃO DE ABAS */}
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-[1600px] mx-auto px-6">
          <div class="flex gap-1 overflow-x-auto" id="tab-nav">
            <button data-tab="gantt" class="tab-btn active px-5 py-4 text-sm font-semibold border-b-2 border-emerald-600 text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-chart-gantt mr-2"></i>Gráfico de Gantt
            </button>
            <button data-tab="phases" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-layer-group mr-2"></i>Por Fase
            </button>
            <button data-tab="critical" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-route mr-2"></i>Caminho Crítico
            </button>
            <button data-tab="partners" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-handshake mr-2"></i>Parcerias
            </button>
            <button data-tab="weeks" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-calendar-week mr-2"></i>Semana a Semana
            </button>
            <button data-tab="writing" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-pen-to-square mr-2"></i>Plano de Escrita
            </button>
            <button data-tab="strategy" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-lightbulb mr-2"></i>Estratégia Q1
            </button>
            <button data-tab="howto" class="tab-btn px-5 py-4 text-sm font-semibold border-b-2 border-transparent text-slate-600 hover:text-emerald-700 whitespace-nowrap">
              <i class="fa-solid fa-circle-question mr-2"></i>Como Usar
            </button>
          </div>
        </div>
      </nav>

      {/* BARRA DE PROGRESSO GLOBAL */}
      <div class="bg-white border-b border-slate-200 sticky top-[57px] z-20">
        <div class="max-w-[1600px] mx-auto px-4 md:px-6 py-3">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2 flex-shrink-0">
              <i class="fa-solid fa-chart-line text-emerald-600"></i>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Progresso Geral</span>
            </div>
            <div class="flex-1 min-w-[200px]">
              <div class="relative h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div id="progress-bar-fill" class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out rounded-full"
                     style="width: 0%"></div>
                <div id="progress-bar-label" class="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                  0 / 0 tarefas (0%)
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button id="btn-export" class="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 font-semibold transition" title="Exportar progresso para arquivo JSON">
                <i class="fa-solid fa-download mr-1"></i>Exportar
              </button>
              <label for="file-import" class="cursor-pointer text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 font-semibold transition" title="Importar progresso de arquivo JSON">
                <i class="fa-solid fa-upload mr-1"></i>Importar
              </label>
              <input type="file" id="file-import" accept=".json" class="hidden" />
              <button id="btn-reset" class="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 font-semibold transition" title="Resetar todo o progresso">
                <i class="fa-solid fa-trash-can mr-1"></i>Resetar
              </button>
              <a href="/static/cronograma-netlify.zip" download class="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 font-semibold transition" title="Baixar pacote estático pronto para Netlify (drag & drop)">
                <i class="fa-solid fa-cloud-arrow-down mr-1"></i>Baixar p/ Netlify
              </a>
              <button id="btn-supabase" class="text-xs px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg border border-teal-200 font-semibold transition" title="Configurar sincronização Supabase (multi-dispositivo)">
                <i class="fa-solid fa-database mr-1"></i>Supabase
              </button>
              <button id="sb-status" class="text-xs px-2 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer" title="Status de sincronização">
                <i class="fa-solid fa-cloud-arrow-up text-slate-400"></i>
                <span class="hidden md:inline text-slate-400">Local apenas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main class="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* LEGENDA DAS FASES */}
        <section id="phase-legend" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-600">
              <i class="fa-solid fa-palette mr-2"></i>Legenda das Fases
            </h2>
            <button id="toggle-critical" class="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full border border-red-200 font-semibold transition">
              <i class="fa-solid fa-eye mr-1"></i><span id="toggle-critical-label">Destacar Caminho Crítico</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-2" id="phase-chips"></div>
        </section>

        {/* CONTEÚDO DAS ABAS */}
        <section id="tab-gantt" class="tab-content">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-4 border-b border-slate-200 bg-slate-50">
              <h2 class="text-lg font-bold text-slate-800">
                <i class="fa-solid fa-chart-gantt text-emerald-600 mr-2"></i>
                Visão Geral — Gráfico de Gantt
              </h2>
              <p class="text-xs text-slate-500 mt-1">
                Clique em qualquer barra para ver detalhes. Tarefas em <span class="text-red-600 font-semibold">vermelho pulsante</span> são do caminho crítico.
              </p>
            </div>
            <div class="overflow-x-auto" id="gantt-container"></div>
          </div>
        </section>

        <section id="tab-phases" class="tab-content hidden">
          <div id="phases-container" class="space-y-4"></div>
        </section>

        <section id="tab-critical" class="tab-content hidden">
          <div class="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-5 mb-6">
            <h2 class="text-xl font-bold text-red-900 mb-2">
              <i class="fa-solid fa-triangle-exclamation mr-2"></i>Caminho Crítico
            </h2>
            <p class="text-red-800 text-sm">
              Estas são as tarefas que <strong>não podem atrasar de jeito nenhum</strong>. Qualquer atraso aqui empurra a data da Qualificação.
              O sequenciamento abaixo garante que a <strong>prova de conceito da nanoformulação</strong> e os <strong>primeiros resultados de inibição enzimática + Zebrafish</strong> estejam prontos para Agosto/2026.
            </p>
          </div>
          <div id="critical-container" class="space-y-3"></div>
        </section>

        <section id="tab-weeks" class="tab-content hidden">
          <div id="weeks-container" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"></div>
        </section>

        <section id="tab-partners" class="tab-content hidden">
          <div id="partners-container"></div>
        </section>

        <section id="tab-writing" class="tab-content hidden">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-500 rounded-lg p-5 mb-6">
            <h2 class="text-xl font-bold text-slate-800 mb-2">
              <i class="fa-solid fa-pen-to-square mr-2"></i>Plano de Escrita Paralela
            </h2>
            <p class="text-slate-700 text-sm">
              <strong>Princípio chave:</strong> escrever EM TEMPO REAL, não no final. Cada semana de bancada deve gerar 1-2 páginas de Materiais & Métodos.
              A revisão bibliográfica começa na <strong>Semana 1</strong> e segue paralela ao trabalho experimental.
            </p>
          </div>
          <div id="writing-container" class="space-y-4"></div>
        </section>

        <section id="tab-strategy" class="tab-content hidden">
          <div id="strategy-container"></div>
        </section>

        <section id="tab-howto" class="tab-content hidden">
          <div id="howto-container"></div>
        </section>

        {/* RODAPÉ */}
        <footer class="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>
            <i class="fa-solid fa-graduation-cap mr-1"></i>
            Cronograma elaborado para qualificação de Mestrado — Programa de Pós-Graduação em Nanobiotecnologia
          </p>
          <p class="mt-1">
            Referências base: DA ROSA et al. (2024) · IMRAN et al. (2025) · Metodologia PCL (2026) · MORAES et al. (2026) · Planejamento Fatorial (DoE) com Prof. ALEK
          </p>
        </footer>
      </main>

      {/* MODAL DE DETALHE DE TAREFA */}
      <div id="task-modal" class="hidden fixed inset-0 bg-black/60 z-50 items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div id="modal-content"></div>
        </div>
      </div>

      <script src="/static/app.js"></script>
    </>
  )
})

export default app
