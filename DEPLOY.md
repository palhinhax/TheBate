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

Quando houver mudanças no schema do banco de dados, é necessário executar as migrações:

### Opção 1: Usando Prisma Migrate (Recomendado)

```bash
# Para produção, usa migrate deploy (não é interativo)
npx prisma migrate deploy
```

Este comando aplica todas as migrações pendentes ao banco de dados de produção.

### Opção 2: Via Vercel Build (Automático)

O build script já inclui `prisma generate`, mas se precisares aplicar migrações manualmente:

1. Vai ao dashboard do Vercel
2. Settings → General → Build & Development Settings
3. Build Command: `prisma generate && prisma migrate deploy && next build`

> **Nota:** A migração `20260108140000_add_score_to_comment` foi criada para adicionar a coluna `score` à tabela `Comment` de forma segura, verificando primeiro se ela já existe.

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
