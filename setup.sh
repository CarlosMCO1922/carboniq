#!/bin/bash

# Script de Setup Automático - Carboniq
# Este script configura o ambiente local automaticamente

set -e  # Parar em caso de erro

echo "🚀 Carboniq - Setup Local"
echo "=========================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar pré-requisitos
echo -e "${BLUE}📋 Verificando pré-requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js não encontrado. Por favor instale Node.js 18+${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}❌ pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não encontrado. A base de dados precisa do Docker.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pré-requisitos OK${NC}"
echo ""

# 2. Instalar dependências
echo -e "${BLUE}📦 Instalando dependências...${NC}"
pnpm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

# 3. Iniciar Docker
echo -e "${BLUE}🐳 Iniciando PostgreSQL e Redis...${NC}"
docker compose -f infra/docker-compose.yml up -d
sleep 3  # Aguardar serviços iniciarem
echo -e "${GREEN}✅ Docker services iniciados${NC}"
echo ""

# 4. Configurar API
echo -e "${BLUE}⚙️  Configurando API...${NC}"
cd apps/api

if [ ! -f .env ]; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5433/carboniq?schema=public"' > .env
    echo 'PORT=3000' >> .env
    echo -e "${GREEN}✅ Ficheiro .env criado${NC}"
else
    echo -e "${YELLOW}⚠️  Ficheiro .env já existe${NC}"
fi

# Gerar Prisma Client
echo "Gerando Prisma Client..."
pnpm prisma:generate

# Executar migrations
echo "Executando migrations..."
pnpm prisma:migrate deploy || pnpm prisma:migrate

# Seed database
echo "Populando base de dados..."
pnpm prisma db seed || echo -e "${YELLOW}⚠️  Seed pode ter falhado, mas pode continuar${NC}"

cd ../..
echo -e "${GREEN}✅ API configurada${NC}"
echo ""

# 5. Configurar Web
echo -e "${BLUE}🌐 Configurando Frontend...${NC}"
cd apps/web

if [ ! -f .env.local ]; then
    echo 'NEXT_PUBLIC_API_URL=http://localhost:3000' > .env.local
    echo -e "${GREEN}✅ Ficheiro .env.local criado${NC}"
else
    echo -e "${YELLOW}⚠️  Ficheiro .env.local já existe${NC}"
fi

cd ../..
echo -e "${GREEN}✅ Frontend configurado${NC}"
echo ""

# 6. Resumo
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup completo!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Para iniciar a aplicação, execute em terminais separados:"
echo ""
echo -e "${BLUE}Terminal 1 (API):${NC}"
echo "  pnpm dev:api"
echo ""
echo -e "${BLUE}Terminal 2 (Web):${NC}"
echo "  PORT=3001 pnpm dev:web"
echo ""
echo "Depois abra: ${GREEN}http://localhost:3001${NC}"
echo ""
echo "Para parar os serviços Docker:"
echo "  docker compose -f infra/docker-compose.yml down"
echo ""

