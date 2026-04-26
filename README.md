# Cronograma Interativo — Mestrado *Syzygium cumini*

## Visão Geral
- **Nome**: Cronograma Mestrado S. cumini Nanoformulação Neuroprotetora
- **Objetivo**: Aplicação web interativa que visualiza o cronograma detalhado de um projeto de mestrado em nanobiotecnologia, com qualificação prevista para Agosto/2026
- **Projeto científico**: Desenvolver nanoformulação polimérica Gelatina/PLA carregada com frações Hexano e Acetato de Etila das folhas de *Syzygium cumini* (Jamelão) para testar potencial neuroprotetor contra Alzheimer (inibição AChE/BChE + modelos em Zebrafish)

## 🚀 Deploy rápido no Netlify (drop-ready)

1. Baixe `cronograma-netlify.zip` (botão verde "Baixar p/ Netlify" no app, ou em `/static/cronograma-netlify.zip`)
2. Descompacte (apenas 5 arquivos, com **`index.html` na raiz**)
3. Acesse https://app.netlify.com/drop e arraste a pasta inteira
4. **Pronto!** Site no ar em ~30 segundos

## ☁️ Sincronização Supabase (multi-dispositivo, opcional)

1. Crie conta gratuita em https://supabase.com → novo projeto
2. SQL Editor → cole o conteúdo de `supabase-schema.sql` → RUN
3. No app, clique em **"Supabase"** no topo → cole **Project URL** e **anon public key**
4. Salvar — progresso sincroniza automaticamente entre todos os dispositivos

Sem Supabase, tudo funciona em modo local (localStorage) com export/import manual.

## Funcionalidades Implementadas

### 8 Visualizações Interativas
1. **Gráfico de Gantt** — 44 tarefas em 16 semanas, barras coloridas por fase, badges de localização (Lab Local / parceiro)
2. **Por Fase** — agrupamento das tarefas pelas 8 fases do projeto, com mini barra de progresso por fase
3. **Caminho Crítico** — sequência das 34 tarefas que NÃO podem atrasar
4. **Parcerias** ⭐ — gestão completa das 5 parcerias externas (UFPB, LIMAV, IFPI, UFPI, UECE), checklist, timeline de envios, template de e-mail
5. **Semana a Semana** — 16 cards mostrando todas as tarefas ativas em cada semana
6. **Plano de Escrita** — dicas + cronograma dos capítulos da dissertação em paralelo
7. **Estratégia Q1** — princípios, riscos & mitigações, revistas-alvo, checklist mínimo Q1
8. **Como Usar** — guia completo de uso, fluxo recomendado, FAQ e atalhos

### Recursos UX
- ✅ **Sistema de checkboxes** em todas as visualizações com persistência em localStorage
- 📊 **Barra de progresso global** sticky no topo (geral + crítico)
- 🤝 **Tracking de parcerias**: pendente → negociando → confirmada (clicável)
- 🚚 **Ícones de envio** (truck) para tarefas que requerem logística
- 🛡️ **Buffer de tempo visível** (+1sem, +2sem) para tarefas externas
- 📝 **Anotações por tarefa e por parceiro** salvas localmente
- 💾 **Export / Import / Reset** do progresso + status de parcerias em JSON
- 🔥 **Toggle de Caminho Crítico** que destaca apenas as tarefas críticas
- 🎨 **Filtro por Fase** clicando nas chips coloridas
- 🚦 **Marcos GO/NO-GO** identificados visualmente (M1, M2, M3)
- 📱 **Design responsivo** com Tailwind CSS
- 🖨️ **Pronto para impressão** (Ctrl+P gera PDF estilizado)
- ⚡ **Renderização SSR** via Hono + Cloudflare Workers

## Estrutura do Cronograma

| Período | Fase | Local | Semanas |
|---|---|---|---|
| 18/Mai – 07/Jun | Extração e Fracionamento (DA ROSA et al. 2024) | 🏠 Lab Local | S1–S3 |
| 01/Jun – 28/Jun | Caracterização Química (LC-MS/MS, GC-MS) | 🔬 **UFPB / Anauara** | S3–S6 |
| 08/Jun – 12/Jul | Nanoformulação Gelatina/PLA (RAJKUMAR et al. 2025) | 🏠 Lab Local | S4–S8 |
| 29/Jun – 02/Ago | DLS / Potencial Zeta / UV-Vis | ⚛️ **IFPI** | S7–S11 |
| 13/Jul – 02/Ago | FESEM / HRTEM / XRD / FTIR | 🔬 **LIMAV (UFPI)** | S9–S11 |
| 06/Jul – 09/Ago | Ensaios In Vitro (AChE/BChE + SH-SY5Y) | 🏠 Lab Local | S8–S12 |
| 18/Mai – 16/Ago | Zebrafish (CEUA + comportamento) | 🐟 **UECE / CE** | S1–S13 |
| 18/Mai – 30/Ago | Escrita da Dissertação (paralelo) | 🏠 Lab Local | S1–S15 |
| 31/Ago | 🎓 **QUALIFICAÇÃO** | 🏠 Lab Local | S16 |

### Parceiros Externos
- **🏠 Lab Local** — Base, maior controle. Extração, NP, in vitro, escrita.
- **🔬 UFPB / Profa. Anauara** (João Pessoa-PB) — LC-MS/MS, GC-MS, identificação de Escutelareína/Friedelina
- **⚛️ IFPI** (Teresina-PI) — DLS, Potencial Zeta, UV-Vis (feedback rápido para otimização)
- **🔬 LIMAV / UFPI** (Teresina-PI) — FESEM, HRTEM, XRD, FTIR (caracterização morfológica/estrutural)
- **🔬 UFPI** (Teresina-PI) — Backup de FTIR e HPLC
- **🐟 UECE** (Fortaleza-CE) — **CRÍTICO**: zebrafish, CEUA, todos os ensaios comportamentais

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

### Endpoint de Parcerias
- `GET /api/partners/:partnerId` — tarefas de um parceiro específico
- IDs de parceiros: `home` · `ufpb-anauara` · `limav` · `ifpi` · `ufpi` · `uece`

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
- ✅ Dados do cronograma em TypeScript estático (`src/data/schedule.ts`)
- ✅ Progresso do usuário em **localStorage** (chave: `cronograma-mestrado-progresso-v1`)
- ✅ Export/Import de progresso em **JSON**

### Modelo de Progresso (localStorage)
```typescript
{
  [taskId: string]: {
    done: boolean
    completedAt: string | null  // ISO timestamp
    note: string                // anotação livre do usuário
  }
}
```

## Funcionalidades Não Implementadas (Possíveis Próximos Passos)

- [ ] **Edição inline** de datas e tarefas (modo edição)
- [ ] **Persistência em D1** para múltiplos usuários e cronogramas customizados
- [ ] **Sincronização cloud** (atualmente apenas localStorage, sem auth)
- [ ] **Notificações/alertas** para marcos próximos
- [ ] **Integração com Google Calendar / Outlook**
- [ ] **Modo escuro**
- [ ] **Autenticação** para salvar versões pessoais entre dispositivos
- [ ] **Comparação de cenários** (otimista vs pessimista)
- [ ] **Gráfico de burndown** (progresso real vs ideal ao longo do tempo)

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
