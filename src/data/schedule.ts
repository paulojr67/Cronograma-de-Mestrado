// Cronograma do Projeto de Mestrado - Syzygium cumini Nanoformulação Neuroprotetora
// Período: 18/Maio/2026 → 31/Agosto/2026 (Qualificação)
// 16 semanas | Caminho Crítico identificado

export interface Task {
  id: string
  name: string
  startWeek: number
  endWeek: number
  phaseId: string
  critical: boolean
  description: string
  deliverable?: string
  references?: string[]
  dependencies?: string[]
  type: 'lab' | 'analysis' | 'writing' | 'milestone' | 'parallel'
}

export interface Phase {
  id: string
  name: string
  shortName: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
  description: string
}

export interface Week {
  number: number
  startDate: string
  endDate: string
  month: string
  label: string
}

export const phases: Phase[] = [
  {
    id: 'extraction',
    name: 'Extração e Fracionamento',
    shortName: 'Extração',
    color: '#16a34a',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-600',
    icon: 'fa-leaf',
    description: 'Obtenção do extrato bruto e frações Hexano/Acetato de Etila das folhas de S. cumini'
  },
  {
    id: 'chemistry',
    name: 'Caracterização Química',
    shortName: 'Química',
    color: '#0891b2',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-600',
    icon: 'fa-flask',
    description: 'Identificação de compostos-chave (Escutelareína, Friedelina) por LC-MS/MS e GC-MS'
  },
  {
    id: 'nano',
    name: 'Nanoformulação',
    shortName: 'Nano',
    color: '#9333ea',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-600',
    icon: 'fa-atom',
    description: 'Desenvolvimento de nanocompósitos Gelatina/PLA carregados com a fração mais ativa'
  },
  {
    id: 'characterization',
    name: 'Caracterização da Nanopartícula',
    shortName: 'Caract. NP',
    color: '#c2410c',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-600',
    icon: 'fa-microscope',
    description: 'UV-Vis, FTIR, XRD, FESEM/HRTEM, DLS, Potencial Zeta e Cinética de Liberação'
  },
  {
    id: 'invitro',
    name: 'Ensaios In Vitro',
    shortName: 'In Vitro',
    color: '#dc2626',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-600',
    icon: 'fa-vial',
    description: 'Inibição AChE/BChE e neuroproteção em SH-SY5Y sob estresse oxidativo'
  },
  {
    id: 'invivo',
    name: 'Ensaios In Vivo (Zebrafish)',
    shortName: 'Zebrafish',
    color: '#1d4ed8',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-600',
    icon: 'fa-fish',
    description: 'Toxicidade aguda (CL50), ansiedade, locomoção e memória em zebrafish adulto'
  },
  {
    id: 'writing',
    name: 'Escrita da Dissertação',
    shortName: 'Escrita',
    color: '#475569',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-600',
    icon: 'fa-pen-to-square',
    description: 'Redação paralela de capítulos, revisão bibliográfica e apresentação para qualificação'
  },
  {
    id: 'milestone',
    name: 'Marcos e Qualificação',
    shortName: 'Marcos',
    color: '#ca8a04',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-600',
    icon: 'fa-flag-checkered',
    description: 'Pontos de decisão GO/NO-GO, análise estatística e defesa de qualificação'
  }
]

// 16 semanas: 18/Mai/2026 a 31/Ago/2026
export const weeks: Week[] = [
  { number: 1, startDate: '18/Mai', endDate: '24/Mai', month: 'Maio', label: 'S1' },
  { number: 2, startDate: '25/Mai', endDate: '31/Mai', month: 'Maio', label: 'S2' },
  { number: 3, startDate: '01/Jun', endDate: '07/Jun', month: 'Junho', label: 'S3' },
  { number: 4, startDate: '08/Jun', endDate: '14/Jun', month: 'Junho', label: 'S4' },
  { number: 5, startDate: '15/Jun', endDate: '21/Jun', month: 'Junho', label: 'S5' },
  { number: 6, startDate: '22/Jun', endDate: '28/Jun', month: 'Junho', label: 'S6' },
  { number: 7, startDate: '29/Jun', endDate: '05/Jul', month: 'Julho', label: 'S7' },
  { number: 8, startDate: '06/Jul', endDate: '12/Jul', month: 'Julho', label: 'S8' },
  { number: 9, startDate: '13/Jul', endDate: '19/Jul', month: 'Julho', label: 'S9' },
  { number: 10, startDate: '20/Jul', endDate: '26/Jul', month: 'Julho', label: 'S10' },
  { number: 11, startDate: '27/Jul', endDate: '02/Ago', month: 'Jul/Ago', label: 'S11' },
  { number: 12, startDate: '03/Ago', endDate: '09/Ago', month: 'Agosto', label: 'S12' },
  { number: 13, startDate: '10/Ago', endDate: '16/Ago', month: 'Agosto', label: 'S13' },
  { number: 14, startDate: '17/Ago', endDate: '23/Ago', month: 'Agosto', label: 'S14' },
  { number: 15, startDate: '24/Ago', endDate: '30/Ago', month: 'Agosto', label: 'S15' },
  { number: 16, startDate: '31/Ago', endDate: '06/Set', month: 'Agosto', label: 'S16' }
]

export const tasks: Task[] = [
  // ============ FASE 1: EXTRAÇÃO E FRACIONAMENTO (Caminho Crítico) ============
  {
    id: 'T1.1',
    name: 'Coleta, identificação botânica e secagem de folhas',
    startWeek: 1,
    endWeek: 1,
    phaseId: 'extraction',
    critical: true,
    description: 'Coleta de folhas de S. cumini, depósito de exsicata em herbário, secagem em estufa (40°C) e moagem. Solicitação de SisGen.',
    deliverable: 'Material vegetal seco e moído (pó padronizado)',
    references: ['DA ROSA et al. (2024)'],
    type: 'lab'
  },
  {
    id: 'T1.2',
    name: 'Extração assistida por ultrassom (60°C / 30 min)',
    startWeek: 2,
    endWeek: 2,
    phaseId: 'extraction',
    critical: true,
    description: 'Extração hidroetanólica usando parâmetros otimizados por DA ROSA et al. (2024): 60°C, 30 min, ultrassom. Concentração em rotaevaporador.',
    deliverable: 'Extrato bruto liofilizado',
    references: ['DA ROSA et al. (2024)'],
    dependencies: ['T1.1'],
    type: 'lab'
  },
  {
    id: 'T1.3',
    name: 'Partição líquido-líquido (Hexano e Acetato de Etila)',
    startWeek: 3,
    endWeek: 3,
    phaseId: 'extraction',
    critical: true,
    description: 'Partição sequencial do extrato bruto: Hexano → Acetato de Etila → Aquoso. Concentração e liofilização das frações.',
    deliverable: 'Frações Hexano (FHex) e Acetato de Etila (FAcOEt) liofilizadas',
    dependencies: ['T1.2'],
    type: 'lab'
  },

  // ============ FASE 2: CARACTERIZAÇÃO QUÍMICA (Paralelo) ============
  {
    id: 'T2.1',
    name: 'Agendamento e preparação de amostras para LC-MS/MS e GC-MS',
    startWeek: 3,
    endWeek: 3,
    phaseId: 'chemistry',
    critical: false,
    description: 'Solicitar análises em centrais multiusuário. Preparar alíquotas das frações em solventes apropriados.',
    deliverable: 'Amostras preparadas e protocolo de análise',
    dependencies: ['T1.3'],
    type: 'parallel'
  },
  {
    id: 'T2.2',
    name: 'Análise por LC-MS/MS (Escutelareína e flavonoides)',
    startWeek: 4,
    endWeek: 5,
    phaseId: 'chemistry',
    critical: true,
    description: 'Identificação de Escutelareína (relevante para Alzheimer - IMRAN et al., 2025) e demais flavonoides na fração Acetato de Etila.',
    deliverable: 'Cromatogramas e espectros de massa anotados',
    references: ['IMRAN et al. (2025)'],
    dependencies: ['T2.1'],
    type: 'analysis'
  },
  {
    id: 'T2.3',
    name: 'Análise por GC-MS (Friedelina e terpenos)',
    startWeek: 4,
    endWeek: 5,
    phaseId: 'chemistry',
    critical: false,
    description: 'Identificação de Friedelina e outros triterpenos na fração Hexano. Derivatização se necessário.',
    deliverable: 'Perfil de terpenos e compostos apolares',
    dependencies: ['T2.1'],
    type: 'analysis'
  },
  {
    id: 'M1',
    name: '🚦 GO/NO-GO #1 — Seleção da fração mais promissora',
    startWeek: 5,
    endWeek: 5,
    phaseId: 'milestone',
    critical: true,
    description: 'DECISÃO CRÍTICA: Com base no perfil químico e screening preliminar AChE in silico/literatura, escolher fração para encapsulamento (priorizar Acetato de Etila se Escutelareína confirmada).',
    deliverable: 'Documento de decisão técnica + justificativa',
    dependencies: ['T2.2', 'T2.3'],
    type: 'milestone'
  },

  // ============ FASE 3: NANOFORMULAÇÃO (Caminho Crítico) ============
  {
    id: 'T3.1',
    name: 'Preparação de matriz Gelatina/PLA (testes preliminares)',
    startWeek: 4,
    endWeek: 5,
    phaseId: 'nano',
    critical: false,
    description: 'Otimização da blenda Gelatina/PLA seguindo protocolo de RAJKUMAR et al. (2025). Testar diferentes razões e métodos (emulsão/evaporação ou dessolvatação).',
    deliverable: 'Protocolo da matriz NP em branco',
    references: ['RAJKUMAR et al. (2025)'],
    type: 'lab'
  },
  {
    id: 'T3.2',
    name: 'Encapsulamento da fração selecionada — Lote 1',
    startWeek: 6,
    endWeek: 6,
    phaseId: 'nano',
    critical: true,
    description: 'Síntese do nanocompósito carregado (NP-FAcOEt ou NP-FHex). Variar razões fração:polímero (1:5, 1:10, 1:20).',
    deliverable: 'Suspensão de nanopartículas - Lote 1 (3 razões)',
    references: ['RAJKUMAR et al. (2025)'],
    dependencies: ['M1', 'T3.1'],
    type: 'lab'
  },
  {
    id: 'T3.3',
    name: 'Otimização e Lote 2 (após primeiros DLS)',
    startWeek: 7,
    endWeek: 7,
    phaseId: 'nano',
    critical: true,
    description: 'Refinar com base nos primeiros resultados de DLS/PZ: ajuste de tensoativo, pH, sonicação. Produção do lote final para ensaios biológicos.',
    deliverable: 'Lote final NP-otimizada (≥200 mg)',
    dependencies: ['T3.2', 'T4.1'],
    type: 'lab'
  },

  // ============ FASE 4: CARACTERIZAÇÃO DA NANOPARTÍCULA ============
  {
    id: 'T4.1',
    name: 'DLS, Potencial Zeta e UV-Vis (Lote 1)',
    startWeek: 6,
    endWeek: 7,
    phaseId: 'characterization',
    critical: true,
    description: 'Triagem rápida de tamanho hidrodinâmico, PdI, Potencial Zeta e perfil UV-Vis dos 3 candidatos do Lote 1. Feedback imediato para otimização.',
    deliverable: 'Tabela comparativa Lote 1 (tamanho/PdI/PZ)',
    dependencies: ['T3.2'],
    type: 'analysis'
  },
  {
    id: 'T4.2',
    name: 'FTIR e XRD (interação fração-polímero)',
    startWeek: 8,
    endWeek: 8,
    phaseId: 'characterization',
    critical: false,
    description: 'Confirmação de encapsulamento (FTIR) e estado físico do ativo (XRD - amorfo vs cristalino).',
    deliverable: 'Espectros FTIR e difratogramas XRD',
    dependencies: ['T3.3'],
    type: 'analysis'
  },
  {
    id: 'T4.3',
    name: 'FESEM/HRTEM (morfologia)',
    startWeek: 8,
    endWeek: 9,
    phaseId: 'characterization',
    critical: true,
    description: 'Imagens de microscopia eletrônica de varredura/transmissão. Análise de forma, dispersão e tamanho real.',
    deliverable: 'Imagens FESEM/HRTEM + histogramas de tamanho',
    dependencies: ['T3.3'],
    type: 'analysis'
  },
  {
    id: 'T4.4',
    name: 'Eficiência de Encapsulamento (EE%) e Loading',
    startWeek: 8,
    endWeek: 8,
    phaseId: 'characterization',
    critical: true,
    description: 'Quantificação por UV-Vis/HPLC do ativo encapsulado vs livre. Cálculo de EE% e loading capacity.',
    deliverable: 'EE% e DL% determinados',
    dependencies: ['T3.3'],
    type: 'analysis'
  },
  {
    id: 'T4.5',
    name: 'Cinética de Liberação por Diálise (até 72h)',
    startWeek: 9,
    endWeek: 10,
    phaseId: 'characterization',
    critical: false,
    description: 'Estudo de liberação in vitro em PBS pH 7.4 (e pH 5.5 simulando endossomo). Modelagem matemática (Higuchi, Korsmeyer-Peppas).',
    deliverable: 'Curvas de liberação + modelo cinético',
    dependencies: ['T4.4'],
    type: 'analysis'
  },
  {
    id: 'M2',
    name: '🚦 GO/NO-GO #2 — Validação da Nanoformulação',
    startWeek: 9,
    endWeek: 9,
    phaseId: 'milestone',
    critical: true,
    description: 'DECISÃO CRÍTICA: NP atende critérios? (Tamanho <300 nm, PdI <0.3, |PZ| >20 mV, EE% >60%). Se SIM → seguir para biológicos. Se NÃO → reformular (1 semana extra).',
    deliverable: 'Relatório de prova de conceito da NP',
    dependencies: ['T4.1', 'T4.2', 'T4.3', 'T4.4'],
    type: 'milestone'
  },

  // ============ FASE 5: ENSAIOS IN VITRO ============
  {
    id: 'T5.1',
    name: 'Ensaio de inibição AChE e BChE (Ellman modificado)',
    startWeek: 8,
    endWeek: 9,
    phaseId: 'invitro',
    critical: true,
    description: 'Curvas dose-resposta (IC50) para: (a) extrato bruto, (b) fração livre, (c) NP-carregada, (d) NP-vazia. Controle: Donepezil.',
    deliverable: 'IC50 AChE/BChE para todos os grupos',
    dependencies: ['T1.3', 'T3.3'],
    type: 'lab'
  },
  {
    id: 'T5.2',
    name: 'Cultura e expansão de SH-SY5Y',
    startWeek: 7,
    endWeek: 9,
    phaseId: 'invitro',
    critical: false,
    description: 'Manutenção, diferenciação (ácido retinóico opcional) e padronização da linhagem para ensaios.',
    deliverable: 'Banco celular padronizado',
    type: 'lab'
  },
  {
    id: 'T5.3',
    name: 'Citotoxicidade (MTT) em SH-SY5Y',
    startWeek: 9,
    endWeek: 10,
    phaseId: 'invitro',
    critical: true,
    description: 'Determinação da janela terapêutica não-tóxica das NPs e fração livre. 24h e 48h.',
    deliverable: 'CC50 e doses seguras definidas',
    dependencies: ['T5.2', 'M2'],
    type: 'lab'
  },
  {
    id: 'T5.4',
    name: 'Neuroproteção contra estresse oxidativo (H₂O₂ ou Aβ)',
    startWeek: 10,
    endWeek: 11,
    phaseId: 'invitro',
    critical: true,
    description: 'Pré-tratamento com NP/fração + insulto oxidativo. Viabilidade celular (MTT) e ROS intracelular (DCFH-DA).',
    deliverable: '% de neuroproteção + dados de ROS',
    dependencies: ['T5.3'],
    type: 'lab'
  },

  // ============ FASE 6: ENSAIOS IN VIVO (ZEBRAFISH) ============
  {
    id: 'T6.0',
    name: 'Aprovação CEUA + aclimatação animais',
    startWeek: 1,
    endWeek: 4,
    phaseId: 'invivo',
    critical: true,
    description: 'Submissão e aprovação de protocolo CEUA (PRÉ-REQUISITO!). Aclimatação de zebrafish adultos no biotério (≥2 semanas).',
    deliverable: 'Protocolo CEUA aprovado + animais aclimatados',
    type: 'lab'
  },
  {
    id: 'T6.1',
    name: 'Toxicidade Aguda (CL50 - 96h)',
    startWeek: 9,
    endWeek: 10,
    phaseId: 'invivo',
    critical: true,
    description: 'Determinação da CL50 para NP-otimizada e fração livre seguindo OECD 203 adaptado.',
    deliverable: 'CL50 e doses sub-letais definidas',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.0', 'M2'],
    type: 'lab'
  },
  {
    id: 'T6.2',
    name: 'Tanque Claro/Escuro (ansiedade)',
    startWeek: 11,
    endWeek: 12,
    phaseId: 'invivo',
    critical: true,
    description: 'Avaliação de comportamento ansioso pós-tratamento (5-7 dias). Vídeo-tracking automatizado.',
    deliverable: 'Latência, tempo no claro, transições',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.1'],
    type: 'lab'
  },
  {
    id: 'T6.3',
    name: 'Campo Aberto / Open Tank (locomoção)',
    startWeek: 11,
    endWeek: 12,
    phaseId: 'invivo',
    critical: true,
    description: 'Distância percorrida, velocidade média, tempo na zona central. Mesmo grupo de T6.2.',
    deliverable: 'Parâmetros locomotores',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.1'],
    type: 'lab'
  },
  {
    id: 'T6.4',
    name: 'Esquiva Inibitória (memória)',
    startWeek: 12,
    endWeek: 13,
    phaseId: 'invivo',
    critical: true,
    description: 'Treino + teste 24h depois. Avaliação de memória de curto/longo prazo. Pode incluir modelo de prejuízo (escopolamina) para mostrar reversão.',
    deliverable: 'Latência treino vs teste + índice de memória',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.2', 'T6.3'],
    type: 'lab'
  },
  {
    id: 'T6.5',
    name: 'Eutanásia + bioquímica cerebral (AChE ex vivo, MDA)',
    startWeek: 13,
    endWeek: 13,
    phaseId: 'invivo',
    critical: false,
    description: 'Extração de cérebros + dosagem de AChE ex vivo, peroxidação lipídica e GSH. Reforça mecanismo de ação.',
    deliverable: 'Marcadores bioquímicos cerebrais',
    dependencies: ['T6.4'],
    type: 'lab'
  },

  // ============ FASE 7: ESCRITA DA DISSERTAÇÃO (Paralelo) ============
  {
    id: 'W1',
    name: '📝 Capítulo: Revisão Bibliográfica',
    startWeek: 1,
    endWeek: 4,
    phaseId: 'writing',
    critical: false,
    description: 'Iniciar IMEDIATAMENTE: S. cumini, Alzheimer, AChE/BChE, nanoformulações poliméricas, zebrafish como modelo. Atualizar continuamente.',
    deliverable: 'Capítulo 1 — versão inicial (~30 páginas)',
    type: 'writing'
  },
  {
    id: 'W2',
    name: '📝 Capítulo: Materiais e Métodos',
    startWeek: 3,
    endWeek: 7,
    phaseId: 'writing',
    critical: false,
    description: 'Documentar protocolos EM TEMPO REAL conforme executados. Inclui fluxogramas e detalhamento de equipamentos.',
    deliverable: 'Capítulo 2 — completo até S7',
    type: 'writing'
  },
  {
    id: 'W3',
    name: '📝 Resultados Parciais (Extração + Química)',
    startWeek: 5,
    endWeek: 7,
    phaseId: 'writing',
    critical: false,
    description: 'Tabelas de rendimento, perfis cromatográficos, identificação de compostos. Figuras prontas para qualificação.',
    deliverable: 'Seção Resultados — Parte I',
    dependencies: ['T2.2', 'T2.3'],
    type: 'writing'
  },
  {
    id: 'W4',
    name: '📝 Resultados (Caracterização NP)',
    startWeek: 8,
    endWeek: 10,
    phaseId: 'writing',
    critical: false,
    description: 'Compilação de DLS, PZ, FTIR, XRD, FESEM, EE% e cinética em formato publicável.',
    deliverable: 'Seção Resultados — Parte II',
    dependencies: ['M2'],
    type: 'writing'
  },
  {
    id: 'W5',
    name: '📝 Resultados (Biológicos in vitro + in vivo)',
    startWeek: 11,
    endWeek: 13,
    phaseId: 'writing',
    critical: true,
    description: 'Gráficos finais de IC50, neuroproteção, comportamento zebrafish. Discussão preliminar.',
    deliverable: 'Seção Resultados — Parte III',
    dependencies: ['T5.4', 'T6.4'],
    type: 'writing'
  },

  // ============ FASE 8: ANÁLISE FINAL E QUALIFICAÇÃO ============
  {
    id: 'T8.1',
    name: 'Análise estatística completa (GraphPad/R)',
    startWeek: 13,
    endWeek: 14,
    phaseId: 'milestone',
    critical: true,
    description: 'ANOVA + post-hoc, regressão dose-resposta, normalidade. Consolidar todas as figuras finais.',
    deliverable: 'Banco de dados estatístico + figuras finais',
    dependencies: ['T5.4', 'T6.5'],
    type: 'analysis'
  },
  {
    id: 'T8.2',
    name: 'Discussão integrada + Conclusão',
    startWeek: 14,
    endWeek: 15,
    phaseId: 'writing',
    critical: true,
    description: 'Capítulo de discussão correlacionando química → NP → AChE/BChE → SH-SY5Y → comportamento. Outlook para Q1.',
    deliverable: 'Capítulo Discussão + Conclusão',
    dependencies: ['T8.1'],
    type: 'writing'
  },
  {
    id: 'T8.3',
    name: 'Revisão final orientador + ajustes',
    startWeek: 15,
    endWeek: 15,
    phaseId: 'writing',
    critical: true,
    description: 'Submissão ao orientador (entrega ANTECIPADA recomendada na S14). Ajustes e formatação ABNT/PPG.',
    deliverable: 'Dissertação de qualificação finalizada',
    dependencies: ['T8.2'],
    type: 'writing'
  },
  {
    id: 'T8.4',
    name: 'Preparação da apresentação (slides + ensaio)',
    startWeek: 15,
    endWeek: 16,
    phaseId: 'milestone',
    critical: true,
    description: 'Slides de qualificação (~25-30 min), ensaio com grupo de pesquisa, preparação de FAQ.',
    deliverable: 'Apresentação pronta',
    dependencies: ['T8.3'],
    type: 'milestone'
  },
  {
    id: 'M3',
    name: '🎓 QUALIFICAÇÃO DE MESTRADO',
    startWeek: 16,
    endWeek: 16,
    phaseId: 'milestone',
    critical: true,
    description: 'DEFESA DA QUALIFICAÇÃO. Próximos passos: ensaios complementares (Western blot, histologia cerebral) + submissão Q1.',
    deliverable: '✅ Qualificação aprovada',
    dependencies: ['T8.4'],
    type: 'milestone'
  }
]

// Caminho Crítico — sequência de tarefas que NÃO podem atrasar
export const criticalPath: string[] = [
  'T1.1', 'T1.2', 'T1.3',           // Extração
  'T2.2',                            // LC-MS (define fração)
  'M1',                              // Decisão fração
  'T3.2', 'T3.3',                    // Nanoformulação
  'T4.1', 'T4.3', 'T4.4',           // Caracterização chave
  'M2',                              // Validação NP
  'T5.1', 'T5.3', 'T5.4',           // In vitro
  'T6.0', 'T6.1', 'T6.2', 'T6.3', 'T6.4', // Zebrafish
  'W5',                              // Escrita resultados
  'T8.1', 'T8.2', 'T8.3', 'T8.4',   // Finalização
  'M3'                               // Qualificação
]

// Estatísticas resumidas
export const stats = {
  totalWeeks: 16,
  totalTasks: tasks.length,
  criticalTasks: tasks.filter(t => t.critical).length,
  milestones: tasks.filter(t => t.type === 'milestone').length,
  startDate: '18 de Maio de 2026',
  endDate: '31 de Agosto de 2026 (Qualificação)',
  qualificationWeek: 16
}
