# Sistema de Owner - TheBate

## Visão Geral

O sistema de Owner é uma camada adicional de controle administrativo que permite a um usuário específico (o "dono" da plataforma) ter acesso exclusivo ao painel administrativo.

## Características

### 1. Campo `isOwner` no Modelo User

- Adicionado campo booleano `isOwner` ao modelo `User` no Prisma
- Valor padrão: `false`
- Apenas um ou poucos usuários devem ter este status

### 2. Autenticação e Sessão

- O campo `isOwner` é incluído na sessão NextAuth
- Verificado em todos os endpoints administrativos
- Incluído nos tipos TypeScript para segurança de tipo

### 3. Painel Administrativo (/admin)

O painel do owner fornece:

#### Gestão de Tópicos

- Visualizar todos os tópicos do sistema
- Ver estatísticas (comentários, votos)
- Alterar status dos tópicos:
  - `ACTIVE` - Visível para todos
  - `HIDDEN` - Oculto da listagem pública
  - `LOCKED` - Não aceita novos comentários
- Deletar tópicos permanentemente

#### Gestão de Comentários

- Visualizar todos os comentários do sistema
- Ver contexto (autor, tópico, data)
- Alterar status dos comentários:
  - `ACTIVE` - Visível para todos
  - `HIDDEN` - Oculto da visualização pública
  - `DELETED` - Marcado como deletado
- Deletar comentários permanentemente

### 4. Segurança

- Todas as rotas `/api/admin/*` verificam `session.user.isOwner`
- Acesso negado (403) se o usuário não for owner
- A página `/admin` redireciona para home se o usuário não for owner
- O link do painel só aparece na navbar se o usuário for owner
- **Proteções de segurança:**
  - Owner não pode deletar a si mesmo
  - Owner não pode remover seu próprio status de owner
  - Validação de roles ao atualizar usuários

## Como Usar

### Tornar um Usuário Owner

Use o script `make-owner.ts` para conceder status de owner:

```bash
npx tsx scripts/make-owner.ts <username>
```

**Exemplo:**

```bash
npx tsx scripts/make-owner.ts joao
```

**Saída esperada:**

```
✅ Usuário 'joao' agora é OWNER
   Esse usuário tem acesso completo ao painel administrativo
```

### Verificar Status

O script informa se o usuário já é owner:

```bash
ℹ️  Usuário 'joao' já é OWNER
```

### Erros Comuns

```bash
❌ Usuário 'username' não encontrado
```

- O usuário não existe no banco de dados
- Verifique se o username está correto

## Estrutura de Arquivos

```
/workspaces/TheBate/
├── prisma/
│   └── schema.prisma                      # Modelo User com campo isOwner
├── scripts/
│   ├── make-admin.ts                      # Script para criar admins (deprecated)
│   └── make-owner.ts                      # Script para criar owners ✓
├── types/
│   └── next-auth.d.ts                     # Tipos NextAuth com isOwner
├── lib/
│   └── auth/
│       └── config.ts                      # Configuração NextAuth com isOwner
├── components/
│   └── navbar.tsx                         # Navbar com link do painel owner
└── app/
    ├── admin/
    │   └── page.tsx                       # Painel do owner
    └── api/
        └── admin/
            ├── topics/
            │   ├── route.ts               # GET /api/admin/topics
            │   └── [id]/
            │       └── route.ts           # DELETE, PATCH /api/admin/topics/:id
            └── comments/
                ├── route.ts               # GET /api/admin/comments
                └── [id]/
                    └── route.ts           # DELETE, PATCH /api/admin/comments/:id
            └── users/
                ├── route.ts               # GET /api/admin/users
                └── [id]/
                    └── route.ts           # DELETE, PATCH /api/admin/users/:id
```

## Diferença entre ADMIN e OWNER

| Característica        | ADMIN  | OWNER  |
| --------------------- | ------ | ------ |
| Acesso ao painel      | ❌ Não | ✅ Sim |
| Gerenciar tópicos     | ❌ Não | ✅ Sim |
| Gerenciar comentários | ❌ Não | ✅ Sim |
| Deletar conteúdo      | ❌ Não | ✅ Sim |
| Moderar conteúdo      | Futuro | ✅ Sim |

**Nota:** O campo `role` ainda existe mas não é mais usado para acesso ao painel. O `isOwner` é a verificação principal.

## API Endpoints

### GET /api/admin/topics

Lista todos os tópicos do sistema.

**Autenticação:** Requer `isOwner = true`

**Resposta:**

```json
[
  {
    "id": "...",
    "title": "...",
    "slug": "...",
    "status": "ACTIVE",
    "createdAt": "...",
    "createdBy": {
      "username": "...",
      "name": "..."
    },
    "_count": {
      "comments": 10,
      "topicVotes": 25
    }
  }
]
```

### DELETE /api/admin/topics/:id

Deleta um tópico permanentemente.

**Autenticação:** Requer `isOwner = true`

### PATCH /api/admin/topics/:id

Atualiza o status de um tópico.

**Autenticação:** Requer `isOwner = true`

**Body:**

```json
{
  "status": "HIDDEN" | "ACTIVE" | "LOCKED"
}
```

### GET /api/admin/comments

Lista todos os comentários do sistema.

**Autenticação:** Requer `isOwner = true`

### DELETE /api/admin/comments/:id

Deleta um comentário permanentemente.

**Autenticação:** Requer `isOwner = true`

### PATCH /api/admin/comments/:id

Atualiza o status de um comentário.

**Autenticação:** Requer `isOwner = true`

**Body:**

```json
{
  "status": "HIDDEN" | "ACTIVE" | "DELETED"
}
```

### GET /api/admin/users

Lista todos os usuários do sistema.

**Autenticação:** Requer `isOwner = true`

**Resposta:**

```json
[
  {
    "id": "...",
    "username": "...",
    "email": "...",
    "name": "...",
    "role": "USER" | "MOD" | "ADMIN",
    "isOwner": false,
    "createdAt": "...",
    "_count": {
      "topics": 5,
      "comments": 20,
      "votes": 15,
      "topicVotes": 8
    }
  }
]
```

### DELETE /api/admin/users/:id

Deleta um usuário permanentemente (incluindo todo seu conteúdo).

**Autenticação:** Requer `isOwner = true`

**Restrição:** Não pode deletar a si mesmo

### PATCH /api/admin/users/:id

Atualiza role ou status de owner de um usuário.

**Autenticação:** Requer `isOwner = true`

**Body:**

```json
{
  "role": "USER" | "MOD" | "ADMIN",
  "isOwner": true | false
}
```

**Restrições:**

- Não pode remover próprio status de owner
- Role deve ser USER, MOD ou ADMIN

## Próximos Passos (Sugestões)

1. **Logs de Auditoria**: Registrar todas as ações do owner
2. **Múltiplos Owners**: Permitir mais de um owner (se necessário)
3. **Permissões Granulares**: Diferentes níveis de acesso admin
4. **Dashboard Analytics**: Estatísticas e métricas do sistema
5. **Moderação em Lote**: Ações em múltiplos itens de uma vez
6. **Sistema de Reports**: Usuários podem reportar conteúdo
7. **Auto-moderação**: Regras automáticas baseadas em comportamento

## Segurança

⚠️ **IMPORTANTE**:

- Mantenha o número de owners ao mínimo necessário
- Nunca exponha o script `make-owner.ts` em produção
- Considere adicionar 2FA para contas owner
- Monitore logs de acesso ao painel administrativo
- Faça backup regular do banco de dados antes de deletar conteúdo

## Suporte

Para questões ou problemas:

1. Verifique os logs do servidor
2. Confirme que o usuário está autenticado
3. Verifique o campo `isOwner` no banco de dados
4. Teste os endpoints com ferramentas como Postman
