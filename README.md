# Cronograma Interativo — Mestrado *Syzygium cumini*

## Visão Geral
- **Nome**: Cronograma Mestrado S. cumini Nanoformulação Neuroprotetora
- **Objetivo**: Aplicação web interativa que visualiza o cronograma detalhado de um projeto de mestrado em nanobiotecnologia, com qualificação prevista para Agosto/2026
- **Projeto científico**: Desenvolver nanoformulação polimérica Gelatina/PLA carregada com frações Hexano e Acetato de Etila das folhas de *Syzygium cumini* (Jamelão) para testar potencial neuroprotetor contra Alzheimer (inibição AChE/BChE + modelos em Zebrafish)

## Funcionalidades Implementadas

### 6 Visualizações Interativas
1. **Gráfico de Gantt** — visão geral de 16 semanas com barras coloridas por fase, destaque do caminho crítico (animação pulsante), filtro por fase clicando nas chips, e modal detalhado ao clicar em qualquer tarefa
2. **Por Fase** — agrupamento das 33 tarefas pelas 8 fases do projeto (Extração, Caracterização Química, Nanoformulação, Caracterização NP, In Vitro, Zebrafish, Escrita, Marcos)
3. **Caminho Crítico** — sequência das 25 tarefas que NÃO podem atrasar, em formato de linha do tempo conectada
4. **Semana a Semana** — 16 cards (um por semana) mostrando todas as tarefas ativas em cada semana, com destaque especial para a semana da qualificação (S16)
5. **Plano de Escrita** — 5 dicas práticas + cronograma dos capítulos da dissertação em paralelo aos experimentos
6. **Estratégia Q1** — princípios do cronograma, riscos & mitigações, revistas-alvo, checklist mínimo Q1, plano pós-qualificação e hierarquia de prioridades

### Recursos UX
- 📊 **Modal de detalhes** com descrição, entregável, dependências e referências de cada tarefa
- 🔥 **Toggle de Caminho Crítico** que destaca apenas as tarefas críticas
- 🎨 **Filtro por Fase** clicando nas chips coloridas da legenda
- 🚦 **Marcos GO/NO-GO** identificados visualmente (M1, M2, M3)
- 📱 **Design responsivo** com Tailwind CSS
- ⚡ **Renderização SSR** via Hono + Cloudflare Workers

## Estrutura do Cronograma

| Período | Fase | Semanas |
|---|---|---|
| 18/Mai – 07/Jun | Extração e Fracionamento (parâmetros DA ROSA et al. 2024) | S1–S3 |
| 01/Jun – 21/Jun | Caracterização Química (LC-MS/MS, GC-MS) | S3–S5 |
| 08/Jun – 05/Jul | Nanoformulação Gelatina/PLA (RAJKUMAR et al. 2025) | S4–S7 |
| 22/Jun – 26/Jul | Caracterização da NP (UV-Vis, FTIR, XRD, FESEM, DLS, ZP, liberação) | S6–S10 |
| 06/Jul – 02/Ago | Ensaios In Vitro (AChE/BChE + SH-SY5Y) | S8–S11 |
| 13/Jul – 16/Ago | Zebrafish (CL50, ansiedade, locomoção, memória) | S9–S13 |
| 18/Mai – 30/Ago | Escrita da Dissertação (paralelo) | S1–S15 |
| 31/Ago | 🎓 **QUALIFICAÇÃO** | S16 |

### Marcos Críticos
- **M1 (S5)**: GO/NO-GO seleção da fração mais promissora (Hexano vs Acetato)
- **M2 (S9)**: GO/NO-GO validação da nanoformulação (tamanho <300nm, PdI <0.3, |PZ| >20mV, EE% >60%)
- **M3 (S16)**: 🎓 Qualificação de Mestrado

## URLs

### Endpoints Funcionais
| Rota | Método | Descrição |
|---|---|---|
| `/` | GET | Página principal com todas as visualizações interativas |
| `/api/schedule` | GET | JSON completo: tasks, phases, weeks, criticalPath, stats |
| `/api/tasks/:phaseId` | GET | Tarefas filtradas por fase (ex: `/api/tasks/nano`) |
| `/api/critical-path` | GET | Apenas as 25 tarefas do caminho crítico |

### Identificadores de Fase (para `/api/tasks/:phaseId`)
`extraction` · `chemistry` · `nano` · `characterization` · `invitro` · `invivo` · `writing` · `milestone`

### Acesso Local (Sandbox)
- **Sandbox**: porta 3000 — usar `GetServiceUrl` para URL pública

## Arquitetura de Dados

### Modelo `Task`
```typescript
{
  id: string                    // ex: "T3.2"
  name: string                  // nome da tarefa
  startWeek: number             // semana inicial (1-16)
  endWeek: number               // semana final
  phaseId: string               // referência à fase
  critical: boolean             // caminho crítico?
  description: string           // descrição detalhada
  deliverable?: string          // entregável esperado
  references?: string[]         // referências bibliográficas
  dependencies?: string[]       // IDs de tarefas pré-requisito
  type: 'lab' | 'analysis' | 'writing' | 'milestone' | 'parallel'
}
```

### Estatísticas
- **16 semanas** (18/Mai/2026 → 31/Ago/2026)
- **33 tarefas** mapeadas
- **25 tarefas críticas** (caminho crítico)
- **3 marcos** (M1, M2, M3 = Qualificação)
- **8 fases** com cores e ícones próprios

### Storage
- ✅ Dados estruturados em TypeScript estático (`src/data/schedule.ts`)
- ❌ Sem banco de dados (cronograma é fixo, não há persistência necessária)

## Funcionalidades Não Implementadas (Possíveis Próximos Passos)

- [ ] **Edição inline** de datas e tarefas (modo edição)
- [ ] **Persistência em D1** para múltiplos usuários e cronogramas customizados
- [ ] **Export para PDF/PNG** do gráfico de Gantt
- [ ] **Tracking de progresso real** (% concluído por tarefa, com checkboxes)
- [ ] **Notificações/alertas** para marcos próximos
- [ ] **Integração com Google Calendar / Outlook**
- [ ] **Modo escuro**
- [ ] **Autenticação** para salvar versões pessoais
- [ ] **Importar/exportar JSON** do cronograma
- [ ] **Comparação de cenários** (otimista vs pessimista)

## Stack Técnica

- **Framework**: Hono 4.x (lightweight, edge-first)
- **Build**: Vite 6 + `@hono/vite-build`
- **Runtime**: Cloudflare Workers / Pages
- **Frontend**: Tailwind CSS (CDN) + Font Awesome 6 + JavaScript vanilla
- **Renderização**: SSR via JSX renderer do Hono
- **Process Manager**: PM2

## Como Executar Localmente

```bash
# Build do projeto (gera dist/_worker.js e dist/static/)
cd /home/user/webapp && npm run build

# Iniciar com PM2 (porta 3000)
pm2 start ecosystem.config.cjs

# Testar
curl http://localhost:3000/
curl http://localhost:3000/api/schedule

# Logs
pm2 logs webapp --nostream

# Parar
pm2 delete webapp
```

## Deployment

- **Platform**: Cloudflare Pages
- **Status**: ✅ Pronto para deploy (build OK, sem erros)
- **Last Updated**: 25 de Abril de 2026

### Para deploy em produção:
```bash
npm run build
npx wrangler pages deploy dist --project-name <nome-cf>
```

## Referências Científicas Base

- **DA ROSA et al. (2024)** — Parâmetros otimizados de extração ultrassom (60°C, 30 min)
- **IMRAN et al. (2025)** — Escutelareína e relevância para Alzheimer
- **RAJKUMAR et al. (2025)** — Nanocompósitos Gelatina/PLA
- **MORAES et al. (2026)** — Modelos comportamentais em Zebrafish (Tanque Claro/Escuro, Campo Aberto, Esquiva Inibitória)

## Guia de Uso

1. **Abra a aplicação** na rota raiz `/`
2. **Navegue pelas 6 abas** no menu superior (Gantt, Por Fase, Caminho Crítico, Semana a Semana, Plano de Escrita, Estratégia Q1)
3. **Filtre por fase** clicando nas chips coloridas da legenda
4. **Destaque o caminho crítico** clicando no botão vermelho no canto direito da legenda
5. **Veja detalhes** de qualquer tarefa clicando nela (abre modal com descrição, entregável, dependências e referências)
6. **Use ESC** para fechar o modal
