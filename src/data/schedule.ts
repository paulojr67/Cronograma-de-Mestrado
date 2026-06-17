// Cronograma do Projeto de Mestrado - Syzygium cumini Nanoformulação Neuroprotetora
// Período: 18/Maio/2026 → 31/Agosto/2026 (Qualificação)
// 16 semanas | Caminho Crítico identificado | Múltiplas parcerias externas

export interface Partner {
  id: string
  name: string
  shortName: string
  institution: string
  city: string
  state: string
  contact?: string
  status: 'confirmed' | 'negotiating' | 'pending'
  capabilities: string[]
  color: string
  icon: string
  notes?: string
}

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
  location: 'home' | 'external' | 'partner'  // home = seu lab; external = central multiusuário; partner = lab parceiro
  partnerId?: string                          // referência ao parceiro
  shippingNeeded?: boolean                    // requer envio de amostras?
  bufferWeeks?: number                        // buffer de segurança (semanas extras já embutidas)
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

// ============ PARCEIROS ============
export const partners: Partner[] = [
  {
    id: 'home',
    name: 'Laboratório de Origem (Mestrado)',
    shortName: 'Lab Local',
    institution: 'PPG - Sua Instituição',
    city: '—',
    state: '—',
    status: 'confirmed',
    capabilities: [
      'Extração e fracionamento (ultrassom)',
      'Partição líquido-líquido',
      'Liofilização',
      'Ensaios enzimáticos AChE/BChE (Ellman)',
      'Cultivo SH-SY5Y (se disponível)',
      'Análises físico-químicas básicas',
      'Redação e análise de dados'
    ],
    color: '#0f766e',
    icon: 'fa-house-laptop',
    notes: 'Base de operações. Maior controle sobre prazos e execução.'
  },
  {
    id: 'ufpb-anauara',
    name: 'Profa. Anauara — UFPB',
    shortName: 'UFPB / Anauara',
    institution: 'Universidade Federal da Paraíba',
    city: 'João Pessoa',
    state: 'PB',
    contact: 'Profa. Dra. Anauara (Caracterização Química)',
    status: 'confirmed',
    capabilities: [
      'LC-MS/MS (alta resolução)',
      'GC-MS',
      'Identificação de flavonoides',
      'Caracterização de extratos vegetais',
      'Anotação de espectros'
    ],
    color: '#0891b2',
    icon: 'fa-flask',
    notes: '✅ AMOSTRAS JÁ ENVIADAS E RECEBIDAS (1ª rodada — extrato/frações). Parceria confirmada. Após finalizar nanos, será feita 2ª rodada de envio (nanopartículas) para nova caracterização química.'
  },
  {
    id: 'limav',
    name: 'LIMAV — UFPI',
    shortName: 'LIMAV',
    institution: 'Laboratório Interdisciplinar de Materiais Avançados — UFPI',
    city: 'Teresina',
    state: 'PI',
    contact: 'Coordenação LIMAV',
    status: 'confirmed',
    capabilities: [
      'DLS (Dynamic Light Scattering) ✅',
      'Potencial Zeta ✅',
      'FESEM / HRTEM',
      'XRD',
      'FTIR',
      'TGA / DSC',
      'Caracterização de nanomateriais'
    ],
    color: '#c2410c',
    icon: 'fa-microscope',
    notes: '✅ CONFIRMADO: DLS + Zeta já em execução. DRX + microscopias podem ser feitas aqui OU no Dept. de Física (UFPI). Central multiusuário com fila — agendar com 4-6 semanas de antecedência.'
  },
  {
    id: 'ifpi',
    name: 'IFPI',
    shortName: 'IFPI',
    institution: 'Instituto Federal do Piauí',
    city: 'Teresina',
    state: 'PI',
    status: 'pending',
    capabilities: [
      'UV-Vis',
      'Caracterização coloidal (backup)'
    ],
    color: '#9333ea',
    icon: 'fa-atom',
    notes: 'Parceria local (PI) — backup de UV-Vis. DLS/Zeta migraram para LIMAV-UFPI.'
  },
  {
    id: 'ufpi-fisica',
    name: 'Dept. Física — UFPI',
    shortName: 'Física UFPI',
    institution: 'Departamento de Física — UFPI',
    city: 'Teresina',
    state: 'PI',
    status: 'negotiating',
    capabilities: [
      'DRX (Difração de Raios-X)',
      'Microscopia eletrônica',
      'Caracterização estrutural'
    ],
    color: '#7c3aed',
    icon: 'fa-atom',
    notes: 'Alternativa local ao LIMAV para DRX e microscopias. Reduz tempo de fila e custo de envio.'
  },
  {
    id: 'alek',
    name: 'Prof. ALEK — Planejamento Fatorial',
    shortName: 'Prof. ALEK',
    institution: 'Colaboração local — Especialista em DoE',
    city: 'Teresina',
    state: 'PI',
    contact: 'Prof. ALEK (Otimização estatística da síntese)',
    status: 'confirmed',
    capabilities: [
      'Planejamento Fatorial (DoE)',
      'Design 2^k / Box-Behnken / CCD',
      'Análise de Superfície de Resposta (RSM)',
      'Otimização multivariada',
      'Análise estatística (ANOVA, Minitab/R)'
    ],
    color: '#be185d',
    icon: 'fa-chart-line',
    notes: '✅ Colaboração confirmada. Auxiliará no desenho experimental e otimização estatística da síntese das nanopartículas de PCL antes do encapsulamento.'
  },
  {
    id: 'uece',
    name: 'UECE — Ceará',
    shortName: 'UECE',
    institution: 'Universidade Estadual do Ceará',
    city: 'Fortaleza',
    state: 'CE',
    contact: 'Lab. parceiro de Zebrafish (UECE)',
    status: 'confirmed',
    capabilities: [
      'Manutenção de zebrafish adultos',
      'Toxicidade aguda (CL50)',
      'Ensaios comportamentais (ansiedade/locomoção/memória)',
      'Nocicepção (avaliação de dor) 🆕',
      'Tanque Claro/Escuro',
      'Campo Aberto',
      'Esquiva Inibitória',
      'Bioquímica cerebral ex vivo',
      'Aprovação CEUA local'
    ],
    color: '#1d4ed8',
    icon: 'fa-fish',
    notes: '✅ AMOSTRAS (extrato/frações) JÁ ENVIADAS — testes solicitados: COMPORTAMENTAL + TOXICIDADE + NOCICEPÇÃO. Após finalizar nanos será feita 2ª rodada de envio (nanopartículas) para repetir bateria completa. CEUA tramitada por eles.'
  }
]

// ============ FASES ============
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
    description: 'Identificação de compostos-chave (Escutelareína, Friedelina) por LC-MS/MS e GC-MS — UFPB/Anauara'
  },
  {
    id: 'doe',
    name: 'Planejamento Fatorial (DoE)',
    shortName: 'DoE / ALEK',
    color: '#be185d',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-600',
    icon: 'fa-chart-line',
    description: 'Desenho experimental estatístico (DoE) com Prof. ALEK para otimização multivariada da síntese de nanopartículas de PCL — define variáveis críticas, níveis e número mínimo de experimentos'
  },
  {
    id: 'nano',
    name: 'Nanoformulação (PCL)',
    shortName: 'Nano PCL',
    color: '#9333ea',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-600',
    icon: 'fa-atom',
    description: 'Desenvolvimento de nanopartículas de Policaprolactona (PCL) carregadas com a fração mais ativa — metodologia atualizada (2026)'
  },
  {
    id: 'characterization',
    name: 'Caracterização da Nanopartícula',
    shortName: 'Caract. NP',
    color: '#c2410c',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-600',
    icon: 'fa-microscope',
    description: 'UV-Vis, FTIR, XRD, FESEM/HRTEM, DLS, Potencial Zeta e Cinética de Liberação — LIMAV/IFPI/UFPI'
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
    description: 'Toxicidade aguda (CL50), ansiedade, locomoção e memória em zebrafish adulto — UECE/Ceará'
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

// ============ TAREFAS ============
export const tasks: Task[] = [
  // ============ PRÉ-PROJETO / GESTÃO DE PARCERIAS (CRÍTICO!) ============
  {
    id: 'P0.1',
    name: '🤝 Confirmar parcerias (UFPB, LIMAV, IFPI, UFPI, UECE)',
    startWeek: 1,
    endWeek: 2,
    phaseId: 'milestone',
    critical: true,
    description: 'CRÍTICO ABSOLUTO: contatar formalmente todos os parceiros, alinhar prazos, fluxo de envio de amostras e CEUA (UECE). Reunião por videochamada com cada parceiro. Documentar acordos por e-mail.',
    deliverable: 'E-mails de confirmação + cronograma conjunto com cada parceiro',
    type: 'milestone',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'P0.2',
    name: '📦 Logística: kits de envio + termos de cooperação',
    startWeek: 1,
    endWeek: 3,
    phaseId: 'milestone',
    critical: true,
    description: 'Preparar logística de envio (Sedex/transportadora), embalagens adequadas (gelo seco se necessário), termos de cooperação ou MTAs. Estabelecer canal de comunicação com cada parceiro (WhatsApp/e-mail).',
    deliverable: 'Protocolo de envio padronizado + contatos diretos',
    dependencies: ['P0.1'],
    type: 'milestone',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 1: EXTRAÇÃO E FRACIONAMENTO (Lab Local) ============
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
    type: 'lab',
    location: 'home',
    partnerId: 'home'
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
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T1.3',
    name: 'Partição líquido-líquido (Hexano e Acetato de Etila)',
    startWeek: 3,
    endWeek: 3,
    phaseId: 'extraction',
    critical: true,
    description: 'Partição sequencial do extrato bruto: Hexano → Acetato de Etila → Aquoso. Concentração e liofilização das frações.',
    deliverable: 'Frações Hexano (FHex) e Acetato de Etila (FAcOEt) liofilizadas — alíquotas para envio',
    dependencies: ['T1.2'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 2: CARACTERIZAÇÃO QUÍMICA — UFPB/ANAUARA ============
  {
    id: 'T2.0',
    name: '✅ 1ª RODADA — Envio amostras (frações) p/ UFPB',
    startWeek: 3,
    endWeek: 3,
    phaseId: 'chemistry',
    critical: true,
    description: '✅ JÁ REALIZADO. Envio das frações liofilizadas (Hex + AcOEt) para Profa. Anauara — UFPB / João Pessoa-PB. Amostras já recebidas e em análise pelo lab parceiro. Alíquotas de segurança mantidas no lab local.',
    deliverable: '✅ Amostras (1ª rodada) entregues e em análise na UFPB',
    dependencies: ['T1.3', 'P0.2'],
    type: 'parallel',
    location: 'home',
    partnerId: 'ufpb-anauara',
    shippingNeeded: true
  },
  {
    id: 'T2.0b',
    name: '📦 2ª RODADA — Envio NP-PCL para UFPB (pós-síntese)',
    startWeek: 9,
    endWeek: 9,
    phaseId: 'chemistry',
    critical: false,
    description: '2ª RODADA: após finalizar nanos, enviar NP-PCL carregada + NP-PCL vazia (controle) para UFPB. Permite caracterização química do ativo encapsulado (estabilidade, perfil pós-encapsulamento).',
    deliverable: 'NP-PCL enviadas para 2ª rodada de análise química',
    dependencies: ['T3.3'],
    type: 'parallel',
    location: 'home',
    partnerId: 'ufpb-anauara',
    shippingNeeded: true
  },
  {
    id: 'T2.1',
    name: '⏳ Análise LC-MS/MS na UFPB (fila + execução)',
    startWeek: 4,
    endWeek: 6,
    phaseId: 'chemistry',
    critical: true,
    description: 'Análise por LC-MS/MS sob responsabilidade da Profa. Anauara. Identificação de Escutelareína e flavonoides na fração Acetato de Etila. PRAZO FORA DO SEU CONTROLE — buffer de 1-2 semanas embutido.',
    deliverable: 'Cromatogramas + espectros + tabela de compostos identificados',
    references: ['IMRAN et al. (2025)'],
    dependencies: ['T2.0'],
    type: 'analysis',
    location: 'partner',
    partnerId: 'ufpb-anauara',
    bufferWeeks: 1
  },
  {
    id: 'T2.2',
    name: '⏳ Análise GC-MS na UFPB (paralelo)',
    startWeek: 4,
    endWeek: 6,
    phaseId: 'chemistry',
    critical: false,
    description: 'GC-MS para identificação de Friedelina e terpenos na fração Hexano (UFPB-Anauara). Pode rodar em paralelo com LC-MS.',
    deliverable: 'Perfil de terpenos e compostos apolares',
    dependencies: ['T2.0'],
    type: 'analysis',
    location: 'partner',
    partnerId: 'ufpb-anauara',
    bufferWeeks: 1
  },
  {
    id: 'T2.3',
    name: 'Anotação de espectros (você + Anauara)',
    startWeek: 5,
    endWeek: 6,
    phaseId: 'chemistry',
    critical: true,
    description: 'Trabalho conjunto: você anota usando bases (PubChem, MassBank, Reaxys) e Anauara revisa/valida. Reuniões online quinzenais.',
    deliverable: 'Tabela final de compostos confirmados',
    dependencies: ['T2.1', 'T2.2'],
    type: 'analysis',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'M1',
    name: '🚦 GO/NO-GO #1 — Seleção da fração mais promissora',
    startWeek: 6,
    endWeek: 6,
    phaseId: 'milestone',
    critical: true,
    description: 'DECISÃO CRÍTICA: Com base no perfil químico (UFPB) + screening preliminar AChE in silico/literatura, escolher fração para encapsulamento (priorizar Acetato de Etila se Escutelareína confirmada).',
    deliverable: 'Documento de decisão técnica + justificativa científica',
    dependencies: ['T2.3'],
    type: 'milestone',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 3: NANOFORMULAÇÃO (Lab Local) ============
  // ---- Planejamento Fatorial (DoE) com Prof. ALEK — ANTES da síntese ----
  {
    id: 'D1',
    name: '📐 Reunião + desenho experimental (DoE) com Prof. ALEK',
    startWeek: 4,
    endWeek: 4,
    phaseId: 'doe',
    critical: true,
    description: 'Reunião com Prof. ALEK para definir: variáveis independentes (razão polímero:ativo, [tensoativo], velocidade/tempo de sonicação, pH, taxa de evaporação), níveis (–1/0/+1) e modelo (Fatorial 2^k, Box-Behnken ou CCD). Definir respostas: tamanho hidrodinâmico, PdI, PZ, EE%.',
    deliverable: 'Matriz experimental impressa (planilha de N experimentos com ordem aleatorizada)',
    type: 'milestone',
    location: 'home',
    partnerId: 'alek'
  },
  {
    id: 'D2',
    name: 'Execução dos experimentos do DoE (PCL — NP em branco)',
    startWeek: 5,
    endWeek: 6,
    phaseId: 'doe',
    critical: true,
    description: 'Síntese das N nanopartículas de PCL EM BRANCO seguindo a matriz do DoE. Caracterização rápida (tamanho/PdI/PZ no LIMAV após cada bloco). Registrar TODAS as condições.',
    deliverable: 'Dataset bruto do DoE (planilha completa com respostas medidas)',
    references: ['Metodologia PCL atualizada (2026)'],
    dependencies: ['D1'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'D3',
    name: '📊 Análise estatística do DoE + RSM (com Prof. ALEK)',
    startWeek: 6,
    endWeek: 7,
    phaseId: 'doe',
    critical: true,
    description: 'Análise estatística do planejamento: ANOVA, gráficos de Pareto, superfícies de resposta (RSM), identificação das condições ótimas. Validação experimental do ponto ótimo (triplicata).',
    deliverable: 'Relatório DoE + condições ótimas de síntese validadas',
    dependencies: ['D2'],
    type: 'analysis',
    location: 'home',
    partnerId: 'alek'
  },
  // ---- Nanoformulação com PCL (Policaprolactona) — usa condições do DoE ----
  {
    id: 'T3.1',
    name: 'Preparação de nanopartículas de PCL — testes preliminares',
    startWeek: 4,
    endWeek: 6,
    phaseId: 'nano',
    critical: false,
    description: 'Otimização do protocolo de síntese de nanopartículas de PCL (Policaprolactona) pela metodologia atualizada (2026). Métodos: emulsão O/A + evaporação do solvente ou nanoprecipitação. Roda em paralelo com o DoE.',
    deliverable: 'Protocolo PCL — NP em branco validado',
    references: ['Metodologia PCL atualizada (2026)'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T3.2',
    name: 'Encapsulamento da fração em NP-PCL — Lote 1 (condições ótimas DoE)',
    startWeek: 7,
    endWeek: 7,
    phaseId: 'nano',
    critical: true,
    description: 'Síntese de NP-PCL carregada (NP-PCL/FAcOEt ou NP-PCL/FHex) usando os parâmetros ótimos identificados pelo DoE. Validar 2-3 razões fração:PCL próximas do ótimo.',
    deliverable: 'Suspensão de NP-PCL — Lote 1 + alíquotas para LIMAV (DLS/Zeta)',
    references: ['Metodologia PCL atualizada (2026)'],
    dependencies: ['M1', 'T3.1', 'D3'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T3.3',
    name: 'Otimização e Lote 2 NP-PCL (após DLS/Zeta do LIMAV)',
    startWeek: 8,
    endWeek: 8,
    phaseId: 'nano',
    critical: true,
    description: 'Refinar com base no feedback do LIMAV (DLS/PZ): ajuste fino de tensoativo, sonicação, evaporação. Produção do lote final de NP-PCL para ensaios biológicos E para 2ª rodada de envios aos parceiros.',
    deliverable: 'Lote final NP-PCL otimizada (≥300 mg liofilizada) — alíquotas para LIMAV/Física, UFPB (2ª rodada) e UECE (2ª rodada)',
    dependencies: ['T3.2', 'T4.1'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 4: CARACTERIZAÇÃO DA NANOPARTÍCULA — IFPI / LIMAV / UFPI ============
  {
    id: 'T4.0a',
    name: '📦 Entrega Lote 1 → LIMAV-UFPI (DLS/PZ)',
    startWeek: 7,
    endWeek: 7,
    phaseId: 'characterization',
    critical: true,
    description: 'Entrega das suspensões NP-PCL Lote 1 no LIMAV-UFPI (Teresina) para DLS + Potencial Zeta. Local — sem necessidade de envio postal. Coordenar agenda com antecedência.',
    deliverable: 'Amostras entregues no LIMAV',
    dependencies: ['T3.2'],
    type: 'parallel',
    location: 'home',
    partnerId: 'limav',
    shippingNeeded: false
  },
  {
    id: 'T4.1',
    name: '⏳ DLS + Potencial Zeta no LIMAV-UFPI (Lote 1)',
    startWeek: 7,
    endWeek: 8,
    phaseId: 'characterization',
    critical: true,
    description: 'Triagem rápida de tamanho hidrodinâmico, PdI e Potencial Zeta no LIMAV-UFPI. ✅ Confirmado — análise local em andamento. Feedback rápido para otimização.',
    deliverable: 'Tabela comparativa Lote 1 (tamanho/PdI/PZ) — feedback para otimização',
    dependencies: ['T4.0a'],
    type: 'analysis',
    location: 'partner',
    partnerId: 'limav'
  },
  {
    id: 'T4.0b',
    name: '📦 Entrega Lote 2 → LIMAV / Física-UFPI (DRX + microscopias)',
    startWeek: 9,
    endWeek: 9,
    phaseId: 'characterization',
    critical: true,
    description: 'Entrega do lote final (otimizado) — liofilizado para DRX e FTIR. Local de análise: LIMAV-UFPI OU Dept. de Física-UFPI (quem tiver agenda mais rápida). Reservar agenda com antecedência (idealmente desde S5).',
    deliverable: 'Amostras entregues no LIMAV / Física',
    dependencies: ['T3.3'],
    type: 'parallel',
    location: 'home',
    partnerId: 'limav',
    shippingNeeded: false
  },
  {
    id: 'T4.2',
    name: '⏳ FTIR + DRX (LIMAV ou Física-UFPI)',
    startWeek: 9,
    endWeek: 11,
    phaseId: 'characterization',
    critical: false,
    description: 'Confirmação de encapsulamento (FTIR) e estado físico do ativo (DRX — amorfo vs cristalino). 🔁 Local alternativo: LIMAV-UFPI OU Dept. de Física-UFPI. Usar o que tiver disponibilidade primeiro.',
    deliverable: 'Espectros FTIR e difratogramas DRX',
    dependencies: ['T4.0b'],
    type: 'analysis',
    location: 'partner',
    partnerId: 'limav',
    bufferWeeks: 1
  },
  {
    id: 'T4.3',
    name: '⏳ FESEM/HRTEM (LIMAV ou Física-UFPI — morfologia)',
    startWeek: 9,
    endWeek: 11,
    phaseId: 'characterization',
    critical: true,
    description: 'Microscopia eletrônica — forma, dispersão e tamanho real das NP-PCL. 🔁 Local alternativo: LIMAV-UFPI OU Dept. de Física-UFPI. Análise mais demorada — agendar com antecedência em AMBOS para garantir.',
    deliverable: 'Imagens FESEM/HRTEM + histogramas de tamanho',
    dependencies: ['T4.0b'],
    type: 'analysis',
    location: 'partner',
    partnerId: 'limav',
    bufferWeeks: 1
  },
  {
    id: 'T4.4',
    name: 'Eficiência de Encapsulamento (EE%) e Loading',
    startWeek: 9,
    endWeek: 9,
    phaseId: 'characterization',
    critical: true,
    description: 'Quantificação por UV-Vis/HPLC do ativo encapsulado vs livre (lab local ou UFPI como backup). Cálculo de EE% e loading capacity.',
    deliverable: 'EE% e DL% determinados',
    dependencies: ['T3.3'],
    type: 'analysis',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T4.5',
    name: 'Cinética de Liberação por Diálise (até 72h)',
    startWeek: 10,
    endWeek: 11,
    phaseId: 'characterization',
    critical: false,
    description: 'Estudo de liberação in vitro em PBS pH 7.4 (e pH 5.5 simulando endossomo). Modelagem matemática (Higuchi, Korsmeyer-Peppas). Lab local.',
    deliverable: 'Curvas de liberação + modelo cinético',
    dependencies: ['T4.4'],
    type: 'analysis',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'M2',
    name: '🚦 GO/NO-GO #2 — Validação da Nanoformulação',
    startWeek: 10,
    endWeek: 10,
    phaseId: 'milestone',
    critical: true,
    description: 'DECISÃO CRÍTICA: NP atende critérios? (Tamanho <300 nm, PdI <0.3, |PZ| >20 mV, EE% >60%). Decisão pode ser tomada com DLS+PZ+EE (sem esperar FESEM completo). Se NÃO → reformular.',
    deliverable: 'Relatório de prova de conceito da NP',
    dependencies: ['T4.1', 'T4.4'],
    type: 'milestone',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 5: ENSAIOS IN VITRO (Lab Local) ============
  {
    id: 'T5.1',
    name: 'Ensaio de inibição AChE e BChE (Ellman modificado)',
    startWeek: 8,
    endWeek: 9,
    phaseId: 'invitro',
    critical: true,
    description: 'Curvas dose-resposta (IC50) para: (a) extrato bruto, (b) fração livre, (c) NP-carregada, (d) NP-vazia. Controle: Donepezil. Lab local.',
    deliverable: 'IC50 AChE/BChE para todos os grupos',
    dependencies: ['T1.3', 'T3.3'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T5.2',
    name: 'Cultura e expansão de SH-SY5Y',
    startWeek: 7,
    endWeek: 9,
    phaseId: 'invitro',
    critical: false,
    description: 'Manutenção, diferenciação (ácido retinóico opcional) e padronização da linhagem para ensaios. Lab local OU parceria local de cultura.',
    deliverable: 'Banco celular padronizado',
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T5.2b',
    name: '🚨 CONTINGÊNCIA — Recuperação cultura MTT (contaminada)',
    startWeek: 8,
    endWeek: 10,
    phaseId: 'invitro',
    critical: true,
    description: '⚠️ MTT CONTAMINOU. Plano de recuperação: (1) descartar cultura comprometida + descontaminar estufa/BSC; (2) requisitar novo aliquot de SH-SY5Y (banco/colaborador); (3) testes de esterilidade do meio/soro/PBS; (4) cultivo paralelo com micoplasma-screen + antibiótico profilático nos primeiros passes; (5) só re-expandir após 3 passes limpos. Avaliar plano B: linhagem alternativa (PC12 ou N2a) se atraso > 3 semanas.',
    deliverable: 'Banco celular novo + laudo de esterilidade + relatório de causa-raiz',
    type: 'lab',
    location: 'home',
    partnerId: 'home',
    bufferWeeks: 1
  },
  {
    id: 'T5.3',
    name: 'Citotoxicidade (MTT) em SH-SY5Y — após recuperação',
    startWeek: 10,
    endWeek: 11,
    phaseId: 'invitro',
    critical: true,
    description: 'Determinação da janela terapêutica não-tóxica das NP-PCL e fração livre. 24h e 48h. ⚠️ Depende da recuperação do banco celular (T5.2b).',
    deliverable: 'CC50 e doses seguras definidas',
    dependencies: ['T5.2', 'T5.2b', 'M2'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T5.4',
    name: 'Neuroproteção contra estresse oxidativo (H₂O₂ ou Aβ)',
    startWeek: 11,
    endWeek: 12,
    phaseId: 'invitro',
    critical: true,
    description: 'Pré-tratamento com NP/fração + insulto oxidativo. Viabilidade celular (MTT) e ROS intracelular (DCFH-DA).',
    deliverable: '% de neuroproteção + dados de ROS',
    dependencies: ['T5.3'],
    type: 'lab',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 6: ZEBRAFISH — UECE/CEARÁ (POUCO CONTROLE!) ============
  {
    id: 'T6.0a',
    name: '🚨 CEUA pela UECE — submissão antecipada',
    startWeek: 1,
    endWeek: 5,
    phaseId: 'invivo',
    critical: true,
    description: 'CRÍTICO! A UECE tramita o protocolo CEUA. Você precisa fornecer toda documentação científica. Aprovação leva 4-8 semanas. Submeter na S1 é OBRIGATÓRIO.',
    deliverable: 'Protocolo CEUA aprovado pela UECE',
    type: 'lab',
    location: 'partner',
    partnerId: 'uece',
    bufferWeeks: 2
  },
  {
    id: 'T6.0b',
    name: '🤝 Cronograma conjunto com UECE (pactuação)',
    startWeek: 2,
    endWeek: 3,
    phaseId: 'invivo',
    critical: true,
    description: 'Reunião formal (videochamada) com lab parceiro UECE. Definir: datas exatas dos ensaios, n° de animais, doses, critérios de inclusão/exclusão, responsabilidades, formato dos dados, possível visita técnica do mestrando.',
    deliverable: 'Cronograma conjunto assinado/confirmado por e-mail',
    dependencies: ['P0.1'],
    type: 'milestone',
    location: 'home',
    partnerId: 'uece'
  },
  {
    id: 'T6.0c-1',
    name: '✅ 1ª RODADA — Envio amostras (extrato/frações) p/ UECE',
    startWeek: 3,
    endWeek: 4,
    phaseId: 'invivo',
    critical: true,
    description: '✅ JÁ REALIZADO. Envio das amostras iniciais (extrato e frações) para UECE — testes solicitados: COMPORTAMENTAL + TOXICIDADE + NOCICEPÇÃO. Material em análise pelo lab parceiro.',
    deliverable: '✅ Amostras (1ª rodada) entregues e em análise na UECE',
    type: 'parallel',
    location: 'home',
    partnerId: 'uece',
    shippingNeeded: true
  },
  {
    id: 'T6.0c',
    name: '📦 2ª RODADA — Envio de NP-PCL para UECE',
    startWeek: 9,
    endWeek: 9,
    phaseId: 'invivo',
    critical: true,
    description: '2ª RODADA: após finalizar nanos, enviar para Fortaleza-CE: NP-PCL otimizada (≥100 mg liofilizada) + NP-PCL vazia (controle) + fração livre. Sedex com rastreio. Anexar protocolo de preparo de doses. Bateria completa será refeita com as nanopartículas.',
    deliverable: 'Amostras (2ª rodada — NP-PCL) entregues na UECE + protocolo enviado',
    dependencies: ['T3.3', 'T6.0a', 'T6.0b'],
    type: 'parallel',
    location: 'home',
    partnerId: 'uece',
    shippingNeeded: true
  },
  {
    id: 'T6.1',
    name: '⏳ Toxicidade Aguda (CL50 - 96h) — UECE',
    startWeek: 10,
    endWeek: 11,
    phaseId: 'invivo',
    critical: true,
    description: 'Determinação da CL50 pelo lab da UECE (OECD 203 adaptado) para NP-PCL. Você acompanha remotamente; lab envia relatório semanal. Buffer embutido para imprevistos. ⚠️ Resultados preliminares da 1ª rodada (amostras já enviadas) devem chegar antes.',
    deliverable: 'CL50 e doses sub-letais definidas (NP-PCL)',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.0c'],
    type: 'lab',
    location: 'partner',
    partnerId: 'uece',
    bufferWeeks: 1
  },
  {
    id: 'T6.1b',
    name: '⏳ Nocicepção (avaliação de dor) — UECE 🆕',
    startWeek: 11,
    endWeek: 12,
    phaseId: 'invivo',
    critical: true,
    description: '🆕 NOVO ENSAIO: avaliação de nocicepção em zebrafish (resposta a estímulo nóxio — ex. ácido acético diluído, mostarda alílica ou térmico). Solicitado pelo lab UECE em conjunto com comportamentais e toxicidade. Aplicado tanto na 1ª rodada (frações) quanto na 2ª (NP-PCL).',
    deliverable: 'Índice de nocicepção + curva dose-resposta',
    dependencies: ['T6.0c'],
    type: 'lab',
    location: 'partner',
    partnerId: 'uece',
    bufferWeeks: 1
  },
  {
    id: 'T6.2',
    name: '⏳ Tanque Claro/Escuro (ansiedade) — UECE',
    startWeek: 12,
    endWeek: 12,
    phaseId: 'invivo',
    critical: true,
    description: 'Avaliação de comportamento ansioso pós-tratamento (5-7 dias). Vídeo-tracking automatizado. Realizado pelo lab UECE; você analisa dados brutos remotamente.',
    deliverable: 'Latência, tempo no claro, transições + vídeos',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.1'],
    type: 'lab',
    location: 'partner',
    partnerId: 'uece'
  },
  {
    id: 'T6.3',
    name: '⏳ Campo Aberto / Open Tank (locomoção) — UECE',
    startWeek: 12,
    endWeek: 12,
    phaseId: 'invivo',
    critical: true,
    description: 'Distância percorrida, velocidade média, tempo na zona central. Mesmo grupo de T6.2.',
    deliverable: 'Parâmetros locomotores',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.1'],
    type: 'lab',
    location: 'partner',
    partnerId: 'uece'
  },
  {
    id: 'T6.4',
    name: '⏳ Esquiva Inibitória (memória) — UECE',
    startWeek: 13,
    endWeek: 13,
    phaseId: 'invivo',
    critical: true,
    description: 'Treino + teste 24h depois. Memória de curto/longo prazo. Pode incluir modelo de prejuízo (escopolamina) para mostrar reversão. Realizado com NP-PCL (2ª rodada).',
    deliverable: 'Latência treino vs teste + índice de memória',
    references: ['MORAES et al. (2026)'],
    dependencies: ['T6.2', 'T6.3'],
    type: 'lab',
    location: 'partner',
    partnerId: 'uece'
  },
  {
    id: 'T6.5',
    name: '⏳ Eutanásia + bioquímica cerebral (AChE ex vivo, MDA) — UECE',
    startWeek: 13,
    endWeek: 14,
    phaseId: 'invivo',
    critical: false,
    description: 'Lab UECE: extração de cérebros + dosagem de AChE ex vivo, peroxidação lipídica e GSH. Pode-se enviar parte para análise no lab local. Reforça mecanismo.',
    deliverable: 'Marcadores bioquímicos cerebrais',
    dependencies: ['T6.4'],
    type: 'lab',
    location: 'partner',
    partnerId: 'uece'
  },
  {
    id: 'T6.6',
    name: '📊 Recebimento e consolidação de dados UECE',
    startWeek: 13,
    endWeek: 14,
    phaseId: 'invivo',
    critical: true,
    description: 'Receber dados brutos, vídeos e relatórios da UECE. Refazer análise estatística no lab local para garantir consistência. Reunião com parceiros para discussão.',
    deliverable: 'Banco de dados unificado + figuras finais',
    dependencies: ['T6.5'],
    type: 'analysis',
    location: 'home',
    partnerId: 'home'
  },

  // ============ FASE 7: ESCRITA DA DISSERTAÇÃO (Paralelo) ============
  {
    id: 'W1',
    name: '✅ Revisão Sistemática — ENTREGUE',
    startWeek: 1,
    endWeek: 5,
    phaseId: 'writing',
    critical: false,
    description: '✅ ENTREGUE. Revisão sistemática sobre S. cumini, Alzheimer, AChE/BChE, nanoformulações poliméricas (PCL) e zebrafish como modelo. Documento finalizado e submetido. Servirá como base do Capítulo 1 da dissertação.',
    deliverable: '✅ Revisão sistemática entregue (Cap. 1 — base)',
    type: 'writing',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'W2',
    name: '📝 Capítulo: Materiais e Métodos',
    startWeek: 3,
    endWeek: 9,
    phaseId: 'writing',
    critical: false,
    description: 'Documentar protocolos EM TEMPO REAL conforme executados. Inclui métodos de TODOS os parceiros (UFPB, IFPI, LIMAV, UFPI, UECE) — solicitar protocolos detalhados a eles.',
    deliverable: 'Capítulo 2 — completo até S9',
    type: 'writing',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'W3',
    name: '📝 Resultados Parciais (Extração + Química UFPB)',
    startWeek: 6,
    endWeek: 8,
    phaseId: 'writing',
    critical: false,
    description: 'Tabelas de rendimento, perfis cromatográficos, identificação de compostos da UFPB. Figuras prontas para qualificação.',
    deliverable: 'Seção Resultados — Parte I',
    dependencies: ['T2.3'],
    type: 'writing',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'W4',
    name: '📝 Resultados (Caracterização NP — IFPI/LIMAV)',
    startWeek: 9,
    endWeek: 12,
    phaseId: 'writing',
    critical: false,
    description: 'Compilação de DLS, PZ, FTIR, XRD, FESEM, EE% e cinética em formato publicável. Adaptável à medida que dados chegam dos parceiros.',
    deliverable: 'Seção Resultados — Parte II',
    dependencies: ['M2'],
    type: 'writing',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'W5',
    name: '📝 Resultados (Biológicos in vitro + in vivo UECE)',
    startWeek: 11,
    endWeek: 14,
    phaseId: 'writing',
    critical: true,
    description: 'Gráficos finais de IC50, neuroproteção, comportamento zebrafish (UECE). Discussão preliminar.',
    deliverable: 'Seção Resultados — Parte III',
    dependencies: ['T5.4', 'T6.6'],
    type: 'writing',
    location: 'home',
    partnerId: 'home'
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
    dependencies: ['T5.4', 'T6.6'],
    type: 'analysis',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T8.2',
    name: 'Discussão integrada + Conclusão',
    startWeek: 14,
    endWeek: 15,
    phaseId: 'writing',
    critical: true,
    description: 'Capítulo de discussão correlacionando química (UFPB) → NP (IFPI/LIMAV) → AChE/BChE → SH-SY5Y → comportamento (UECE). Outlook para Q1.',
    deliverable: 'Capítulo Discussão + Conclusão',
    dependencies: ['T8.1'],
    type: 'writing',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T8.3',
    name: 'Revisão final orientador + ajustes',
    startWeek: 15,
    endWeek: 15,
    phaseId: 'writing',
    critical: true,
    description: 'Submissão ao orientador (entrega ANTECIPADA recomendada na S14). Ajustes e formatação ABNT/PPG. Inclui revisão dos co-autores parceiros se necessário.',
    deliverable: 'Dissertação de qualificação finalizada',
    dependencies: ['T8.2'],
    type: 'writing',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'T8.4',
    name: 'Preparação da apresentação (slides + ensaio)',
    startWeek: 15,
    endWeek: 16,
    phaseId: 'milestone',
    critical: true,
    description: 'Slides de qualificação (~25-30 min), ensaio com grupo de pesquisa, preparação de FAQ. Convidar parceiros remotos para banca virtual se possível.',
    deliverable: 'Apresentação pronta',
    dependencies: ['T8.3'],
    type: 'milestone',
    location: 'home',
    partnerId: 'home'
  },
  {
    id: 'M3',
    name: '🎓 QUALIFICAÇÃO DE MESTRADO',
    startWeek: 16,
    endWeek: 16,
    phaseId: 'milestone',
    critical: true,
    description: 'DEFESA DA QUALIFICAÇÃO. Próximos passos: ensaios complementares + submissão Q1 com co-autoria de todos os parceiros.',
    deliverable: '✅ Qualificação aprovada',
    dependencies: ['T8.4'],
    type: 'milestone',
    location: 'home',
    partnerId: 'home'
  }
]

// Caminho Crítico — sequência de tarefas que NÃO podem atrasar
export const criticalPath: string[] = [
  'P0.1', 'P0.2',                          // Gestão de parcerias
  'T1.1', 'T1.2', 'T1.3',                  // Extração
  'T2.0', 'T2.1', 'T2.3',                  // Química UFPB (1ª rodada já enviada)
  'M1',                                     // Decisão fração
  'D1', 'D2', 'D3',                         // Planejamento Fatorial (DoE) — ALEK
  'T3.2', 'T3.3',                           // Nanoformulação PCL
  'T4.0a', 'T4.1',                          // DLS/PZ LIMAV-UFPI
  'T4.0b', 'T4.3',                          // FESEM LIMAV ou Física
  'T4.4',                                   // EE% local
  'M2',                                     // Validação NP
  'T5.1', 'T5.2b', 'T5.3', 'T5.4',         // In vitro (com contingência MTT)
  'T6.0a', 'T6.0b', 'T6.0c-1', 'T6.0c',    // Setup UECE + 2 rodadas de envio
  'T6.1', 'T6.1b', 'T6.2', 'T6.3', 'T6.4', // Comportamento + Nocicepção UECE
  'T6.6',                                   // Consolidação dados
  'W5',                                     // Escrita resultados
  'T8.1', 'T8.2', 'T8.3', 'T8.4',          // Finalização
  'M3'                                      // Qualificação
]

// Estatísticas resumidas
export const stats = {
  totalWeeks: 16,
  totalTasks: tasks.length,
  criticalTasks: tasks.filter(t => t.critical).length,
  milestones: tasks.filter(t => t.type === 'milestone').length,
  externalTasks: tasks.filter(t => t.location === 'partner').length,
  partners: partners.length - 1, // exclui 'home'
  startDate: '18 de Maio de 2026',
  endDate: '31 de Agosto de 2026 (Qualificação)',
  qualificationWeek: 16
}
