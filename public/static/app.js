/**
 * Cronograma Interativo — Mestrado S. cumini
 * Renderiza Gantt, fases, caminho crítico, semana-a-semana, escrita e estratégia Q1
 */

let SCHEDULE = null;
let highlightCritical = false;
let activePhaseFilter = null;

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/schedule');
    SCHEDULE = await res.json();

    renderPhaseChips();
    renderGantt();
    renderPhases();
    renderCriticalPath();
    renderWeeks();
    renderWriting();
    renderStrategy();

    setupTabs();
    setupCriticalToggle();
    setupModal();
  } catch (e) {
    console.error('Erro ao carregar cronograma:', e);
    document.body.insertAdjacentHTML('afterbegin',
      '<div class="bg-red-100 text-red-800 p-4 text-center">Erro ao carregar dados do cronograma.</div>');
  }
});

// ============ HELPERS ============
function getPhase(id) {
  return SCHEDULE.phases.find(p => p.id === id);
}

function isCritical(taskId) {
  return SCHEDULE.criticalPath.includes(taskId);
}

// ============ TABS ============
function setupTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      contents.forEach(c => c.classList.add('hidden'));
      document.getElementById('tab-' + tab).classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ============ TOGGLE CAMINHO CRÍTICO ============
function setupCriticalToggle() {
  const btn = document.getElementById('toggle-critical');
  const label = document.getElementById('toggle-critical-label');
  btn.addEventListener('click', () => {
    highlightCritical = !highlightCritical;
    label.textContent = highlightCritical ? 'Mostrar Tudo' : 'Destacar Caminho Crítico';
    btn.classList.toggle('bg-red-600', highlightCritical);
    btn.classList.toggle('text-white', highlightCritical);
    btn.classList.toggle('bg-red-50', !highlightCritical);
    btn.classList.toggle('text-red-700', !highlightCritical);
    renderGantt();
  });
}

// ============ LEGENDA / CHIPS DAS FASES ============
function renderPhaseChips() {
  const container = document.getElementById('phase-chips');
  container.innerHTML = SCHEDULE.phases.map(p => `
    <div class="phase-chip flex items-center gap-2 px-3 py-2 rounded-full border-2 ${p.borderColor} ${p.bgColor}"
         data-phase="${p.id}" title="${p.description}">
      <i class="fa-solid ${p.icon}" style="color:${p.color}"></i>
      <span class="text-xs font-semibold" style="color:${p.color}">${p.name}</span>
    </div>
  `).join('');

  container.querySelectorAll('.phase-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const phaseId = chip.dataset.phase;
      activePhaseFilter = activePhaseFilter === phaseId ? null : phaseId;
      container.querySelectorAll('.phase-chip').forEach(c => {
        c.classList.toggle('dimmed', activePhaseFilter && c.dataset.phase !== activePhaseFilter);
      });
      renderGantt();
    });
  });
}

// ============ GANTT CHART ============
function renderGantt() {
  const container = document.getElementById('gantt-container');
  const totalWeeks = SCHEDULE.weeks.length;
  const weekColWidth = 70; // px
  const taskRowHeight = 38;
  const labelWidth = 320;

  // Filtrar tasks
  let visibleTasks = SCHEDULE.tasks.slice();
  if (activePhaseFilter) {
    visibleTasks = visibleTasks.filter(t => t.phaseId === activePhaseFilter);
  }
  // Ordenar por startWeek depois por phase
  visibleTasks.sort((a, b) => {
    if (a.startWeek !== b.startWeek) return a.startWeek - b.startWeek;
    return SCHEDULE.phases.findIndex(p => p.id === a.phaseId) - SCHEDULE.phases.findIndex(p => p.id === b.phaseId);
  });

  // Header de semanas (agrupado por mês)
  const monthGroups = {};
  SCHEDULE.weeks.forEach(w => {
    if (!monthGroups[w.month]) monthGroups[w.month] = [];
    monthGroups[w.month].push(w);
  });

  let html = `
    <div style="min-width: ${labelWidth + totalWeeks * weekColWidth + 20}px;" class="relative">
      <!-- Header Meses -->
      <div class="flex sticky top-0 bg-white z-20 border-b-2 border-slate-200">
        <div style="width:${labelWidth}px" class="flex-shrink-0 px-3 py-2 font-bold text-xs uppercase tracking-wider text-slate-500 border-r border-slate-200">
          Tarefa
        </div>
        <div class="flex">
          ${Object.entries(monthGroups).map(([month, ws]) => `
            <div style="width:${ws.length * weekColWidth}px" class="text-center font-bold text-xs uppercase tracking-wider py-2 border-r border-slate-200 bg-slate-50">
              ${month}
            </div>
          `).join('')}
        </div>
      </div>
      <!-- Header Semanas -->
      <div class="flex sticky top-[33px] bg-white z-10 border-b border-slate-200">
        <div style="width:${labelWidth}px" class="flex-shrink-0 px-3 py-2 text-xs text-slate-400 border-r border-slate-200">
          ${visibleTasks.length} tarefa(s)
        </div>
        <div class="flex">
          ${SCHEDULE.weeks.map(w => `
            <div style="width:${weekColWidth}px"
              class="text-center text-[10px] py-2 border-r border-slate-100 ${w.number === 16 ? 'bg-yellow-50 font-bold text-yellow-800' : 'text-slate-500'}">
              <div class="font-bold">${w.label}</div>
              <div>${w.startDate}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Linhas -->
      <div class="relative">
        ${visibleTasks.map((task, idx) => {
          const phase = getPhase(task.phaseId);
          const offset = (task.startWeek - 1) * weekColWidth;
          const width = (task.endWeek - task.startWeek + 1) * weekColWidth - 4;
          const critical = isCritical(task.id);
          const dimmed = highlightCritical && !critical;

          let barClasses = 'gantt-bar absolute rounded-md flex items-center px-2 text-white text-xs font-semibold shadow-sm';
          if (critical) barClasses += ' critical-task';
          if (dimmed) barClasses += ' opacity-30';

          const isMilestone = task.type === 'milestone';

          return `
            <div class="flex border-b border-slate-100 hover:bg-slate-50 transition" style="height:${taskRowHeight}px">
              <div style="width:${labelWidth}px" class="flex-shrink-0 px-3 py-2 text-xs border-r border-slate-200 flex items-center gap-2 ${dimmed ? 'opacity-40' : ''}">
                <span class="flex-shrink-0 w-2 h-2 rounded-full" style="background:${phase.color}"></span>
                <span class="font-mono text-[10px] text-slate-400">${task.id}</span>
                <span class="truncate ${critical ? 'font-bold text-slate-800' : 'text-slate-700'}" title="${task.name}">
                  ${task.name}
                </span>
              </div>
              <div class="relative flex-1" style="height:${taskRowHeight}px">
                ${SCHEDULE.weeks.map(w => `
                  <div class="absolute top-0 bottom-0 border-r border-slate-100" style="left:${(w.number - 1) * weekColWidth}px; width:${weekColWidth}px"></div>
                `).join('')}
                <div class="${barClasses}"
                  style="left:${offset + 2}px; top:6px; bottom:6px; width:${width}px; background:${isMilestone ? 'linear-gradient(135deg, #ca8a04, #eab308)' : phase.color};"
                  data-task-id="${task.id}"
                  title="${task.name}">
                  <i class="fa-solid ${isMilestone ? 'fa-flag-checkered' : phase.icon} mr-1.5"></i>
                  <span class="truncate">${isMilestone ? task.name.replace(/^[🚦🎓📝]\s*/, '') : 'S' + task.startWeek + '-S' + task.endWeek}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  container.innerHTML = html;

  // Click handlers
  container.querySelectorAll('.gantt-bar').forEach(bar => {
    bar.addEventListener('click', () => openModal(bar.dataset.taskId));
  });
}

// ============ POR FASE ============
function renderPhases() {
  const container = document.getElementById('phases-container');
  container.innerHTML = SCHEDULE.phases.map(phase => {
    const phaseTasks = SCHEDULE.tasks.filter(t => t.phaseId === phase.id);
    if (phaseTasks.length === 0) return '';

    return `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-5 border-b-2" style="border-color:${phase.color}; background:${phase.color}10">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background:${phase.color}">
                <i class="fa-solid ${phase.icon} text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg" style="color:${phase.color}">${phase.name}</h3>
                <p class="text-xs text-slate-600">${phase.description}</p>
              </div>
            </div>
            <span class="text-xs px-3 py-1 rounded-full font-semibold" style="background:${phase.color}; color:white">
              ${phaseTasks.length} tarefas
            </span>
          </div>
        </div>
        <div class="divide-y divide-slate-100">
          ${phaseTasks.map(t => taskRowHTML(t)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function taskRowHTML(task) {
  const critical = isCritical(task.id);
  const phase = getPhase(task.phaseId);
  return `
    <div class="task-card p-4 cursor-pointer hover:bg-slate-50" data-task-id="${task.id}" onclick="openModal('${task.id}')">
      <div class="flex items-start justify-between gap-3 flex-wrap">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">${task.id}</span>
            ${critical ? '<span class="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-fire mr-1"></i>CRÍTICA</span>' : ''}
            ${task.type === 'milestone' ? '<span class="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-flag mr-1"></i>MARCO</span>' : ''}
            <span class="text-[10px] font-semibold text-slate-500">Semana ${task.startWeek}${task.endWeek !== task.startWeek ? '–' + task.endWeek : ''}</span>
          </div>
          <h4 class="font-semibold text-sm text-slate-800">${task.name}</h4>
          <p class="text-xs text-slate-600 mt-1 line-clamp-2">${task.description}</p>
          ${task.deliverable ? `<div class="text-[11px] text-emerald-700 mt-2"><i class="fa-solid fa-circle-check mr-1"></i><strong>Entregável:</strong> ${task.deliverable}</div>` : ''}
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300 text-xs mt-1"></i>
      </div>
    </div>
  `;
}

// ============ CAMINHO CRÍTICO ============
function renderCriticalPath() {
  const container = document.getElementById('critical-container');
  const criticalTasks = SCHEDULE.criticalPath.map(id => SCHEDULE.tasks.find(t => t.id === id)).filter(Boolean);

  container.innerHTML = criticalTasks.map((task, idx) => {
    const phase = getPhase(task.phaseId);
    const isLast = idx === criticalTasks.length - 1;
    return `
      <div class="relative">
        <div class="flex gap-4 items-stretch">
          <!-- Bullet/conector -->
          <div class="flex flex-col items-center flex-shrink-0">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md flex-shrink-0"
              style="background:${task.type === 'milestone' ? '#ca8a04' : phase.color}">
              ${task.type === 'milestone' ? '<i class="fa-solid fa-flag-checkered"></i>' : (idx + 1)}
            </div>
            ${!isLast ? '<div class="w-0.5 flex-1 bg-gradient-to-b from-red-400 to-red-200 mt-1"></div>' : ''}
          </div>
          <!-- Card -->
          <div class="flex-1 bg-white rounded-lg shadow-sm border-l-4 border border-slate-200 p-4 cursor-pointer hover:shadow-md transition mb-3"
               style="border-left-color:${task.type === 'milestone' ? '#ca8a04' : '#dc2626'}"
               onclick="openModal('${task.id}')">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">${task.id}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider" style="color:${phase.color}">
                  <i class="fa-solid ${phase.icon} mr-1"></i>${phase.shortName}
                </span>
              </div>
              <span class="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                <i class="fa-regular fa-calendar mr-1"></i>S${task.startWeek}${task.endWeek !== task.startWeek ? '–S' + task.endWeek : ''}
              </span>
            </div>
            <h4 class="font-bold text-sm text-slate-800">${task.name}</h4>
            <p class="text-xs text-slate-600 mt-1">${task.description}</p>
            ${task.deliverable ? `<div class="text-[11px] text-emerald-700 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded"><i class="fa-solid fa-circle-check mr-1"></i>${task.deliverable}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============ SEMANA A SEMANA ============
function renderWeeks() {
  const container = document.getElementById('weeks-container');
  container.innerHTML = SCHEDULE.weeks.map(week => {
    const weekTasks = SCHEDULE.tasks.filter(t => t.startWeek <= week.number && t.endWeek >= week.number);
    const isQualWeek = week.number === 16;

    return `
      <div class="bg-white rounded-xl shadow-sm border ${isQualWeek ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-slate-200'} overflow-hidden">
        <div class="p-3 ${isQualWeek ? 'bg-gradient-to-r from-yellow-100 to-amber-100' : 'bg-slate-50'} border-b border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-sm ${isQualWeek ? 'text-yellow-900' : 'text-slate-800'}">
                ${isQualWeek ? '<i class="fa-solid fa-graduation-cap mr-1"></i>' : ''}
                Semana ${week.number} — ${week.label}
              </h3>
              <p class="text-[11px] text-slate-600">${week.startDate} → ${week.endDate} · ${week.month}</p>
            </div>
            <span class="text-xs font-bold ${isQualWeek ? 'text-yellow-800' : 'text-slate-500'}">
              ${weekTasks.length} ativ.
            </span>
          </div>
        </div>
        <div class="p-3 space-y-1.5 max-h-64 overflow-y-auto">
          ${weekTasks.length === 0 ? '<p class="text-xs text-slate-400 italic">Sem atividades</p>' :
            weekTasks.map(t => {
              const phase = getPhase(t.phaseId);
              const critical = isCritical(t.id);
              return `
                <div class="text-xs p-2 rounded border-l-2 cursor-pointer hover:bg-slate-50 transition"
                     style="border-color:${phase.color}; background:${phase.color}08"
                     onclick="openModal('${t.id}')">
                  <div class="flex items-center gap-1.5 mb-0.5">
                    <i class="fa-solid ${phase.icon} text-[10px]" style="color:${phase.color}"></i>
                    <span class="font-mono text-[9px] text-slate-500">${t.id}</span>
                    ${critical ? '<span class="text-[9px] text-red-600"><i class="fa-solid fa-fire"></i></span>' : ''}
                  </div>
                  <div class="font-medium text-slate-700 line-clamp-2">${t.name}</div>
                </div>
              `;
            }).join('')
          }
        </div>
      </div>
    `;
  }).join('');
}

// ============ PLANO DE ESCRITA ============
function renderWriting() {
  const container = document.getElementById('writing-container');
  const writingTasks = SCHEDULE.tasks.filter(t => t.phaseId === 'writing' || t.id.startsWith('W'));

  const tips = [
    { icon: 'fa-clock', title: 'Comece HOJE (Semana 1)', text: 'A revisão bibliográfica deve começar na primeira semana e crescer continuamente. Use Mendeley/Zotero desde o dia 1.' },
    { icon: 'fa-microscope', title: 'Documente em tempo real', text: 'Cada protocolo executado vira parágrafo de Materiais & Métodos no MESMO dia. Nunca deixe para depois.' },
    { icon: 'fa-chart-line', title: 'Figuras prontas para publicar', text: 'Use GraphPad/Origin desde o início. Toda figura gerada já deve ter qualidade Q1 (300 dpi, fontes legíveis).' },
    { icon: 'fa-comments', title: 'Reuniões semanais com orientador', text: 'Agende 30 min toda sexta-feira. Leve sempre 1 figura nova + 1 dúvida específica.' },
    { icon: 'fa-file-export', title: 'Entrega antecipada (S14)', text: 'Entregue a dissertação ao orientador na S14, não na S15. Margem para revisão é essencial.' }
  ];

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      ${tips.map(tip => `
        <div class="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <i class="fa-solid ${tip.icon} text-2xl text-slate-600 mb-2"></i>
          <h4 class="font-bold text-sm text-slate-800 mb-1">${tip.title}</h4>
          <p class="text-xs text-slate-600">${tip.text}</p>
        </div>
      `).join('')}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 bg-slate-50">
        <h3 class="font-bold text-slate-800">
          <i class="fa-solid fa-book mr-2"></i>Cronograma de Escrita
        </h3>
      </div>
      <div class="divide-y divide-slate-100">
        ${writingTasks.map(t => taskRowHTML(t)).join('')}
      </div>
    </div>
  `;
}

// ============ ESTRATÉGIA Q1 ============
function renderStrategy() {
  const container = document.getElementById('strategy-container');
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Princípios -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="font-bold text-lg text-slate-800 mb-4">
          <i class="fa-solid fa-bullseye text-emerald-600 mr-2"></i>Princípios do Cronograma
        </h3>
        <ul class="space-y-3 text-sm text-slate-700">
          <li class="flex gap-3">
            <i class="fa-solid fa-1 bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 font-bold"></i>
            <div><strong>Aproveitar otimização anterior:</strong> os parâmetros de DA ROSA et al. (2024) economizam ~4 semanas que seriam gastas em DOE de extração.</div>
          </li>
          <li class="flex gap-3">
            <i class="fa-solid fa-2 bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 font-bold"></i>
            <div><strong>CEUA antecipada (Semana 1):</strong> aprovação ética é o gargalo invisível. Submissão na primeira semana garante zebrafish disponíveis na S9.</div>
          </li>
          <li class="flex gap-3">
            <i class="fa-solid fa-3 bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 font-bold"></i>
            <div><strong>Paralelismo inteligente:</strong> caracterização química (LC-MS/GC-MS) corre em paralelo com testes preliminares de matriz Gelatina/PLA.</div>
          </li>
          <li class="flex gap-3">
            <i class="fa-solid fa-4 bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 font-bold"></i>
            <div><strong>Feedback rápido em DLS/PZ:</strong> caracterização triage (S6-S7) permite otimizar Lote 2 ANTES de gastar tempo em FESEM/HRTEM caros.</div>
          </li>
          <li class="flex gap-3">
            <i class="fa-solid fa-5 bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 font-bold"></i>
            <div><strong>2 pontos GO/NO-GO:</strong> M1 (escolha da fração) e M2 (validação NP) protegem contra atrasos cascateados.</div>
          </li>
        </ul>
      </div>

      <!-- Riscos & Mitigações -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="font-bold text-lg text-slate-800 mb-4">
          <i class="fa-solid fa-shield-halved text-red-600 mr-2"></i>Riscos & Mitigações
        </h3>
        <div class="space-y-3 text-sm">
          <div class="border-l-4 border-red-400 bg-red-50 p-3 rounded">
            <div class="font-bold text-red-900 text-xs mb-1">⚠️ Atraso CEUA</div>
            <div class="text-red-800 text-xs">→ Submeter na S1; ter protocolo "alternativo" com SH-SY5Y para qualificação se zebrafish atrasar.</div>
          </div>
          <div class="border-l-4 border-orange-400 bg-orange-50 p-3 rounded">
            <div class="font-bold text-orange-900 text-xs mb-1">⚠️ NP fora dos critérios</div>
            <div class="text-orange-800 text-xs">→ Buffer de 1 semana em S7 para reformular; método alternativo (PLGA puro) em standby.</div>
          </div>
          <div class="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded">
            <div class="font-bold text-yellow-900 text-xs mb-1">⚠️ Fila em LC-MS/MS</div>
            <div class="text-yellow-800 text-xs">→ Agendar análises na S2 (antes mesmo de ter amostra final). HPLC-DAD interno como backup.</div>
          </div>
          <div class="border-l-4 border-blue-400 bg-blue-50 p-3 rounded">
            <div class="font-bold text-blue-900 text-xs mb-1">⚠️ Mortalidade alta zebrafish</div>
            <div class="text-blue-800 text-xs">→ Doses sub-letais conservadoras (10-25% CL50); n=12 por grupo para garantir poder estatístico.</div>
          </div>
        </div>
      </div>

      <!-- Estratégia Q1 -->
      <div class="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-lg p-6">
        <h3 class="font-bold text-xl mb-4">
          <i class="fa-solid fa-trophy mr-2"></i>Estratégia para Publicação Q1
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <div class="font-bold mb-2 text-emerald-100"><i class="fa-solid fa-newspaper mr-2"></i>Revistas-alvo</div>
            <ul class="space-y-1 text-xs">
              <li>• <em>Int. J. Biological Macromolecules</em> (IF ~8)</li>
              <li>• <em>Carbohydrate Polymers</em> (IF ~11)</li>
              <li>• <em>J. Drug Delivery Sci. Tech.</em> (IF ~5)</li>
              <li>• <em>Phytomedicine</em> (IF ~6)</li>
            </ul>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <div class="font-bold mb-2 text-emerald-100"><i class="fa-solid fa-list-check mr-2"></i>Checklist mínimo Q1</div>
            <ul class="space-y-1 text-xs">
              <li>✓ Identificação química definitiva (LC-MS/MS)</li>
              <li>✓ Caract. NP completa (≥6 técnicas)</li>
              <li>✓ Mecanismo (AChE/BChE + ROS)</li>
              <li>✓ In vivo (≥2 testes comportamentais)</li>
              <li>✓ Bioquímica cerebral ex vivo</li>
            </ul>
          </div>
          <div class="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <div class="font-bold mb-2 text-emerald-100"><i class="fa-solid fa-rocket mr-2"></i>Pós-Qualificação</div>
            <ul class="space-y-1 text-xs">
              <li>• Western blot (BDNF, ChAT)</li>
              <li>• Histologia cerebral</li>
              <li>• Modelo de Alzheimer (Aβ-induzido)</li>
              <li>• Estabilidade NP (3 meses)</li>
              <li>• Submissão até Dez/2026</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Hierarquia de prioridades -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 class="font-bold text-lg text-slate-800 mb-4">
          <i class="fa-solid fa-ranking-star text-yellow-600 mr-2"></i>Hierarquia de Prioridades para a Qualificação
        </h3>
        <div class="space-y-3">
          <div class="flex items-center gap-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="text-2xl font-black text-red-600">1º</div>
            <div class="flex-1">
              <div class="font-bold text-red-900 text-sm">Prova de conceito da nanoformulação</div>
              <div class="text-xs text-red-700">DLS, PZ, FESEM, EE% → demonstrar que a NP funciona estruturalmente</div>
            </div>
            <span class="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded">S6-S9</span>
          </div>
          <div class="flex items-center gap-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div class="text-2xl font-black text-orange-600">2º</div>
            <div class="flex-1">
              <div class="font-bold text-orange-900 text-sm">Inibição enzimática (AChE/BChE)</div>
              <div class="text-xs text-orange-700">IC50 comparativo: extrato vs fração vs NP → mecanismo neuroprotetor</div>
            </div>
            <span class="text-xs font-bold text-orange-700 bg-orange-200 px-2 py-1 rounded">S8-S9</span>
          </div>
          <div class="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="text-2xl font-black text-yellow-600">3º</div>
            <div class="flex-1">
              <div class="font-bold text-yellow-900 text-sm">Comportamento Zebrafish</div>
              <div class="text-xs text-yellow-700">Pelo menos: Tanque Claro/Escuro + Esquiva Inibitória → relevância translacional</div>
            </div>
            <span class="text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-1 rounded">S11-S13</span>
          </div>
          <div class="flex items-center gap-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div class="text-2xl font-black text-emerald-600">4º</div>
            <div class="flex-1">
              <div class="font-bold text-emerald-900 text-sm">Identificação química robusta</div>
              <div class="text-xs text-emerald-700">Escutelareína + Friedelina confirmadas → suporte mecanístico</div>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-200 px-2 py-1 rounded">S4-S5</span>
          </div>
          <div class="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="text-2xl font-black text-blue-600">5º</div>
            <div class="flex-1">
              <div class="font-bold text-blue-900 text-sm">Neuroproteção SH-SY5Y</div>
              <div class="text-xs text-blue-700">Bom ter para discussão; pode entrar como dado complementar</div>
            </div>
            <span class="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">S10-S11</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============ MODAL ============
function setupModal() {
  const modal = document.getElementById('task-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

window.openModal = function(taskId) {
  const task = SCHEDULE.tasks.find(t => t.id === taskId);
  if (!task) return;
  const phase = getPhase(task.phaseId);
  const critical = isCritical(task.id);
  const deps = task.dependencies ? task.dependencies.map(d => SCHEDULE.tasks.find(t => t.id === d)).filter(Boolean) : [];

  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="p-6 border-b border-slate-200" style="background:linear-gradient(135deg, ${phase.color}15, ${phase.color}05)">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${phase.color}">
            <i class="fa-solid ${phase.icon} text-white text-xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">${task.id}</span>
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color:${phase.color}">${phase.shortName}</span>
              ${critical ? '<span class="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-fire mr-1"></i>CRÍTICA</span>' : ''}
              ${task.type === 'milestone' ? '<span class="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-flag mr-1"></i>MARCO</span>' : ''}
            </div>
            <h2 class="font-bold text-lg text-slate-800">${task.name}</h2>
          </div>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 text-xl flex-shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <span class="bg-white border border-slate-200 px-2.5 py-1 rounded-full">
          <i class="fa-regular fa-calendar mr-1 text-slate-500"></i>
          <strong>Semana ${task.startWeek}${task.endWeek !== task.startWeek ? '–' + task.endWeek : ''}</strong>
        </span>
        <span class="bg-white border border-slate-200 px-2.5 py-1 rounded-full">
          <i class="fa-regular fa-clock mr-1 text-slate-500"></i>
          ${task.endWeek - task.startWeek + 1} semana(s)
        </span>
      </div>
    </div>

    <div class="p-6 space-y-4">
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          <i class="fa-solid fa-circle-info mr-1"></i>Descrição
        </h4>
        <p class="text-sm text-slate-700">${task.description}</p>
      </div>

      ${task.deliverable ? `
        <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <i class="fa-solid fa-circle-check mr-1"></i>Entregável
          </h4>
          <p class="text-sm text-emerald-900 font-medium">${task.deliverable}</p>
        </div>
      ` : ''}

      ${deps.length > 0 ? `
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <i class="fa-solid fa-link mr-1"></i>Dependências
          </h4>
          <div class="space-y-1.5">
            ${deps.map(d => `
              <div class="flex items-center gap-2 p-2 bg-slate-50 rounded text-xs cursor-pointer hover:bg-slate-100" onclick="openModal('${d.id}')">
                <i class="fa-solid fa-arrow-right text-slate-400"></i>
                <span class="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border">${d.id}</span>
                <span class="text-slate-700 flex-1">${d.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${task.references && task.references.length > 0 ? `
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <i class="fa-solid fa-book-bookmark mr-1"></i>Referências-chave
          </h4>
          <div class="flex flex-wrap gap-2">
            ${task.references.map(r => `
              <span class="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded-full">${r}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('show');
}

window.closeModal = function() {
  const modal = document.getElementById('task-modal');
  modal.classList.add('hidden');
  modal.classList.remove('show');
}
