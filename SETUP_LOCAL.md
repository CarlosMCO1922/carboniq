# 🚀 Guia de Setup Local - Carboniq

Este guia explica como colocar a aplicação Carboniq a correr no seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ e **pnpm** 10+
- **Docker** e **Docker Compose** (para PostgreSQL e Redis)
- **Python** 3.11+ (opcional, para o serviço de cálculos)

### Verificar instalações

```bash
node --version    # Deve ser 18+
pnpm --version    # Deve ser 10+
docker --version  # Docker instalado
docker compose version  # Docker Compose instalado
```

---

## 🔧 Passo 1: Instalar Dependências

No diretório raiz do projeto:

```bash
# Instalar todas as dependências do monorepo
pnpm install
```

Isto irá instalar dependências para:
- `apps/web` (Next.js)
- `apps/api` (NestJS)
- `packages/shared` (TypeScript types)

---

## 🐳 Passo 2: Iniciar Infraestrutura (PostgreSQL + Redis)

Abra um terminal e execute:

```bash
# Iniciar PostgreSQL e Redis em background
docker compose -f infra/docker-compose.yml up -d
```

Isto irá iniciar:
- **PostgreSQL** na porta `5433` (mapeada de 5432)
- **Redis** na porta `6379`

### Verificar se estão a correr:

```bash
docker compose -f infra/docker-compose.yml ps
```

Deve ver ambos os serviços como "Up".

---

## 🗄️ Passo 3: Configurar Base de Dados

### 3.1. Criar ficheiro de ambiente para a API

Crie o ficheiro `apps/api/.env`:

```bash
cd apps/api
cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/carboniq?schema=public"
PORT=3000
EOF
cd ../..
```

### 3.2. Executar Migrations

```bash
cd apps/api
pnpm prisma:migrate
cd ../..
```

### 3.3. Popular Base de Dados (Seed)

```bash
cd apps/api
pnpm prisma db seed
cd ../..
```

Isto irá criar:
- Um utilizador demo (`demo@carboniq.local`)
- Centenas de fatores de emissão (PT/EU/UK)

---

## 🌐 Passo 4: Configurar Frontend

### 4.1. Criar ficheiro de ambiente

Crie o ficheiro `apps/web/.env.local`:

```bash
cd apps/web
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF
cd ../..
```

---

## 🚀 Passo 5: Iniciar Serviços

Agora precisa de **3 terminais** abertos:

### Terminal 1: API (Backend)

```bash
pnpm dev:api
```

A API estará disponível em: **http://localhost:3000**

### Terminal 2: Web (Frontend)

```bash
PORT=3001 pnpm dev:web
```

O frontend estará disponível em: **http://localhost:3001**

### Terminal 3: Calculation Service (Opcional)

Se quiser usar o serviço de cálculos Python:

```bash
# Instalar dependências Python (se necessário)
cd services/calc
pip install -r requirements.txt  # ou pip install fastapi uvicorn
cd ../..

# Iniciar serviço
pnpm dev:calc
```

O serviço de cálculos estará em: **http://localhost:8001**

---

## ✅ Verificar se está tudo a funcionar

### 1. Verificar API

Abra no browser: **http://localhost:3000/health**

Deve ver: `{"status":"ok"}`

### 2. Verificar Frontend

Abra no browser: **http://localhost:3001**

Deve ver a página inicial do Carboniq com o novo design!

### 3. Verificar Base de Dados

```bash
cd apps/api
pnpm prisma:studio
```

Isto abre o Prisma Studio onde pode ver os dados na base de dados.

---

## 🎯 Testar a Aplicação

### 1. Criar um Projeto

1. Vá a **http://localhost:3001**
2. Clique em "🚀 Começar Agora"
3. Preencha o formulário de onboarding:
   - Tipo: B2B ou B2C
   - Nome da organização
   - Nome do projeto
   - Região: PT, EU ou UK
4. Clique em "Criar"

### 2. Adicionar uma Atividade

1. Na página do projeto, clique em "➕ Nova atividade"
2. Preencha:
   - Tipo: `electricity`
   - Quantidade: `100`
   - Unidade: `kWh`
3. Guarde

### 3. Calcular Emissões

1. Na tabela de atividades, clique em "🧮 Calcular"
2. Veja os resultados nos gráficos e métricas!

---

## 🛠️ Comandos Úteis

### Parar tudo

```bash
# Parar Docker
docker compose -f infra/docker-compose.yml down

# Parar processos (Ctrl+C nos terminais)
```

### Resetar Base de Dados

```bash
cd apps/api
pnpm prisma:migrate reset  # ⚠️ Apaga todos os dados!
pnpm prisma db seed        # Recria dados de exemplo
cd ../..
```

### Ver Logs do Docker

```bash
docker compose -f infra/docker-compose.yml logs -f
```

### Limpar e Reinstalar

```bash
# Limpar node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/.next apps/*/dist

# Reinstalar
pnpm install

# Reconstruir
pnpm build
```

---

## 🐛 Resolução de Problemas

### Erro: "Cannot connect to database"

1. Verifique se o Docker está a correr:
   ```bash
   docker compose -f infra/docker-compose.yml ps
   ```

2. Verifique a `DATABASE_URL` no `apps/api/.env`

3. Tente reiniciar o Docker:
   ```bash
   docker compose -f infra/docker-compose.yml restart
   ```

### Erro: "Port already in use"

- **Porta 3000**: A API está a usar. Pare outros processos ou mude a porta.
- **Porta 3001**: O frontend está a usar. Pare outros processos ou mude a porta.
- **Porta 5433**: PostgreSQL está a usar. Pare outros processos ou mude no docker-compose.yml.

### Erro: "Module not found"

Execute:
```bash
pnpm install
```

### Erro: "Prisma Client not generated"

```bash
cd apps/api
pnpm prisma:generate
cd ../..
```

---

## 📝 Variáveis de Ambiente

### API (`apps/api/.env`)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/carboniq?schema=public"
PORT=3000
CALC_URL=http://localhost:8001  # Opcional, para cálculo service
```

### Web (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🎨 Estrutura de Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend (Next.js) | 3001 | http://localhost:3001 |
| API (NestJS) | 3000 | http://localhost:3000 |
| PostgreSQL | 5433 | localhost:5433 |
| Redis | 6379 | localhost:6379 |
| Calculation Service | 8001 | http://localhost:8001 |

---

## 🚀 Quick Start (Resumo)

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar Docker
docker compose -f infra/docker-compose.yml up -d

# 3. Configurar DB
cd apps/api
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5433/carboniq?schema=public"' > .env
pnpm prisma:migrate
pnpm prisma db seed
cd ../..

# 4. Configurar Web
cd apps/web
echo 'NEXT_PUBLIC_API_URL=http://localhost:3000' > .env.local
cd ../..

# 5. Iniciar (em terminais separados)
pnpm dev:api          # Terminal 1
PORT=3001 pnpm dev:web  # Terminal 2
```

Agora abra **http://localhost:3001** no browser! 🎉

---

## 📚 Próximos Passos

Depois de ter tudo a correr:

1. Explore a nova interface melhorada
2. Teste os gráficos interativos
3. Crie projetos e atividades
4. Veja as visualizações de emissões

Boa sorte! 🚀

