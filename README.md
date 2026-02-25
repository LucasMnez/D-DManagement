# D&D Management

Aplicação Next.js para gestão de mesas de D&D com:
- cadastro/login real com hash de senha (bcrypt);
- checkout Pix (mock ou Mercado Pago) e webhook com validação de assinatura;
- painel de jogador;
- painel admin protegido por perfil;
- logs financeiros e exportação CSV;
- execução em Docker para deploy em VPS Linux (Hostinger).

## Stack
- Next.js 14 (App Router)
- NextAuth (Credentials + JWT)
- Prisma + PostgreSQL
- Docker + Docker Compose

## Configuração local (Docker)
1. Copie variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Suba banco + app:
   ```bash
   docker compose up --build
   ```
3. Rode migrations dentro do container app:
   ```bash
   docker compose exec app npx prisma migrate deploy
   ```
4. Acesse:
   - App: http://localhost:3000
   - Healthcheck: http://localhost:3000/api/health

## Configuração local (sem Docker)
```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run dev
```

## Variáveis de ambiente
- `PIX_PROVIDER=mock` para ambiente de desenvolvimento.
- Para Mercado Pago, use:
  - `PIX_PROVIDER=mercadopago`
  - `MERCADO_PAGO_ACCESS_TOKEN=<token>`

## Endpoints
- `POST /api/auth/register` cadastro de jogador.
- `GET/POST /api/auth/[...nextauth]` autenticação.
- `POST /api/checkout/pix` geração de cobrança Pix (rota protegida).
- `POST /api/webhooks/pix` webhook Pix com header `x-pix-signature`.
- `GET /api/admin/financeiro/logs` logs financeiros (admin).
- `GET /api/admin/financeiro/export` exportação CSV (admin).

## Segurança aplicada
- Hash de senha com bcrypt.
- Proteção de rotas por papel (PLAYER/ADMIN) via middleware.
- Validação de assinatura HMAC SHA-256 no webhook Pix.

## Deploy em VPS Linux (Hostinger)
1. Instalar Docker + Docker Compose.
2. Clonar repo e preencher `.env`.
3. Executar:
   ```bash
   docker compose up -d --build
   docker compose exec app npx prisma migrate deploy
   ```
4. Configurar proxy reverso (Nginx/Caddy) + TLS (Let's Encrypt).
