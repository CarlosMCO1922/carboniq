# USER_GUIDE.md

Este guia explica como usar a aplicação Carboniq no ambiente local.

## Pré‑requisitos
- Infra: `docker compose -f infra/docker-compose.yml up -d` (Postgres + Redis)
- API: `pnpm dev:api` (http://localhost:3000)
- Web: `PORT=3001 pnpm dev:web` (http://localhost:3001)

## Fluxo principal
1) Página inicial
   - Botões principais:
     - "Começar (Onboarding)" → cria Organização e Projeto
     - "Ver Projetos" → lista todos os projetos existentes
   - Alternadores:
     - Idioma (PT/EN)
     - Moeda (EUR/USD)

2) Onboarding (/pt/onboarding)
   - Seleciona tipo (B2C/B2B), nome da organização, nome do projeto e região (PT/EU/UK)
   - Submete → redireciona para a página do projeto

3) Página do Projeto (/pt/projects/:id)
   - Cards de Sumário: Total CO2e e por Escopo 1/2/3
   - Tabela de Atividades:
     - "Nova atividade" → formulário para criar (tipo, quantidade, unidade, fator opcional)
     - Em cada linha: "Calcular" (cria cálculo) e "Editar" (altera dados/fator)
   - Ações no rodapé:
     - "Exportar CSV" → descarrega cálculos do projeto
     - "Calcular todas" → cria cálculos para todas as atividades do projeto
     - "Importar CSV (Spend)" → abre importação de despesas para cálculo spend‑based

4) Nova Atividade (/pt/projects/:id/activities/new)
   - Campos: tipo, quantidade, unidade
   - Fator (opcional): lista de fatores (por agora region PT por omissão)
   - Guardar → volta ao projeto

5) Editar Atividade (/pt/projects/:id/activities/:activityId/edit)
   - Altera tipo/quantidade/unidade
   - Fator: filtrado pela região do projeto (SCOPE2 demo)
   - Guardar → volta ao projeto

6) Importar CSV (Spend) (/pt/projects/:id/spend/import)
   - Cola CSV com cabeçalhos: `date,amount,currency,category`
   - Clica "Importar" → envia para API, cria despesas
   - (Opcional) Configurar mapeamentos: ver abaixo

7) Mapeamentos Spend (/pt/projects/:id/spend/mappings)
   - Lista mapeamentos `categoria → fator`
   - Adiciona novo mapeamento (ex.: `OFFICE → SPEND_GEN_2024`)
   - Depois, na API: `POST /spend/compute { projectId }` (em breve botão na UI)

## Comandos úteis (API)
- Sumário: `GET /projects/:id/summary`
- Calcular todas: `POST /projects/:id/calculate`
- Atividades: `GET /activities?projectId=:id`, `POST /activities`, `PATCH /activities/:id`
- Spend: `POST /spend/mappings`, `GET /spend/mappings?projectId=:id`, `POST /spend/import.csv?projectId=:id`, `POST /spend/compute { projectId }`

## Notas
- Variáveis: `apps/web/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Seeds: inclui fatores de eletricidade e um fator spend genérico (EUR → CO2e)
- CORS: ativo para `localhost:*`
