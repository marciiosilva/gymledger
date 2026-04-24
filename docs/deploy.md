# Deploy GymLedger

## O que foi criado

| Arquivo | Função |
|---|---|
| `vercel.json` | SPA routing — redireciona qualquer rota para `index.html` |
| `backend/ecosystem.config.js` | Config do PM2 na VPS (nome, autorestart, env de produção) |
| `.github/workflows/ci.yml` | Roda testes do frontend e backend em todo PR e push em `main` |
| `.github/workflows/deploy-backend.yml` | Testes → SSH → git pull → build → PM2 restart ao fazer push em `main` |
| `docs/deploy.md` | Este arquivo — guia completo de setup |

## Checklist de setup inicial (one-time)

### Vercel (frontend)
- [ ] Conectar repo no [vercel.com](https://vercel.com) → Import Repository
- [ ] Adicionar variável `VITE_API_URL=https://api.seu-dominio.com/api`
- [ ] Confirmar que o build passa e a URL está acessível

### VPS (backend)
- [ ] Instalar Node.js 20 e PM2 na VPS
- [ ] Clonar o repo e preencher `backend/.env` com os valores de produção
- [ ] Rodar o primeiro deploy manual (ver seção abaixo)
- [ ] Configurar NGINX como proxy reverso (opcional mas recomendado)
- [ ] Configurar HTTPS com Let's Encrypt (opcional mas recomendado)

### GitHub Secrets
- [ ] `VPS_HOST` — IP ou hostname da VPS
- [ ] `VPS_USER` — usuário SSH (ex: `ubuntu`)
- [ ] `VPS_SSH_KEY` — conteúdo da chave privada SSH gerada para o deploy
- [ ] `VPS_APP_PATH` — caminho do repo na VPS (ex: `/home/ubuntu/gymledger`)

---

## Visão geral

| Camada | Plataforma | Trigger |
|---|---|---|
| Frontend (React/Vite) | Vercel | Push em `main` (automático via integração GitHub) |
| Backend (NestJS) | VPS própria + PM2 | Push em `main` via GitHub Actions + SSH |
| Banco de dados | Supabase PostgreSQL | — |
| Auth | Supabase Auth | — |

---

## Setup único — Vercel (frontend)

1. Acesse [vercel.com](https://vercel.com) → **Add New Project** → Import Git Repository
2. Selecione o repositório `gymledger`
3. Configure:
   - **Root Directory:** deixar vazio (raiz do repo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Adicione a variável de ambiente:
   - `VITE_API_URL` = `https://api.seu-dominio.com/api`
5. Clique em **Deploy**

A partir de agora, qualquer push em `main` dispara um novo deploy automaticamente.

---

## Setup único — VPS (backend)

### Pré-requisitos na VPS

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (gerenciador de processos)
npm install -g pm2

# Git (se não estiver instalado)
sudo apt-get install -y git
```

### Clonar e configurar o projeto

```bash
git clone https://github.com/SEU_USUARIO/gymledger.git
cd gymledger/backend

# Configurar variáveis de ambiente
cp .env.example .env
nano .env  # preencher com os valores reais
```

### Variáveis de ambiente obrigatórias em produção

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
PORT=3001
FRONTEND_URL=https://app.seu-dominio.com
NODE_ENV=production
```

### Primeiro deploy manual

```bash
cd gymledger/backend
npm ci
npm run build
npx prisma migrate deploy

# Iniciar com PM2
pm2 start ecosystem.config.js --env production
pm2 save

# Registrar PM2 para iniciar no boot
pm2 startup
# Copiar e executar o comando que o PM2 mostrar
```

### Verificar que está rodando

```bash
pm2 status
# Deve mostrar gymledger-api com status "online"

curl http://localhost:3001/api
# Deve retornar algo (404 é normal — rota raiz não existe)
```

---

## Setup único — GitHub Secrets

Acesse o repositório no GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Descrição | Exemplo |
|---|---|---|
| `VPS_HOST` | IP ou hostname da VPS | `123.45.67.89` |
| `VPS_USER` | Usuário SSH | `ubuntu` |
| `VPS_SSH_KEY` | Conteúdo da chave privada SSH | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_APP_PATH` | Caminho do repo na VPS | `/home/ubuntu/gymledger` |

### Gerar par de chaves SSH para o deploy

```bash
# Na sua máquina local
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/gymledger_deploy

# Copiar a chave pública para a VPS
ssh-copy-id -i ~/.ssh/gymledger_deploy.pub usuario@ip-da-vps

# O conteúdo de ~/.ssh/gymledger_deploy (chave PRIVADA) vai para o secret VPS_SSH_KEY
cat ~/.ssh/gymledger_deploy
```

---

## Como o deploy automático funciona

```
Push em main com mudanças em backend/**
  │
  ├── GitHub Actions: deploy-backend.yml
  │     1. Roda npm run test:cov (falha o deploy se testes quebrarem)
  │     2. SSH na VPS
  │     3. git pull origin main
  │     4. npm ci --omit=dev
  │     5. npm run build
  │     6. npx prisma migrate deploy
  │     7. pm2 restart gymledger-api --update-env
  │
  └── Vercel (automático)
        Detecta mudanças em src/
        Executa npm run build → deploy
```

---

## Comandos úteis na VPS

```bash
# Ver status do processo
pm2 status

# Ver logs em tempo real
pm2 logs gymledger-api

# Reiniciar manualmente
pm2 restart gymledger-api

# Ver uso de memória/CPU
pm2 monit

# Rodar migração manualmente
cd ~/gymledger/backend && npx prisma migrate deploy
```

---

## Configurar NGINX (proxy reverso) — recomendado

Se quiser expor o backend em uma URL amigável (`api.seu-dominio.com`) em vez de `ip:3001`:

```nginx
server {
    listen 80;
    server_name api.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/gymledger
# Colar a config acima

sudo ln -s /etc/nginx/sites-available/gymledger /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Para HTTPS gratuito via Let's Encrypt:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.seu-dominio.com
```
