# 🏗️ Arquitetura Carboniq - Visão Simplificada

## 📊 Diagrama de Alto Nível

```
                    ┌─────────────────────┐
                    │   USUÁRIO FINAL      │
                    │   (Browser)         │
                    └──────────┬──────────┘
                               │
                               │ HTTPS
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │   FRONTEND          │
                    │   Next.js 16        │
                    │   React 19           │
                    │   Tailwind CSS       │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ HTTP/REST
                               │ JSON
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │   BACKEND API       │
                    │   NestJS 11         │
                    │   TypeScript        │
                    │                     │
                    └─────┬───────────┬───┘
                          │           │
            ┌─────────────┘           └─────────────┐
            │                                       │
            │                                       │
    ┌───────▼────────┐                    ┌───────▼────────┐
    │                │                    │                │
    │  PostgreSQL    │                    │  Calculation   │
    │  (via Prisma)  │                    │  Service       │
    │                │                    │  Python/FastAPI│
    │  • Users       │                    │                │
    │  • Projects    │                    │  • Complex     │
    │  • Activities  │                    │    calculations│
    │  • Factors     │                    │                │
    │  • Calculations│                    │                │
    │                │                    │                │
    └────────────────┘                    └────────────────┘
            │
            │
    ┌───────▼────────┐
    │                │
    │     Redis      │
    │                │
    │  • Cache       │
    │  • Sessions    │
    │                │
    └────────────────┘
```

## 🔑 Componentes Principais

### 1. **Frontend (apps/web)**
- **Tecnologia:** Next.js 16 + React 19
- **Função:** Interface do utilizador
- **Responsabilidades:**
  - Renderizar páginas e componentes
  - Gerir estado da UI
  - Fazer requests à API
  - Visualizar dados (gráficos)

### 2. **Backend API (apps/api)**
- **Tecnologia:** NestJS 11 + TypeScript
- **Função:** Lógica de negócio e API REST
- **Responsabilidades:**
  - CRUD de entidades (users, projects, activities)
  - Cálculos simples (multiplicação direta)
  - Agregações e sumários
  - Gestão de fatores de emissão
  - Validação e autorização

### 3. **Calculation Service (services/calc)**
- **Tecnologia:** Python + FastAPI
- **Função:** Cálculos complexos
- **Responsabilidades:**
  - Cálculos que requerem lógica complexa
  - Validações avançadas
  - Processamento de grandes volumes
  - (Futuro) Machine learning para previsões

### 4. **PostgreSQL**
- **Função:** Base de dados principal
- **Dados:**
  - Tudo que precisa persistir
  - Relações entre entidades
  - Histórico de cálculos

### 5. **Redis**
- **Função:** Cache e sessões
- **Dados:**
  - Fatores de emissão (cache)
  - Sumários calculados (cache)
  - Sessões de utilizador (futuro)

## 🔄 Fluxos Principais

### Fluxo 1: Criar Atividade e Calcular

```
1. Utilizador preenche formulário no Frontend
2. Frontend → API: POST /activities
3. API → PostgreSQL: INSERT activity
4. Utilizador clica "Calcular"
5. Frontend → API: POST /calculations
6. API verifica se tem fator:
   - Se SIM: Calcula localmente (amount × factor.co2ePerUnit)
   - Se NÃO: API → Calculation Service: POST /calculate
7. API → PostgreSQL: INSERT calculation
8. Frontend atualiza UI com resultado
```

### Fluxo 2: Ver Dashboard

```
1. Utilizador abre projeto
2. Frontend → API: GET /projects/:id/summary
3. API verifica Redis cache:
   - Se existe: retorna cache
   - Se não: calcula sumário
4. API → PostgreSQL: SELECT + GROUP BY calculations
5. API → Redis: Guarda resultado (TTL 5min)
6. API → Frontend: JSON com totais
7. Frontend renderiza gráficos e cards
```

### Fluxo 3: Importar CSV (Spend-based)

```
1. Utilizador faz upload de CSV
2. Frontend → API: POST /spend/import.csv
3. API processa CSV e cria Expenses
4. API → PostgreSQL: INSERT expenses
5. Utilizador configura mapeamentos
6. Frontend → API: POST /spend/mappings
7. Utilizador clica "Calcular"
8. API → Calculation Service: POST /spend/compute
9. Calculation Service calcula baseado em EUR → CO2e
10. API → PostgreSQL: INSERT calculations
```

## 🛠️ Tecnologias por Camada

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|-----------|
| **Frontend** | Next.js | 16 | Framework React |
| | React | 19 | UI Library |
| | TypeScript | 5 | Type Safety |
| | Tailwind CSS | 4 | Styling |
| | next-intl | 4 | i18n |
| **Backend** | NestJS | 11 | API Framework |
| | Prisma | 6 | ORM |
| | Express | (built-in) | HTTP Server |
| **Calculation** | FastAPI | Latest | Python API |
| | Python | 3.11+ | Runtime |
| **Database** | PostgreSQL | 16 | RDBMS |
| **Cache** | Redis | 7 | Cache/Sessions |
| **Monorepo** | Turborepo | 2 | Build System |
| **Package** | pnpm | 10 | Package Manager |

## 📦 Estrutura de Comunicação

### Frontend ↔ Backend
- **Protocolo:** HTTP/REST
- **Formato:** JSON
- **Autenticação:** (Futuro) JWT Bearer Token
- **CORS:** Configurado para localhost em dev

### Backend ↔ Calculation Service
- **Protocolo:** HTTP/REST
- **Formato:** JSON
- **Localização:** Mesma rede (localhost:8001 em dev)

### Backend ↔ PostgreSQL
- **Protocolo:** Prisma Client (TCP/IP)
- **Connection Pool:** Automático pelo Prisma
- **Migrations:** Prisma Migrate

### Backend ↔ Redis
- **Protocolo:** Redis Protocol (TCP)
- **Cliente:** ioredis ou @nestjs/cache-manager
- **Uso:** Cache de fatores e sumários

## 🎯 Decisões de Arquitetura

### Porquê Monorepo?
- ✅ Código compartilhado (types)
- ✅ Desenvolvimento sincronizado
- ✅ Build otimizado (Turborepo)
- ✅ Versionamento único

### Porquê Next.js?
- ✅ SSR/SSG para performance
- ✅ App Router moderno
- ✅ Server Components
- ✅ Excelente DX

### Porquê NestJS?
- ✅ Arquitetura modular
- ✅ TypeScript nativo
- ✅ DI container
- ✅ Ecossistema maduro

### Porquê Prisma?
- ✅ Type-safe queries
- ✅ Migrations automáticas
- ✅ Excelente DX
- ✅ Suporte PostgreSQL

### Porquê Calculation Service separado?
- ✅ Cálculos complexos em Python (NumPy/Pandas)
- ✅ Escalabilidade independente
- ✅ Facilita ML futuro
- ✅ Isolamento de lógica complexa

### Porquê Redis?
- ✅ Cache rápido de fatores
- ✅ Reduz carga no PostgreSQL
- ✅ Preparado para sessões
- ✅ Suporta queues (futuro)

## 🚀 Escalabilidade Futura

### Horizontal Scaling
```
                    ┌─────────┐
                    │  Load   │
                    │ Balancer│
                    └────┬────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
      ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐
      │  API #1   │ │ API #2  │ │ API #3  │
      └───────────┘ └─────────┘ └─────────┘
            │            │            │
            └────────────┼────────────┘
                         │
                  ┌──────▼──────┐
                  │ PostgreSQL  │
                  │  (Primary)  │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │  Read       │
                  │  Replicas   │
                  └─────────────┘
```

### Microservices (se necessário)
- **Auth Service** - Autenticação isolada
- **Notification Service** - Emails/notificações
- **Report Service** - Geração de PDFs
- **Analytics Service** - Métricas e insights

## 📝 Resumo

**Arquitetura:** Monolito modular com serviços auxiliares

**Padrão:** REST API + Server-Side Rendering

**Escalabilidade:** Preparado para horizontal scaling

**Manutenibilidade:** Alta (TypeScript, modular, testável)

**Performance:** Otimizado (cache, SSR, connection pooling)

Esta arquitetura equilibra **simplicidade** com **preparação para crescimento**, seguindo as melhores práticas modernas.

