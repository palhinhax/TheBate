# Thebatee

Uma plataforma pública de discussões construída com Next.js 14, PostgreSQL e Prisma, focada em SEO e conversas de qualidade.

## 🚀 Funcionalidades

### Temas e Discussões

- **Criação de Temas**: Utilizadores autenticados podem criar novos temas de discussão
- **Páginas Públicas**: Todos os temas são indexáveis pelos motores de busca
- **Tags**: Cada tema pode ter até 5 tags para categorização
- **Status**: Temas podem estar ativos, ocultos ou bloqueados (moderação)

### Comentários e Discussões

- **Comentários em Thread**: Sistema de comentários com respostas (nested)
- **Sistema de Votos**: Upvote/Downvote para comentários
- **Ordenação**: Comentários podem ser ordenados por Top (mais votados) ou New (mais recentes)
- **Edição e Moderação**: Autores podem editar, moderadores podem ocultar/eliminar

### Autenticação e Permissões

- **Leitura Pública**: Qualquer pessoa pode ler temas e comentários sem login
- **Interação Autenticada**: Login obrigatório para criar temas, comentar e votar
- **Sistema de Roles**:
  - `USER`: Utilizador padrão
  - `MOD`: Moderador com poderes de moderação
  - `ADMIN`: Administrador com acesso total
- **Password Reset**: Sistema de recuperação de senha com magic link
  - Tokens únicos com expiração de 15 minutos
  - Rate limiting (IP e email)
  - Sem exposição de emails existentes
  - Ver [PASSWORD_RESET.md](./PASSWORD_RESET.md) para detalhes

### SEO e Performance

- **Server-Side Rendering**: Conteúdo renderizado no servidor para melhor SEO
- **Metadata Dinâmica**: Open Graph, Twitter Cards e canonical URLs
- **JSON-LD**: Structured data para motores de busca
- **Sitemap.xml**: Gerado automaticamente com todos os temas ativos
- **Robots.txt**: Configurado para indexação apropriada

## 📁 Estrutura do Projeto

```
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Autenticação
│   │   ├── topics/          # Temas CRUD
│   │   └── comments/        # Comentários CRUD
│   ├── auth/                # Páginas de login/registro
│   ├── new/                 # Criar novo tema
│   ├── t/[slug]/            # Página de tema individual
│   ├── u/[username]/        # Perfil de utilizador
│   ├── sitemap.ts           # Sitemap dinâmico
│   └── robots.ts            # Robots.txt
├── components/              # Componentes UI (shadcn/ui)
├── features/                # Módulos de funcionalidades
│   ├── topics/              # Lógica de temas
│   └── comments/            # Lógica de comentários
├── lib/                     # Utilitários
│   ├── auth/                # Configuração Auth.js
│   ├── prisma.ts            # Cliente Prisma
│   └── slug.ts              # Geração de slugs
└── prisma/                  # Schema e migrations
    ├── schema.prisma        # Modelos do banco
    └── seed.ts              # Dados de exemplo
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) com TypeScript
- **Database**: PostgreSQL com Prisma ORM
- **Authentication**: Auth.js (NextAuth) com Credentials Provider
- **UI**: Tailwind CSS + shadcn/ui
- **Form Validation**: React Hook Form + Zod
- **Code Quality**: ESLint + Prettier + Husky

## 🏁 Getting Started

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- PostgreSQL database

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/palhinhax/TheBate.git
   cd TheBate
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   Atualize o `.env` com suas configurações:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/thebate"
   AUTH_SECRET="seu-secret-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Execute as migrations do banco:

   ```bash
   npm run db:migrate
   ```

5. (Opcional) Popule o banco com dados de exemplo:

   ```bash
   npm run db:seed
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📜 Scripts Disponíveis

| Comando              | Descrição                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Inicia servidor de desenvolvimento |
| `npm run build`      | Build para produção                |
| `npm run start`      | Inicia servidor de produção        |
| `npm run lint`       | Executa ESLint                     |
| `npm run typecheck`  | Verifica tipos TypeScript          |
| `npm run db:migrate` | Executa migrations                 |
| `npm run db:seed`    | Popula banco com dados             |
| `npm run db:studio`  | Abre Prisma Studio                 |

## 🔐 Credenciais de Teste

Após executar o seed:

- **Admin**: `admin@thebatee.com` / `password123`
- **Moderador**: `mod@thebatee.com` / `password123`
- **Utilizadores**: `maria@example.com`, `joao@example.com`, etc. / `password123`

## 📝 API Endpoints

### Temas

| Método | Endpoint             | Descrição                   | Auth |
| ------ | -------------------- | --------------------------- | ---- |
| GET    | `/api/topics`        | Lista todos os temas        | Não  |
| GET    | `/api/topics/[slug]` | Detalhes de um tema         | Não  |
| POST   | `/api/topics`        | Cria um tema                | Sim  |
| PATCH  | `/api/topics/[slug]` | Atualiza status (mod/admin) | Sim  |

### Comentários

| Método | Endpoint                      | Descrição                  | Auth |
| ------ | ----------------------------- | -------------------------- | ---- |
| GET    | `/api/topics/[slug]/comments` | Lista comentários          | Não  |
| POST   | `/api/comments`               | Cria comentário/resposta   | Sim  |
| PATCH  | `/api/comments/[id]`          | Edita ou modera comentário | Sim  |
| DELETE | `/api/comments/[id]`          | Remove comentário          | Sim  |
| POST   | `/api/comments/[id]/vote`     | Vota em comentário         | Sim  |

## 🗄️ Modelos do Banco

### User

```prisma
- id: String (cuid)
- username: String (unique)
- email: String (unique)
- name: String?
- passwordHash: String
- role: UserRole (USER, MOD, ADMIN)
- image: String?
- createdAt: DateTime
```

### Topic

```prisma
- id: String (cuid)
- slug: String (unique)
- title: String
- description: String
- tags: String[]
- status: TopicStatus (ACTIVE, HIDDEN, LOCKED)
- createdById: String
- createdAt: DateTime
- updatedAt: DateTime
```

### Comment

```prisma
- id: String (cuid)
- content: String
- score: Int
- status: CommentStatus (ACTIVE, HIDDEN, DELETED)
- topicId: String
- userId: String
- parentId: String?
- createdAt: DateTime
- updatedAt: DateTime
```

### Vote

```prisma
- id: String (cuid)
- value: Int (-1 ou +1)
- commentId: String
- userId: String
- createdAt: DateTime
- unique(userId, commentId)
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy!

### Database

Recomendado usar serviços como:

- [Neon](https://neon.tech) - PostgreSQL serverless
- [Supabase](https://supabase.com) - PostgreSQL com features adicionais
- [Railway](https://railway.app) - Deploy de apps e databases

## 🎨 Componentes UI

A plataforma utiliza shadcn/ui para componentes:

- Button, Input, Label
- Card (para listagem de temas)
- Dialog (modals)
- Toast (notificações)
- Spinner (loading states)

## 🔒 Segurança

- **Validação**: Zod schemas em todos os endpoints
- **Autenticação**: Auth.js com JWT sessions
- **Sanitização**: Validação de inputs no servidor
- **CORS**: Proteção contra requisições não autorizadas
- **Permissões**: Verificação de roles em rotas protegidas

## 📊 Performance

- **SSR**: Server-Side Rendering para SEO
- **Índices**: Indexes otimizados no Prisma
- **Paginação**: Limite de resultados em listagens
- **Caching**: Revalidation tags para ISR

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

Construído com ❤️ usando Next.js, Prisma e shadcn/ui
