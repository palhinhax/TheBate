# Configuração da Base de Dados - Neon PostgreSQL

## ✅ Banco Atual: Neon PostgreSQL

Este projeto usa [Neon](https://neon.tech) como base de dados PostgreSQL serverless.

## Setup Local

### 1. Copiar variáveis de ambiente

```bash
cp .env.example .env
```

### 2. Configurar DATABASE_URL

Abra o arquivo `.env` e adicione sua connection string:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### 3. Aplicar migrations

```bash
npx prisma migrate deploy
```

### 4. Popular com dados (opcional)

```bash
npx prisma db seed
```

## Criar Novo Banco Neon (Se Necessário)

### Passo 1: Criar Conta

1. Acesse https://neon.tech
2. Faça login com GitHub
3. Crie um novo projeto

### Passo 2: Copiar Connection String

1. No dashboard do projeto
2. Copie a **Connection String** (com pooler)
3. Formato: `postgresql://user:pass@host/db?sslmode=require`

### Passo 3: Configurar no Projeto

**Local (.env):**

```env
DATABASE_URL="sua_connection_string_aqui"
```

**Vercel (Production):**

1. Projeto → Settings → Environment Variables
2. Adicione `DATABASE_URL` = sua connection string
3. Selecione "Production" e "Preview"
4. Save
5. Redeploy

## Migrations

### Criar nova migration

```bash
npx prisma migrate dev --name nome_da_migration
```

### Aplicar migrations em produção

```bash
npx prisma migrate deploy
```

### Resetar banco (CUIDADO - apaga tudo)

```bash
npx prisma migrate reset
```

## Seeds

### Popular banco com dados de exemplo

```bash
npx prisma db seed
```

Isso cria:

- 7 usuários (incluindo admin e moderadores)
- 10 tópicos de exemplo
- 90 comentários e respostas
- Votos de exemplo

### Credenciais padrão após seed:

- **Admin:** admin@thebate.com / password123
- **Mod:** mod@thebate.com / password123
- **Users:** maria@example.com / password123

## Tornar Usuário Owner

```bash
npx tsx scripts/make-owner.ts email@exemplo.com
```

Exemplo:

```bash
npx tsx scripts/make-owner.ts joao.mduart@gmail.com
```

## Prisma Studio (GUI do Banco)

```bash
npx prisma studio
```

Abre interface visual em: http://localhost:5555

## Troubleshooting

### Erro: Can't reach database server

**Solução:** Verifique se o DATABASE_URL está correto no .env

### Erro: SSL connection required

**Solução:** Adicione `?sslmode=require` no final da URL:

```
postgresql://...?sslmode=require
```

### Erro: Schema out of sync

**Solução:** Execute:

```bash
npx prisma generate
npx prisma db push
```

### Erro: Too many connections

**Solução:** Use connection pooling. No Neon, sempre use a URL com `-pooler`:

```
ep-xxx-pooler.region.aws.neon.tech
```

## Vercel Deployment

### Variáveis necessárias:

```env
DATABASE_URL=postgresql://...  # Connection string do Neon
AUTH_SECRET=...                # Gerado com: openssl rand -base64 32
NEXTAUTH_URL=https://...       # URL do seu site
NEXT_PUBLIC_SITE_URL=https://... # Mesma URL
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-... # (opcional)
```

### Deploy workflow:

1. **Push para GitHub**

   ```bash
   git add .
   git commit -m "feat: ..."
   git push
   ```

2. **Vercel auto-deploy**
   - Detecta push
   - Executa build
   - Deploy automático

3. **Primeira vez: Execute migrations**
   ```bash
   # Via Vercel CLI
   vercel env pull
   npx prisma migrate deploy
   ```

## Backup e Restauração

### Backup

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore

```bash
psql $DATABASE_URL < backup.sql
```

## Recursos

- [Neon Docs](https://neon.tech/docs/introduction)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js + Prisma](https://www.prisma.io/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Alternativas ao Neon

Se preferir outro provedor:

### Supabase

- Free tier: 500MB
- URL: https://supabase.com
- Similar ao Neon

### Railway

- $5 crédito/mês
- URL: https://railway.app
- PostgreSQL standalone

### PlanetScale

- MySQL (requer mudança no schema)
- URL: https://planetscale.com

### Configurar alternativa:

1. Criar banco no provedor escolhido
2. Copiar connection string
3. Atualizar DATABASE_URL
4. Executar `npx prisma migrate deploy`
