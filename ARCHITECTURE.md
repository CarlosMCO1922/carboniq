# 🏗️ Arquitetura do Carboniq

## 📐 Diagrama de Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAMADA DE APRESENTAÇÃO                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Frontend (Next.js 16)                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Pages      │  │  Components  │  │   Hooks      │          │   │
│  │  │  (App Router)│  │  (Reusable) │  │  (State Mgmt)│          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                   │   │
│  │  Tecnologias:                                                    │   │
│  │  • Next.js 16 (App Router)                                       │   │
│  │  • React 19                                                      │   │
│  │  • TypeScript                                                    │   │
│  │  • Tailwind CSS 4                                                │   │
│  │  • next-intl (i18n)                                             │   │
│  │  • Recharts/Chart.js (visualizações)                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              ↕ HTTP/REST                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE APLICAÇÃO/API                            │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              API Gateway (NestJS 11)                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │ Controllers  │  │   Services   │  │   Modules    │          │   │
│  │  │  (REST API)  │  │  (Business)  │  │  (DI/Config) │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                   │   │
│  │  Módulos:                                                         │   │
│  │  • Users          • Activities    • Calculations                 │   │
│  │  • Organizations  • Projects      • Factors                      │   │
│  │  • Spend          • Health        • Reports                     │   │
│  │                                                                   │   │
│  │  Tecnologias:                                                    │   │
│  │  • NestJS 11                                                     │   │
│  │  • TypeScript                                                    │   │
│  │  • Prisma ORM                                                     │   │
│  │  • Express (underlying)                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              ↕ gRPC/HTTP                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE SERVIÇOS                                 │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │         Calculation Service (Python/FastAPI)                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │  Calculators │  │   Validators │  │   Formatters │          │   │
│  │  │  (Complex)   │  │  (Input)     │  │  (Output)    │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                   │   │
│  │  Tecnologias:                                                    │   │
│  │  • FastAPI                                                       │   │
│  │  • Python 3.11+                                                  │   │
│  │  • NumPy/Pandas (cálculos complexos)                             │   │
│  │  • Pydantic (validação)                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE DADOS                                    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL 16                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Tables     │  │   Indexes    │  │   Migrations │          │   │
│  │  │  (Prisma)    │  │  (Performance)│  │  (Versioning)│          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                   │   │
│  │  Modelos Principais:                                             │   │
│  │  • Users, Organizations, Projects                                │   │
│  │  • Activities, Calculations                                      │   │
│  │  • EmissionFactors                                               │   │
│  │  • Expenses, SpendMappings                                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Redis 7                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Cache      │  │   Sessions   │  │   Queues     │          │   │
│  │  │  (Factors)   │  │  (Auth)     │  │  (Jobs)     │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        INFRAESTRUTURA                                     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Docker Compose                                │   │
│  │  • PostgreSQL Container                                          │   │
│  │  • Redis Container                                               │   │
│  │  • (Futuro: API, Web, Calc como containers)                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Monorepo (Turborepo)                         │   │
│  │  • apps/api (NestJS)                                             │   │
│  │  • apps/web (Next.js)                                            │   │
│  │  • services/calc (Python)                                        │   │
│  │  • packages/shared (TypeScript types)                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados Detalhado

### 1. Fluxo de Criação de Atividade e Cálculo

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Browser │ ───> │ Next.js │ ───> │ NestJS  │ ───> │ Prisma  │ ───> │PostgreSQL│
│         │      │  (SSR)  │      │  API    │      │  ORM    │      │          │
└─────────┘      └─────────┘      └─────────┘      └─────────┘      └─────────┘
     │                 │                 │                 │                 │
     │                 │                 │                 │                 │
     │ POST /activities                 │                 │                 │
     │──────────────────────────────────>│                 │                 │
     │                 │                 │                 │                 │
     │                 │                 │ createActivity()│                 │
     │                 │                 │────────────────>│                 │
     │                 │                 │                 │ INSERT          │
     │                 │                 │                 │─────────────────>│
     │                 │                 │                 │                 │
     │                 │                 │ POST /calculations                │
     │                 │                 │───────────────────────────────────>│
     │                 │                 │                 │                 │
     │                 │                 │ compute()       │                 │
     │                 │                 │────────────────>│                 │
     │                 │                 │                 │ SELECT factor   │
     │                 │                 │                 │─────────────────>│
     │                 │                 │                 │                 │
     │                 │                 │ (if complex)     │                 │
     │                 │                 │───────────────────────────────────>│
     │                 │                 │                 │  Calc Service    │
     │                 │                 │                 │  (Python)        │
     │                 │                 │                 │                 │
     │                 │                 │ INSERT calculation               │
     │                 │                 │───────────────────────────────────>│
     │                 │                 │                 │                 │
     │  Response       │                 │                 │                 │
     │<──────────────────────────────────│                 │                 │
     │                 │                 │                 │                 │
```

### 2. Fluxo de Visualização de Resultados

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Browser │ ───> │ Next.js │ ───> │ NestJS  │ ───> │PostgreSQL│
│         │      │         │      │  API    │      │          │
└─────────┘      └─────────┘      └─────────┘      └─────────┘
     │                 │                 │                 │
     │ GET /projects/:id/summary         │                 │
     │───────────────────────────────────>│                 │
     │                 │                 │                 │
     │                 │                 │ aggregate()     │
     │                 │                 │────────────────>│
     │                 │                 │                 │
     │                 │                 │ SELECT + GROUP BY│
     │                 │                 │─────────────────>│
     │                 │                 │                 │
     │                 │                 │ (check cache)   │
     │                 │                 │─────────────────>│
     │                 │                 │    Redis        │
     │                 │                 │                 │
     │                 │                 │ JSON response    │
     │                 │<────────────────│                 │
     │                 │                 │                 │
     │  Render charts  │                 │                 │
     │<────────────────│                 │                 │
     │                 │                 │                 │
```

---

## 🛠️ Stack Tecnológico Detalhado

### Frontend (apps/web)

**Framework:**
- **Next.js 16** - App Router, Server Components, SSR/SSG
- **React 19** - UI library
- **TypeScript** - Type safety

**Estilização:**
- **Tailwind CSS 4** - Utility-first CSS
- **CSS Modules** - Component-scoped styles (se necessário)

**Internacionalização:**
- **next-intl** - i18n para PT/EN

**Visualizações:**
- **Recharts** ou **Chart.js** - Gráficos interativos
- **D3.js** (opcional) - Visualizações avançadas

**Estado:**
- **React Server Components** - Estado no servidor
- **React Hooks** - Estado local
- **Zustand** ou **Jotai** (futuro) - Estado global se necessário

**Formulários:**
- **React Hook Form** - Gestão de formulários
- **Zod** - Validação de schemas

**Outros:**
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

---

### Backend API (apps/api)

**Framework:**
- **NestJS 11** - Arquitetura modular, DI, decorators
- **Express** (underlying) - HTTP server

**ORM:**
- **Prisma** - Type-safe database client
- **Prisma Migrate** - Versionamento de schema

**Validação:**
- **class-validator** - DTO validation
- **class-transformer** - Transformação de objetos

**Autenticação (futuro):**
- **@nestjs/jwt** - JWT tokens
- **@nestjs/passport** - Estratégias de auth

**Documentação:**
- **Swagger/OpenAPI** - API documentation

**Testes:**
- **Jest** - Unit & E2E tests
- **Supertest** - HTTP testing

**Outros:**
- **@nestjs/config** - Configuração
- **helmet** - Security headers
- **compression** - Response compression

---

### Calculation Service (services/calc)

**Framework:**
- **FastAPI** - High-performance Python API
- **Uvicorn** - ASGI server

**Cálculos:**
- **NumPy** - Operações numéricas
- **Pandas** - Manipulação de dados (se necessário)

**Validação:**
- **Pydantic** - Data validation

**Testes:**
- **pytest** - Testing framework
- **httpx** - HTTP client for testing

---

### Base de Dados

**PostgreSQL 16:**
- Relacional, ACID compliance
- JSON support para metadata
- Full-text search (futuro)
- Extensions: PostGIS (se necessário para localização)

**Redis 7:**
- Cache de fatores de emissão
- Session storage (futuro)
- Job queues (futuro com BullMQ)

---

### Infraestrutura

**Monorepo:**
- **Turborepo** - Build system
- **pnpm** - Package manager

**Containerização:**
- **Docker** - Containers
- **Docker Compose** - Orquestração local

**CI/CD (futuro):**
- **GitHub Actions** ou **GitLab CI**
- **Docker Hub** ou **GitHub Container Registry**

**Deployment (futuro):**
- **Vercel** ou **Netlify** - Frontend
- **Railway** ou **Render** - Backend
- **AWS/GCP** - Produção escalável

---

## 🔌 Comunicação Entre Serviços

### Frontend ↔ API

**Protocolo:** HTTP/REST

**Endpoints principais:**
```
GET    /projects/:id/summary
GET    /activities?projectId=:id
POST   /activities
PATCH  /activities/:id
POST   /calculations
GET    /factors?region=:r&scope=:s
POST   /spend/import.csv
POST   /spend/compute
```

**Formato:** JSON

**Autenticação (futuro):** JWT Bearer tokens

---

### API ↔ Calculation Service

**Protocolo:** HTTP/REST (atual) ou gRPC (futuro)

**Endpoints:**
```
GET  /health
POST /calculate
  Body: {
    activityId: string
    factorId: string
    amount: number
    unit: string
  }
  Response: {
    co2e: number
    breakdown: object
  }
```

**Formato:** JSON

**Localização:** Mesma rede (localhost em dev, service mesh em prod)

---

### API ↔ Database

**ORM:** Prisma Client

**Conexão:** Connection pooling automático

**Queries:** Type-safe, geradas pelo Prisma

**Migrations:** Prisma Migrate

---

### API ↔ Redis

**Cliente:** ioredis ou @nestjs/cache-manager

**Uso:**
- Cache de fatores (TTL: 1 hora)
- Cache de sumários (TTL: 5 minutos)
- Session storage (futuro)

---

## 📦 Estrutura de Pacotes (Monorepo)

```
carboniq/
├── apps/
│   ├── api/              # NestJS Backend
│   │   ├── src/
│   │   │   ├── activities/
│   │   │   ├── calculations/
│   │   │   ├── factors/
│   │   │   ├── projects/
│   │   │   ├── users/
│   │   │   └── ...
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── web/              # Next.js Frontend
│       ├── app/
│       │   └── [locale]/
│       │       ├── page.tsx
│       │       ├── projects/
│       │       └── ...
│       ├── components/
│       └── messages/     # i18n
│
├── services/
│   └── calc/            # Python Calculation Service
│       ├── app/
│       │   └── main.py
│       └── pyproject.toml
│
├── packages/
│   └── shared/          # Shared TypeScript types
│       └── src/
│           └── index.ts
│
├── infra/
│   └── docker-compose.yml
│
└── turbo.json
```

---

## 🔐 Segurança (Futuro)

1. **Autenticação:**
   - JWT tokens
   - Refresh tokens
   - OAuth2 (Google, GitHub)

2. **Autorização:**
   - RBAC (Role-Based Access Control)
   - Permissões por projeto/organização

3. **Validação:**
   - Input validation (class-validator)
   - SQL injection prevention (Prisma)
   - XSS prevention (React escaping)

4. **HTTPS:**
   - TLS/SSL em produção
   - HSTS headers

5. **Rate Limiting:**
   - @nestjs/throttler

---

## 📈 Escalabilidade (Futuro)

1. **Horizontal Scaling:**
   - Load balancer (Nginx/Traefik)
   - Múltiplas instâncias da API
   - Database read replicas

2. **Caching:**
   - Redis cluster
   - CDN para assets estáticos

3. **Queue System:**
   - BullMQ para jobs assíncronos
   - Processamento de cálculos em background

4. **Monitoring:**
   - Prometheus + Grafana
   - Sentry para error tracking
   - Log aggregation (ELK stack)

---

## 🧪 Testes

**Frontend:**
- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **React Testing Library** - Component tests

**Backend:**
- **Jest** - Unit & Integration tests
- **Supertest** - API tests
- **Prisma Test Environment** - Database tests

**Calculation Service:**
- **pytest** - Unit tests
- **httpx** - API tests

---

## 📊 Observabilidade (Futuro)

1. **Logging:**
   - Winston (NestJS)
   - Structured logging (JSON)

2. **Metrics:**
   - Prometheus metrics
   - Custom business metrics

3. **Tracing:**
   - OpenTelemetry
   - Distributed tracing

---

## 🚀 Deployment Strategy

**Desenvolvimento:**
- Docker Compose local
- Hot reload para todos os serviços

**Staging:**
- Containers em cloud (Railway/Render)
- Database managed (Supabase/Neon)

**Produção:**
- Kubernetes ou managed containers
- Managed PostgreSQL
- CDN para frontend
- Auto-scaling baseado em carga

---

## 🔄 Fluxo de Desenvolvimento

1. **Feature Branch:**
   - Criar branch do `main`
   - Desenvolver feature
   - Testes locais

2. **CI/CD:**
   - Lint & type check
   - Unit tests
   - Build verification
   - E2E tests (staging)

3. **Deploy:**
   - Merge para `main`
   - Auto-deploy para staging
   - Manual approval para produção

---

## 📝 Próximos Passos de Arquitetura

1. **Curto Prazo:**
   - Implementar autenticação
   - Adicionar Redis caching
   - Melhorar Calculation Service

2. **Médio Prazo:**
   - Adicionar job queues
   - Implementar WebSockets (real-time updates)
   - Adicionar file storage (S3/MinIO)

3. **Longo Prazo:**
   - Microservices se necessário
   - Event-driven architecture
   - GraphQL API (opcional)

---

Esta arquitetura é **escalável**, **manutenível** e **moderna**, seguindo as melhores práticas da indústria. Está preparada para crescer conforme as necessidades do projeto.

