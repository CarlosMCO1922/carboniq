# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview
Monorepo (pnpm + Turborepo) com:
- apps/web: Next.js (TS, Tailwind)
- apps/api: NestJS (TS) + Prisma + PostgreSQL
- services/calc: FastAPI (Python) com /health
- packages/shared: tipos/domínio em TypeScript
- infra: docker-compose (Postgres, Redis)

CI: GitHub Actions (lint/typecheck/test). Deploy: Render (render.yaml com web/api/calc).

## Commands
Pré-requisitos: pnpm, Node 20+, Docker (ou Postgres/Redis locais), opcional Poetry para calc.

Instalação
- pnpm install

Infra (DB/Redis)
- docker compose -f infra/docker-compose.yml up -d

Desenvolvimento (local)
- API (NestJS, porta 3000): pnpm dev:api
- Web (Next.js, sugerido 3001): PORT=3001 pnpm dev:web
  - Configurar base URL: criar apps/web/.env.local com NEXT_PUBLIC_API_URL=http://localhost:3000
- Calc (FastAPI, porta 8001):
  - Se tens Poetry: (cd services/calc && poetry install) depois pnpm dev:calc
  - Health check: curl http://localhost:8001/health

Build/Lint/Test (Turborepo)
- build (todas): pnpm build
- lint (todas): pnpm lint
- test (todas): pnpm test

API — Prisma/DB
- Gerar client: pnpm --filter api prisma:generate
- Migrar (dev): pnpm --filter api prisma:migrate -- --name <nome>
- Prisma Studio: pnpm --filter api prisma:studio

API — Testes (Jest)
- Todos os testes: pnpm --filter api test
- E2E: pnpm --filter api test:e2e
- Um ficheiro: pnpm --filter api test -- src/app.controller.spec.ts
- Por nome: pnpm --filter api test -- -t "<nome do teste>"

## Arquitetura (alto nível)
- apps/web (Next.js): UI com Tailwind. Consome a API via NEXT_PUBLIC_API_URL. i18n e toggles (PT/EN, EUR/USD) planeados.
- apps/api (NestJS): camada de aplicação/REST; CORS ativo para localhost; PrismaService para acesso a dados; migrations gerem schema. Porta padrão 3000.
- services/calc (FastAPI): motor de cálculo isolado; endpoint /health; expõe futura lógica de fatores/simulações. Porta 8001.
- packages/shared: tipos de domínio partilhados entre web e api (Currency, Locale, ActivityInput, etc.).
- infra (docker-compose): Postgres 16 e Redis 7. Nota: para evitar colisão com Postgres local, podes mapear 5433->5432 (ajustar DATABASE_URL em apps/api/.env).
- CI/CD: .github/workflows/ci.yml usa pnpm/turbo; render.yaml descreve 3 serviços para Render (web/api/calc) e as variáveis necessárias.

## Notas
- Env local: copiar .env.example para .env na raiz e apps/api/.env; Next usa apps/web/.env.local.
- Portos: API 3000, Web 3001 (sugerido), Calc 8001, Redis 6379, Postgres host: ver infra/docker-compose.yml.
- Single test por app: usar pnpm --filter <app> test -- <path|pattern>.

## Documentos incorporados
- README.md: carboniq — Cálculo de Pegadas de Carbono.
