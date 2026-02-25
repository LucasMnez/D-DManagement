# D&D Management (esqueleto inicial)

Projeto inicial para vender e gerenciar mesas de D&D com:
- login de usuários;
- checkout Pix (estrutura de integração);
- painel do jogador;
- painel admin financeiro;
- execução em Docker para futura subida em VPS Linux (ex.: Hostinger).

## Stack
- Next.js 14 (App Router)
- NextAuth (credenciais, pronto para expandir)
- Prisma + PostgreSQL
- Docker + Docker Compose

## Como rodar localmente com Docker
1. Copie as variáveis:
   ```bash
   cp .env.example .env
   ```
2. Suba os containers:
   ```bash
   docker compose up --build
   ```
3. Acesse:
   - App: http://localhost:3000
   - Healthcheck: http://localhost:3000/api/health

## Endpoints iniciais
- `GET /api/health`
- `POST /api/checkout/pix`
- `POST /api/webhooks/pix`
- `GET/POST /api/auth/[...nextauth]`

## Próximos passos recomendados
1. Implementar cadastro real e hash de senha com bcrypt.
2. Conectar Prisma ao banco e gerar migrations.
3. Integrar gateway Pix real (Mercado Pago, Asaas etc.) + validação de webhook.
4. Proteger rotas por perfil (PLAYER/ADMIN).
5. Adicionar logs financeiros e exportação CSV no admin.

## Deploy em VPS Linux da Hostinger (visão geral)
1. Instalar Docker e Docker Compose na VPS.
2. Clonar este repositório na máquina.
3. Configurar `.env` com domínio e segredos fortes.
4. Rodar `docker compose up -d --build`.
5. Configurar proxy reverso (Nginx/Caddy) + TLS (Let's Encrypt).

