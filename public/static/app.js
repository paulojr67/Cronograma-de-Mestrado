/**
 * Cronograma Interativo — Mestrado S. cumini
 * Renderiza Gantt, fases, caminho crítico, semana-a-semana, escrita e estratégia Q1
 * + Sistema de tracking de progresso com localStorage
 */

let SCHEDULE = null;
let highlightCritical = false;
let activePhaseFilter = null;

// Sistema de progresso
const STORAGE_KEY = 'cronograma-mestrado-progresso-v1';
let progress = {}; // { taskId: { done: bool, completedAt: ISO string, note: string } }

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
  try {
    loadProgress();
    const res = await fetch('/api/schedule');
    SCHEDULE = await res.json();

    renderPhaseChips();
    renderGantt();
    renderPhases();
    renderCriticalPath();
    renderWeeks();
    renderWriting();
    renderStrategy();
    renderHowTo();

    setupTabs();
    setupCriticalToggle();
    setupModal();
    setupProgressControls();
    updateProgressBar();
  } catch (e) {
    console.error('Erro ao carregar cronograma:', e);
    document.body.insertAdjacentHTML('afterbegin',
      '<div class="bg-red-100 text-red-800 p-4 text-center">Erro ao carregar dados do cronograma.</div>');
  }
});

// ============ PROGRESSO (localStorage) ============
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) progress = JSON.parse(raw);
  } catch (e) {
    console.warn('Erro ao carregar progresso:', e);
    progress = {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Erro ao salvar progresso:', e);
  }
}

function isDone(taskId) {
  return !!(progress[taskId] && progress[taskId].done);
}

function toggleTask(taskId) {
  if (!progress[taskId]) progress[taskId] = { done: false };
  progress[taskId].done = !progress[taskId].done;
  progress[taskId].completedAt = progress[taskId].done ? new Date().toISOString() : null;
  saveProgress();
  refreshAllViews();
}

function setNote(taskId, note) {
  if (!progress[taskId]) progress[taskId] = { done: false };
  progress[taskId].note = note;
  saveProgress();
}

function refreshAllViews() {
  renderGantt();
  renderPhases();
  renderCriticalPath();
  renderWeeks();
  renderWriting();
  updateProgressBar();
  // Reabrir modal se estiver aberto
  const modal = document.getElementById('task-modal');
  if (!modal.classList.contains('hidden')) {
    const currentId = modal.dataset.currentTaskId;
    if (currentId) openModal(currentId);
  }
}

function getStats() {
  const total = SCHEDULE.tasks.length;
  const done = SCHEDULE.tasks.filter(t => isDone(t.id)).length;
  const criticalTotal = SCHEDULE.tasks.filter(t => isCritical(t.id)).length;
  const criticalDone = SCHEDULE.tasks.filter(t => isCritical(t.id) && isDone(t.id)).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const criticalPercent = criticalTotal > 0 ? Math.round((criticalDone / criticalTotal) * 100) : 0;
  return { total, done, percent, criticalTotal, criticalDone, criticalPercent };
}

function getPhaseStats(phaseId) {
  const phaseTasks = SCHEDULE.tasks.filter(t => t.phaseId === phaseId);
  const done = phaseTasks.filter(t => isDone(t.id)).length;
  const total = phaseTasks.length;
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function updateProgressBar() {
  const s = getStats();
  const fill = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-bar-label');
  if (fill) fill.style.width = s.percent + '%';
  if (label) {
    label.innerHTML = `<span class="${s.percent > 50 ? 'text-white' : 'text-slate-700'}"><strong>${s.done}</strong> de <strong>${s.total}</strong> tarefas concluídas (${s.percent}%) · Crítico: ${s.criticalDone}/${s.criticalTotal} (${s.criticalPercent}%)</span>`;
  }
}

// ============ EXPORT / IMPORT / RESET ============
function setupProgressControls() {
  document.getElementById('btn-export').addEventListener('click', exportProgress);
  document.getElementById('btn-reset').addEventListener('click', resetProgress);
  document.getElementById('file-import').addEventListener('change', importProgress);
}

function exportProgress() {
  const data = {
    exportedAt: new Date().toISOString(),
    project: 'Cronograma Mestrado S. cumini',
    progress: progress,
    stats: getStats()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `cronograma-progresso-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Progresso exportado com sucesso!');
}

function importProgress(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.progress && typeof data.progress === 'object') {
        if (confirm('Isso substituirá seu progresso atual. Continuar?')) {
          progress = data.progress;
          saveProgress();
          refreshAllViews();
          showToast('✓ Progresso importado com sucesso!');
        }
      } else {
        alert('Arquivo inválido: estrutura não reconhecida.');
      }
    } catch (err) {
      alert('Erro ao ler arquivo: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // permite reimportar mesmo arquivo
}

function resetProgress() {
  if (!confirm('Tem certeza? Todo o progresso e anotações serão APAGADOS. Esta ação não pode ser desfeita.')) return;
  progress = {};
  saveProgress();
  refreshAllViews();
  showToast('Progresso resetado.', 'warning');
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    error: 'bg-red-600'
  };
  toast.className = `fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-5 py-3 rounded-lg shadow-xl text-sm font-semibold transform transition-all duration-300`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

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
  container.innerHTML = SCHEDULE.phases.map(p => {
    const stats = getPhaseStats(p.id);
    return `
    <div class="phase-chip flex items-center gap-2 px-3 py-2 rounded-full border-2 ${p.borderColor} ${p.bgColor}"
         data-phase="${p.id}" title="${p.description}">
      <i class="fa-solid ${p.icon}" style="color:${p.color}"></i>
      <span class="text-xs font-semibold" style="color:${p.color}">${p.name}</span>
      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/70" style="color:${p.color}">${stats.done}/${stats.total}</span>
    </div>
  `;}).join('');

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

// ============ CHECKBOX COMPONENT ============
function checkboxHTML(taskId, size = 'md') {
  const done = isDone(taskId);
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const icon = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return `
    <button class="task-checkbox ${sz} flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${done ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-slate-300 hover:border-emerald-500'}"
      data-task-id="${taskId}" onclick="event.stopPropagation(); window.toggleTask('${taskId}')"
      title="${done ? 'Desmarcar' : 'Marcar como concluída'}">
      ${done ? `<i class="fa-solid fa-check text-white ${icon}"></i>` : ''}
    </button>
  `;
}

window.toggleTask = toggleTask;

// ============ GANTT CHART ============
function renderGantt() {
  const container = document.getElementById('gantt-container');
  const totalWeeks = SCHEDULE.weeks.length;
  const weekColWidth = 70;
  const taskRowHeight = 38;
  const labelWidth = 360;

  let visibleTasks = SCHEDULE.tasks.slice();
  if (activePhaseFilter) {
    visibleTasks = visibleTasks.filter(t => t.phaseId === activePhaseFilter);
  }
  visibleTasks.sort((a, b) => {
    if (a.startWeek !== b.startWeek) return a.startWeek - b.startWeek;
    return SCHEDULE.phases.findIndex(p => p.id === a.phaseId) - SCHEDULE.phases.findIndex(p => p.id === b.phaseId);
  });

  const monthGroups = {};
  SCHEDULE.weeks.forEach(w => {
    if (!monthGroups[w.month]) monthGroups[w.month] = [];
    monthGroups[w.month].push(w);
  });

  let html = `
    <div style="min-width: ${labelWidth + totalWeeks * weekColWidth + 20}px;" class="relative">
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
      <div class="flex sticky top-[33px] bg-white z-10 border-b border-slate-200">
        <div style="width:${labelWidth}px" class="flex-shrink-0 px-3 py-2 text-xs text-slate-400 border-r border-slate-200">
          ${visibleTasks.length} tarefa(s) · ${visibleTasks.filter(t => isDone(t.id)).length} ✓
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

      <div class="relative">
        ${visibleTasks.map((task) => {
          const phase = getPhase(task.phaseId);
          const offset = (task.startWeek - 1) * weekColWidth;
          const width = (task.endWeek - task.startWeek + 1) * weekColWidth - 4;
          const critical = isCritical(task.id);
          const dimmed = highlightCritical && !critical;
          const done = isDone(task.id);

          let barClasses = 'gantt-bar absolute rounded-md flex items-center px-2 text-white text-xs font-semibold shadow-sm';
          if (critical && !done) barClasses += ' critical-task';
          if (dimmed) barClasses += ' opacity-30';
          if (done) barClasses += ' opacity-70';

          const isMilestone = task.type === 'milestone';

          return `
            <div class="flex border-b border-slate-100 hover:bg-slate-50 transition" style="height:${taskRowHeight}px">
              <div style="width:${labelWidth}px" class="flex-shrink-0 px-3 py-2 text-xs border-r border-slate-200 flex items-center gap-2 ${dimmed ? 'opacity-40' : ''}">
                ${checkboxHTML(task.id, 'sm')}
                <span class="flex-shrink-0 w-2 h-2 rounded-full" style="background:${phase.color}"></span>
                <span class="font-mono text-[10px] text-slate-400">${task.id}</span>
                <span class="truncate ${critical ? 'font-bold' : ''} ${done ? 'line-through text-slate-400' : 'text-slate-700'}" title="${task.name}">
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
                  ${done ? '<i class="fa-solid fa-check-double mr-1.5"></i>' : `<i class="fa-solid ${isMilestone ? 'fa-flag-checkered' : phase.icon} mr-1.5"></i>`}
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

  container.querySelectorAll('.gantt-bar').forEach(bar => {
    bar.addEventListener('click', () => openModal(bar.dataset.taskId));
  });

  // Atualizar chips com nova contagem
  renderPhaseChips();
}

// ============ POR FASE ============
function renderPhases() {
  const container = document.getElementById('phases-container');
  container.innerHTML = SCHEDULE.phases.map(phase => {
    const phaseTasks = SCHEDULE.tasks.filter(t => t.phaseId === phase.id);
    if (phaseTasks.length === 0) return '';
    const stats = getPhaseStats(phase.id);

    return `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-5 border-b-2" style="border-color:${phase.color}; background:${phase.color}10">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background:${phase.color}">
                <i class="fa-solid ${phase.icon} text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg" style="color:${phase.color}">${phase.name}</h3>
                <p class="text-xs text-slate-600">${phase.description}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-xs text-slate-500 mb-1">${stats.done} de ${stats.total} concluídas</div>
                <div class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-500" style="width:${stats.percent}%; background:${phase.color}"></div>
                </div>
              </div>
              <span class="text-sm font-bold px-3 py-1 rounded-full" style="background:${phase.color}; color:white">
                ${stats.percent}%
              </span>
            </div>
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
  const done = isDone(task.id);
  const completedAt = progress[task.id]?.completedAt;
  const note = progress[task.id]?.note;

  return `
    <div class="task-card p-4 cursor-pointer hover:bg-slate-50 ${done ? 'bg-emerald-50/40' : ''}" onclick="openModal('${task.id}')">
      <div class="flex items-start gap-3">
        ${checkboxHTML(task.id, 'md')}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">${task.id}</span>
            ${critical ? '<span class="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-fire mr-1"></i>CRÍTICA</span>' : ''}
            ${task.type === 'milestone' ? '<span class="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-flag mr-1"></i>MARCO</span>' : ''}
            ${done ? `<span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-check mr-1"></i>CONCLUÍDA</span>` : ''}
            <span class="text-[10px] font-semibold text-slate-500">Semana ${task.startWeek}${task.endWeek !== task.startWeek ? '–' + task.endWeek : ''}</span>
          </div>
          <h4 class="font-semibold text-sm ${done ? 'line-through text-slate-500' : 'text-slate-800'}">${task.name}</h4>
          <p class="text-xs text-slate-600 mt-1 line-clamp-2">${task.description}</p>
          ${task.deliverable ? `<div class="text-[11px] text-emerald-700 mt-2"><i class="fa-solid fa-circle-check mr-1"></i><strong>Entregável:</strong> ${task.deliverable}</div>` : ''}
          ${note ? `<div class="text-[11px] text-purple-700 mt-2 bg-purple-50 inline-block px-2 py-1 rounded"><i class="fa-solid fa-note-sticky mr-1"></i>${escapeHtml(note)}</div>` : ''}
          ${done && completedAt ? `<div class="text-[10px] text-slate-400 mt-1"><i class="fa-regular fa-clock mr-1"></i>Concluída em ${new Date(completedAt).toLocaleDateString('pt-BR')}</div>` : ''}
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300 text-xs mt-1"></i>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ============ CAMINHO CRÍTICO ============
function renderCriticalPath() {
  const container = document.getElementById('critical-container');
  const criticalTasks = SCHEDULE.criticalPath.map(id => SCHEDULE.tasks.find(t => t.id === id)).filter(Boolean);

  container.innerHTML = criticalTasks.map((task, idx) => {
    const phase = getPhase(task.phaseId);
    const isLast = idx === criticalTasks.length - 1;
    const done = isDone(task.id);

    return `
      <div class="relative">
        <div class="flex gap-4 items-stretch">
          <div class="flex flex-col items-center flex-shrink-0">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md flex-shrink-0 ${done ? '' : ''}"
              style="background:${done ? '#10b981' : (task.type === 'milestone' ? '#ca8a04' : phase.color)}">
              ${done ? '<i class="fa-solid fa-check"></i>' : (task.type === 'milestone' ? '<i class="fa-solid fa-flag-checkered"></i>' : (idx + 1))}
            </div>
            ${!isLast ? `<div class="w-0.5 flex-1 ${done ? 'bg-emerald-300' : 'bg-gradient-to-b from-red-400 to-red-200'} mt-1"></div>` : ''}
          </div>
          <div class="flex-1 bg-white rounded-lg shadow-sm border-l-4 border border-slate-200 p-4 cursor-pointer hover:shadow-md transition mb-3 ${done ? 'opacity-70' : ''}"
               style="border-left-color:${done ? '#10b981' : (task.type === 'milestone' ? '#ca8a04' : '#dc2626')}"
               onclick="openModal('${task.id}')">
            <div class="flex items-start gap-3">
              ${checkboxHTML(task.id, 'md')}
              <div class="flex-1 min-w-0">
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
                <h4 class="font-bold text-sm ${done ? 'line-through text-slate-500' : 'text-slate-800'}">${task.name}</h4>
                <p class="text-xs text-slate-600 mt-1">${task.description}</p>
                ${task.deliverable ? `<div class="text-[11px] text-emerald-700 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded"><i class="fa-solid fa-circle-check mr-1"></i>${task.deliverable}</div>` : ''}
              </div>
            </div>
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
    const weekDone = weekTasks.filter(t => isDone(t.id)).length;

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
              ${weekDone}/${weekTasks.length} ✓
            </span>
          </div>
        </div>
        <div class="p-3 space-y-1.5 max-h-64 overflow-y-auto">
          ${weekTasks.length === 0 ? '<p class="text-xs text-slate-400 italic">Sem atividades</p>' :
            weekTasks.map(t => {
              const phase = getPhase(t.phaseId);
              const critical = isCritical(t.id);
              const done = isDone(t.id);
              return `
                <div class="text-xs p-2 rounded border-l-2 cursor-pointer hover:bg-slate-50 transition flex items-start gap-2 ${done ? 'opacity-60' : ''}"
                     style="border-color:${phase.color}; background:${phase.color}08"
                     onclick="openModal('${t.id}')">
                  ${checkboxHTML(t.id, 'sm')}
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <i class="fa-solid ${phase.icon} text-[10px]" style="color:${phase.color}"></i>
                      <span class="font-mono text-[9px] text-slate-500">${t.id}</span>
                      ${critical ? '<span class="text-[9px] text-red-600"><i class="fa-solid fa-fire"></i></span>' : ''}
                    </div>
                    <div class="font-medium ${done ? 'line-through text-slate-400' : 'text-slate-700'} line-clamp-2">${t.name}</div>
                  </div>
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

// ============ COMO USAR ============
function renderHowTo() {
  const container = document.getElementById('howto-container');
  container.innerHTML = `
    <!-- HERO -->
    <div class="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl shadow-xl p-8 mb-6">
      <div class="max-w-3xl">
        <h2 class="text-3xl font-bold mb-3">
          <i class="fa-solid fa-rocket mr-2"></i>Como usar este cronograma
        </h2>
        <p class="text-emerald-100 text-base leading-relaxed">
          Este é seu painel de comando para os próximos 16 semanas. Marque tarefas como concluídas, acompanhe seu progresso em tempo real e nunca perca o caminho crítico de vista. Tudo é salvo localmente no seu navegador.
        </p>
      </div>
    </div>

    <!-- QUICK START -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-xl border-2 border-emerald-200 p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <span class="font-black text-emerald-700">1</span>
          </div>
          <h3 class="font-bold text-slate-800">Explore as abas</h3>
        </div>
        <p class="text-sm text-slate-600">Comece pela aba <strong>Gantt</strong> para ver tudo, depois explore <strong>Caminho Crítico</strong> e <strong>Semana a Semana</strong>.</p>
      </div>
      <div class="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span class="font-black text-blue-700">2</span>
          </div>
          <h3 class="font-bold text-slate-800">Marque tarefas</h3>
        </div>
        <p class="text-sm text-slate-600">Clique no <strong>quadradinho ☐</strong> ao lado de cada tarefa para marcá-la como concluída. A barra de progresso atualiza automaticamente.</p>
      </div>
      <div class="bg-white rounded-xl border-2 border-purple-200 p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span class="font-black text-purple-700">3</span>
          </div>
          <h3 class="font-bold text-slate-800">Faça backup</h3>
        </div>
        <p class="text-sm text-slate-600">Use <strong>Exportar</strong> toda semana para salvar seu progresso em arquivo. Importe em outro navegador se precisar.</p>
      </div>
    </div>

    <!-- FEATURES DETALHADAS -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div class="p-5 border-b border-slate-200 bg-slate-50">
        <h3 class="font-bold text-lg text-slate-800">
          <i class="fa-solid fa-list-check mr-2 text-emerald-600"></i>Funcionalidades em detalhe
        </h3>
      </div>
      <div class="divide-y divide-slate-100">

        <div class="p-5">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <i class="fa-solid fa-square-check text-emerald-700 text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 mb-1">✅ Sistema de Checkboxes</h4>
              <p class="text-sm text-slate-600 mb-3">Cada tarefa tem um checkbox que você pode marcar ao concluir. Tarefas concluídas ficam <span class="line-through text-slate-400">riscadas</span> e a barra do Gantt fica mais clara.</p>
              <div class="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 text-slate-700">
                <div><i class="fa-solid fa-circle-check text-emerald-600 mr-2"></i>Os checkboxes aparecem em <strong>todas as visualizações</strong> (Gantt, Por Fase, Caminho Crítico, Semana a Semana, Escrita)</div>
                <div><i class="fa-solid fa-circle-check text-emerald-600 mr-2"></i>Marcar em uma aba atualiza automaticamente em todas as outras</div>
                <div><i class="fa-solid fa-circle-check text-emerald-600 mr-2"></i>A data de conclusão é registrada automaticamente</div>
                <div><i class="fa-solid fa-circle-check text-emerald-600 mr-2"></i>Para desmarcar, basta clicar no checkbox novamente</div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <i class="fa-solid fa-chart-line text-blue-700 text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 mb-1">📊 Barra de Progresso (sempre visível no topo)</h4>
              <p class="text-sm text-slate-600 mb-3">Mostra dois indicadores em tempo real:</p>
              <div class="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 text-slate-700">
                <div><strong>Progresso Geral:</strong> X de 33 tarefas (Y%) — todas as tarefas do projeto</div>
                <div><strong>Progresso Crítico:</strong> X/25 (Y%) — apenas as tarefas do caminho crítico</div>
                <div class="text-amber-700 font-semibold mt-2"><i class="fa-solid fa-lightbulb mr-1"></i>Dica: priorize sempre o progresso crítico — se ele atrasar, a Qualificação atrasa</div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <i class="fa-solid fa-note-sticky text-purple-700 text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 mb-1">📝 Anotações por Tarefa</h4>
              <p class="text-sm text-slate-600 mb-3">Clique em qualquer tarefa para abrir o modal de detalhes — lá você pode adicionar uma anotação pessoal (resultados, observações, lote do reagente, etc.).</p>
              <div class="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 text-slate-700">
                <div>📌 Use para registrar: rendimento de extração, IC50 obtido, n° do lote da NP, observações experimentais</div>
                <div>📌 Anotações aparecem na lista por fase para consulta rápida</div>
                <div>📌 Tudo é salvo automaticamente no navegador</div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <i class="fa-solid fa-fire text-red-700 text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 mb-1">🔥 Destacar Caminho Crítico</h4>
              <p class="text-sm text-slate-600 mb-3">No topo da página há o botão <strong>"Destacar Caminho Crítico"</strong>. Quando ativado, todas as tarefas não-críticas ficam transparentes, deixando apenas o que <em>realmente</em> importa para a Qualificação visível.</p>
              <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
                ⚠️ Use isso quando estiver atrasado: foque apenas no caminho crítico para recuperar prazo.
              </div>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
              <i class="fa-solid fa-filter text-cyan-700 text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 mb-1">🎨 Filtro por Fase</h4>
              <p class="text-sm text-slate-600 mb-3">Clique em qualquer chip colorido da legenda (ex: "Nanoformulação") para filtrar o Gantt e ver apenas as tarefas daquela fase. Clique de novo para remover o filtro.</p>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <i class="fa-solid fa-floppy-disk text-amber-700 text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 mb-1">💾 Exportar / Importar / Resetar</h4>
              <p class="text-sm text-slate-600 mb-3">Botões no canto superior direito da barra de progresso:</p>
              <div class="bg-slate-50 rounded-lg p-3 text-xs space-y-2 text-slate-700">
                <div class="flex items-start gap-2">
                  <span class="text-blue-700 font-bold flex-shrink-0">📥 Exportar:</span>
                  <span>Baixa um arquivo <code class="bg-slate-200 px-1 rounded">cronograma-progresso-AAAA-MM-DD.json</code> com todo seu progresso e anotações. <strong>Faça backup semanalmente!</strong></span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-purple-700 font-bold flex-shrink-0">📤 Importar:</span>
                  <span>Carrega um JSON exportado anteriormente. Útil para sincronizar entre computadores ou navegadores.</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-red-700 font-bold flex-shrink-0">🗑️ Resetar:</span>
                  <span>Apaga TODO o progresso e anotações. Pede confirmação. <strong>Não pode ser desfeito</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- FLUXO RECOMENDADO -->
    <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 mb-6">
      <h3 class="font-bold text-lg text-amber-900 mb-4">
        <i class="fa-solid fa-route mr-2"></i>Fluxo Recomendado de Uso
      </h3>
      <div class="space-y-3">
        <div class="flex gap-3 items-start bg-white/60 p-3 rounded-lg">
          <div class="font-black text-amber-700 text-lg flex-shrink-0">📅</div>
          <div class="text-sm text-slate-700">
            <strong>Toda segunda-feira:</strong> abra a aba <strong>"Semana a Semana"</strong> e veja o card da semana atual. Esse é seu plano da semana.
          </div>
        </div>
        <div class="flex gap-3 items-start bg-white/60 p-3 rounded-lg">
          <div class="font-black text-amber-700 text-lg flex-shrink-0">✅</div>
          <div class="text-sm text-slate-700">
            <strong>Ao concluir uma tarefa:</strong> marque o checkbox e adicione uma anotação rápida no modal (resultado obtido, dificuldades, próximos passos).
          </div>
        </div>
        <div class="flex gap-3 items-start bg-white/60 p-3 rounded-lg">
          <div class="font-black text-amber-700 text-lg flex-shrink-0">📊</div>
          <div class="text-sm text-slate-700">
            <strong>Toda sexta-feira:</strong> antes da reunião com orientador, abra <strong>"Por Fase"</strong> e veja sua taxa de conclusão. Se alguma fase está abaixo de 50% no meio do prazo, sinal vermelho.
          </div>
        </div>
        <div class="flex gap-3 items-start bg-white/60 p-3 rounded-lg">
          <div class="font-black text-amber-700 text-lg flex-shrink-0">💾</div>
          <div class="text-sm text-slate-700">
            <strong>Todo domingo:</strong> clique em <strong>"Exportar"</strong> e salve o JSON na sua pasta de backup (Drive, Dropbox, etc).
          </div>
        </div>
        <div class="flex gap-3 items-start bg-white/60 p-3 rounded-lg">
          <div class="font-black text-amber-700 text-lg flex-shrink-0">🚦</div>
          <div class="text-sm text-slate-700">
            <strong>Em marcos GO/NO-GO (M1, M2):</strong> revise a aba <strong>"Caminho Crítico"</strong> antes de tomar a decisão. Atualize anotações com a justificativa.
          </div>
        </div>
        <div class="flex gap-3 items-start bg-white/60 p-3 rounded-lg">
          <div class="font-black text-amber-700 text-lg flex-shrink-0">🎓</div>
          <div class="text-sm text-slate-700">
            <strong>Semana 14 em diante:</strong> ative o modo <strong>"Destacar Caminho Crítico"</strong> e foque exclusivamente nele. Tudo que não for crítico vira "bom ter".
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-5 border-b border-slate-200 bg-slate-50">
        <h3 class="font-bold text-lg text-slate-800">
          <i class="fa-solid fa-circle-question mr-2 text-emerald-600"></i>Perguntas Frequentes
        </h3>
      </div>
      <div class="divide-y divide-slate-100">
        ${faqHTML('Onde meu progresso é salvo?',
          'No <strong>localStorage do seu navegador</strong>. Os dados ficam apenas no seu computador, não vão para nenhum servidor. Se você limpar o cache ou usar outro navegador, perde o progresso (por isso é importante exportar regularmente).')}
        ${faqHTML('Posso usar em vários computadores?',
          'Sim, mas você precisa <strong>exportar em um e importar no outro</strong>. Não há sincronização automática. Recomendo manter sempre o JSON mais recente no Google Drive.')}
        ${faqHTML('O que acontece se eu fechar o navegador?',
          'Nada — seu progresso fica salvo. Quando reabrir a página, todos os checkboxes marcados continuarão marcados.')}
        ${faqHTML('Posso editar as tarefas ou datas?',
          'Não diretamente nesta versão. As tarefas são fixas (estrutura do cronograma). Mas você pode adicionar anotações em cada uma para documentar adaptações.')}
        ${faqHTML('O que significa "tarefa crítica"?',
          'É uma tarefa do <strong>caminho crítico</strong> — a sequência de tarefas onde qualquer atraso faz a Qualificação atrasar também. Tarefas críticas têm uma animação pulsante vermelha e o ícone 🔥.')}
        ${faqHTML('Como uso isso em reuniões com o orientador?',
          'Abra a aba <strong>"Por Fase"</strong> ou <strong>"Caminho Crítico"</strong> em tela cheia. Mostra visualmente onde você está e o que vem depois. Se quiser exportar para PDF, use Ctrl+P do navegador (já está estilizado para impressão).')}
        ${faqHTML('Perdi meus dados, e agora?',
          'Se você tinha exportado um JSON recente, basta clicar em <strong>Importar</strong> e selecionar o arquivo. Se não exportou, infelizmente não há como recuperar — comece de novo e exporte semanalmente daqui pra frente.')}
        ${faqHTML('Posso compartilhar com meu orientador?',
          'Sim! Exporte o JSON e envie por e-mail. Ele pode importar em outro navegador para visualizar exatamente o seu progresso. Ou simplesmente compartilhe o link da aplicação se ela estiver hospedada online.')}
      </div>
    </div>

    <!-- ATALHOS -->
    <div class="mt-6 bg-slate-900 text-slate-100 rounded-xl p-6">
      <h3 class="font-bold text-lg mb-4">
        <i class="fa-solid fa-keyboard mr-2 text-emerald-400"></i>Atalhos & Dicas Rápidas
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div class="flex items-center gap-3 bg-slate-800 rounded p-2"><kbd class="bg-slate-700 px-2 py-1 rounded text-xs font-mono">ESC</kbd><span class="text-slate-300">Fecha o modal de detalhes</span></div>
        <div class="flex items-center gap-3 bg-slate-800 rounded p-2"><kbd class="bg-slate-700 px-2 py-1 rounded text-xs font-mono">Ctrl+P</kbd><span class="text-slate-300">Imprime/exporta como PDF</span></div>
        <div class="flex items-center gap-3 bg-slate-800 rounded p-2"><i class="fa-solid fa-mouse-pointer text-emerald-400"></i><span class="text-slate-300">Click no checkbox = marcar tarefa</span></div>
        <div class="flex items-center gap-3 bg-slate-800 rounded p-2"><i class="fa-solid fa-mouse-pointer text-emerald-400"></i><span class="text-slate-300">Click no nome/barra = abrir detalhes</span></div>
      </div>
    </div>
  `;
}

function faqHTML(question, answer) {
  return `
    <details class="group">
      <summary class="cursor-pointer p-4 hover:bg-slate-50 flex items-center justify-between gap-3 list-none">
        <span class="font-semibold text-slate-800 text-sm">${question}</span>
        <i class="fa-solid fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform"></i>
      </summary>
      <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">${answer}</div>
    </details>
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
  const done = isDone(task.id);
  const completedAt = progress[task.id]?.completedAt;
  const note = progress[task.id]?.note || '';
  const deps = task.dependencies ? task.dependencies.map(d => SCHEDULE.tasks.find(t => t.id === d)).filter(Boolean) : [];

  const modal = document.getElementById('task-modal');
  modal.dataset.currentTaskId = taskId;
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
              ${done ? `<span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-check mr-1"></i>CONCLUÍDA</span>` : ''}
            </div>
            <h2 class="font-bold text-lg text-slate-800">${task.name}</h2>
          </div>
        </div>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 text-xl flex-shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="flex items-center gap-2 text-xs flex-wrap">
        <span class="bg-white border border-slate-200 px-2.5 py-1 rounded-full">
          <i class="fa-regular fa-calendar mr-1 text-slate-500"></i>
          <strong>Semana ${task.startWeek}${task.endWeek !== task.startWeek ? '–' + task.endWeek : ''}</strong>
        </span>
        <span class="bg-white border border-slate-200 px-2.5 py-1 rounded-full">
          <i class="fa-regular fa-clock mr-1 text-slate-500"></i>
          ${task.endWeek - task.startWeek + 1} semana(s)
        </span>
        ${completedAt ? `<span class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full"><i class="fa-solid fa-check-circle mr-1"></i>Concluída em ${new Date(completedAt).toLocaleDateString('pt-BR')}</span>` : ''}
      </div>
    </div>

    <div class="p-6 space-y-4">

      <!-- Toggle de status -->
      <button onclick="window.toggleTask('${task.id}')"
        class="w-full p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 font-bold text-sm
          ${done ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'}">
        ${done ? '<i class="fa-solid fa-rotate-left"></i> Marcar como NÃO concluída' : '<i class="fa-solid fa-check-circle"></i> Marcar como CONCLUÍDA'}
      </button>

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

      <!-- Anotação -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <i class="fa-solid fa-note-sticky mr-1"></i>Sua Anotação
        </h4>
        <textarea id="task-note-input" rows="3"
          class="w-full text-sm border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition"
          placeholder="Ex.: rendimento 8.5%, lote NPF-003, IC50 = 12 µg/mL...">${escapeHtml(note)}</textarea>
        <div class="flex justify-end mt-2">
          <button onclick="window.saveTaskNote('${task.id}')" class="text-xs px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold">
            <i class="fa-solid fa-floppy-disk mr-1"></i>Salvar anotação
          </button>
        </div>
      </div>

      ${deps.length > 0 ? `
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <i class="fa-solid fa-link mr-1"></i>Dependências
          </h4>
          <div class="space-y-1.5">
            ${deps.map(d => `
              <div class="flex items-center gap-2 p-2 bg-slate-50 rounded text-xs cursor-pointer hover:bg-slate-100" onclick="openModal('${d.id}')">
                ${isDone(d.id) ? '<i class="fa-solid fa-circle-check text-emerald-600"></i>' : '<i class="fa-solid fa-arrow-right text-slate-400"></i>'}
                <span class="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border">${d.id}</span>
                <span class="text-slate-700 flex-1 ${isDone(d.id) ? 'line-through text-slate-400' : ''}">${d.name}</span>
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

window.saveTaskNote = function(taskId) {
  const textarea = document.getElementById('task-note-input');
  if (!textarea) return;
  setNote(taskId, textarea.value.trim());
  showToast('✓ Anotação salva!');
  refreshAllViews();
}

window.closeModal = function() {
  const modal = document.getElementById('task-modal');
  modal.classList.add('hidden');
  modal.classList.remove('show');
  delete modal.dataset.currentTaskId;
}
