# 🚀 Guia de Deploy e Configuração de Variáveis

## 📋 Variáveis de Ambiente para Produção

Adiciona estas variáveis no teu serviço de hosting (Vercel, Netlify, etc.):

### Vercel

1. Vai ao dashboard do projeto
2. Settings → Environment Variables
3. Adiciona:

```bash
# Database
DATABASE_URL="postgres://..."

# Auth.js
AUTH_SECRET="klU-THXlZeZPrJiV_OzvJv-kA3hzS6dNJ-wQRfVzCJc="
NEXTAUTH_URL="https://thebatee.com"

# Site URL (IMPORTANTE para sitemap!)
NEXT_PUBLIC_SITE_URL="https://thebatee.com"

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-9458046359698653"

# Application
NODE_ENV="production"
```

## 🗄️ Database Migrations

### Automatic Migrations (Production)

✅ **Migrations now run automatically via GitHub Actions!**

**How it works:**

1. **On every push to `main`** with schema/migration changes:
   - GitHub Actions workflow detects changes
   - Runs `prisma migrate deploy` with retry logic
   - Reports success/failure
   - **Migrations run before Vercel deployment** (not during build)

**Benefits:**
- ✅ Database updated before new code is deployed
- ✅ No concurrent migration conflicts
- ✅ Clear error reporting
- ✅ Prevents broken deployments

### Manual Migration (If Needed)

If you need to run migrations manually:

#### Option 1: GitHub Actions Workflow

1. Go to **Actions** > **Database Update & Seed**
2. Click **Run workflow**
3. Select `none` for seed type if you only want to run migrations

#### Option 2: Using Prisma CLI

```bash
# For production, use migrate deploy (non-interactive)
npx prisma migrate deploy
```

This command applies all pending migrations to the production database.

### Development Migrations

For local development:

## 🔄 Como Fazer Redeploy

### Opção 1: Via Git (Recomendado)

```bash
git add .
git commit -m "fix: update sitemap URLs to production domain"
git push origin main
```

O Vercel/Netlify vai fazer deploy automático.

### Opção 2: Via Vercel CLI

```bash
vercel --prod
```

### Opção 3: Via Dashboard

1. Vai ao dashboard do Vercel
2. Clica em "Deployments"
3. No último deployment, clica nos 3 pontos → "Redeploy"

## ✅ Verificar se Funcionou

Depois do deploy, acede a:

- https://thebatee.com/sitemap.xml
- https://thebatee.com/robots.txt

Os URLs devem mostrar `https://thebatee.com` em vez de `localhost:3000`

## 🔍 Resubmeter ao Google

1. Vai ao Google Search Console
2. Remove o sitemap antigo (se existir)
3. Submete novamente: `https://thebatee.com/sitemap.xml`
4. Aguarda alguns minutos e clica em "Fetch"

---

## 📝 Estrutura de Variáveis

```
.env                  # Variáveis de produção (commitado ao git)
.env.local           # Variáveis de desenvolvimento (NÃO commitado)
.env.production      # Opcional: Específico para produção
```

### `.env` (produção - commitado)

```bash
NEXTAUTH_URL="https://thebatee.com"
NEXT_PUBLIC_SITE_URL="https://thebatee.com"
```

### `.env.local` (dev - NÃO commitado)

```bash
NEXTAUTH_URL="http://localhost:3000"
```

O Next.js automaticamente usa `.env.local` em desenvolvimento!
