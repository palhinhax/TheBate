# Guia de Deploy - Configuração do Banco de Dados

## Problema Atual

Está a usar `db.prisma.io` que é apenas para demonstração e não funciona em produção.

## Solução: Configurar Banco de Dados Real

### 1. Escolha um Provedor de Banco de Dados

#### Opção A: Neon (Recomendado)

- **Grátis:** 0.5GB storage, conexões ilimitadas
- **URL:** https://neon.tech
- **Passos:**
  1. Criar conta
  2. Criar novo projeto
  3. Copiar `DATABASE_URL` (Connection String)

#### Opção B: Supabase

- **Grátis:** 500MB storage
- **URL:** https://supabase.com
- **Passos:**
  1. Criar conta
  2. Criar projeto
  3. Ir em Settings → Database → Connection String
  4. Selecionar "Postgres" (não Supabase URL)
  5. Copiar connection string

#### Opção C: Railway

- **Grátis:** $5 de crédito mensal
- **URL:** https://railway.app
- **Passos:**
  1. Criar conta com GitHub
  2. New Project → PostgreSQL
  3. Copiar `DATABASE_URL` das variáveis

### 2. Configurar no Vercel (ou sua plataforma)

#### Se estiver usando Vercel:

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login
vercel login

# Adicionar variável de ambiente
vercel env add DATABASE_URL production
# Cole a connection string do seu banco quando solicitado

# Adicionar para preview/development também (opcional)
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Fazer redeploy
vercel --prod
```

#### Via Dashboard Vercel:

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto "TheBate"
3. Settings → Environment Variables
4. Adicione:
   - **Name:** `DATABASE_URL`
   - **Value:** (sua connection string)
   - **Environment:** Production (e Preview se quiser)
5. Save
6. Deployments → Redeploy latest

### 3. Executar Migrations no Novo Banco

Após configurar a variável de ambiente:

```bash
# Localmente, apontando para o novo banco
# (temporariamente mude seu .env para testar)
npx prisma migrate deploy

# Ou via Vercel CLI
vercel env pull .env.production.local
DATABASE_URL="..." npx prisma migrate deploy
```

### 4. Popular o Banco (Opcional)

Se quiser os mesmos dados de exemplo:

```bash
# Localmente com a nova connection string
DATABASE_URL="sua_nova_url" npx prisma db seed
```

## Exemplo de Connection Strings

### Neon

```
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Supabase

```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Railway

```
postgresql://postgres:password@xxx.railway.app:5432/railway
```

## Verificação

Depois de configurar, teste localmente:

```bash
# Teste a conexão
DATABASE_URL="sua_nova_url" npx prisma db push

# Se funcionar, está correto!
```

## Problemas Comuns

### Erro: SSL required

Adicione `?sslmode=require` no final da URL:

```
postgresql://...?sslmode=require
```

### Erro: Connection timeout

- Verifique se o IP da Vercel está na whitelist (se aplicável)
- Alguns provedores requerem habilitar "Connection Pooling"

### Erro: Too many connections

Use connection pooling:

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # URL direta para migrations
```

E no schema.prisma:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Próximos Passos

1. ✅ Escolher provedor de banco
2. ✅ Criar banco de dados
3. ✅ Copiar connection string
4. ✅ Adicionar no Vercel (Environment Variables)
5. ✅ Executar migrations
6. ✅ Redeploy
7. ✅ Testar em produção

## Recursos Adicionais

- [Neon Docs](https://neon.tech/docs/introduction)
- [Supabase Docs](https://supabase.com/docs/guides/database)
- [Railway Docs](https://docs.railway.app/databases/postgresql)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
