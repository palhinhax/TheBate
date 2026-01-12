# Sistema de Karma e Conquistas

## Visão Geral

Sistema de gamificação implementado para aumentar o engagement dos utilizadores na plataforma TheBate. Os utilizadores ganham pontos de karma por participar ativamente e desbloqueiam badges (conquistas) ao atingir marcos específicos.

## Pontos de Karma

### Como Ganhar Karma

| Ação                   | Pontos     |
| ---------------------- | ---------- |
| Criar um novo tema     | +10 pontos |
| Publicar um comentário | +5 pontos  |
| Votar num tema         | +2 pontos  |

### Notas Importantes

- Pontos são atribuídos automaticamente após cada ação
- Votar múltiplas vezes no mesmo tema não dá pontos adicionais (apenas o primeiro voto)
- O karma é cumulativo e nunca diminui
- Todos os utilizadores começam com 0 karma

## Conquistas (Achievements)

### Conquistas de Votação

| Badge | Nome                                    | Requisito      | Tier   |
| ----- | --------------------------------------- | -------------- | ------ |
| 🗳️    | First Vote / Primeiro Voto              | Votar 1 vez    | Bronze |
| 🎯    | Active Voter / Votante Ativo            | Votar 10 vezes | Silver |
| ⭐    | Voting Enthusiast / Entusiasta de Votos | Votar 50 vezes | Gold   |

### Conquistas de Criação de Temas

| Badge | Nome                                 | Requisito      | Tier   |
| ----- | ------------------------------------ | -------------- | ------ |
| 🎤    | Debate Starter / Iniciador de Debate | Criar 1 tema   | Bronze |
| 🎨    | Topic Creator / Criador de Temas     | Criar 5 temas  | Silver |
| 👑    | Debate Master / Mestre de Debates    | Criar 20 temas | Gold   |

### Conquistas de Comentários

| Badge | Nome                                           | Requisito                | Tier   |
| ----- | ---------------------------------------------- | ------------------------ | ------ |
| 💬    | First Comment / Primeiro Comentário            | Publicar 1 comentário    | Bronze |
| 💭    | Active Commenter / Comentador Ativo            | Publicar 10 comentários  | Silver |
| 🎓    | Discussion Expert / Especialista em Discussões | Publicar 50 comentários  | Gold   |
| 🏆    | Discussion Master / Mestre das Discussões      | Publicar 100 comentários | Gold   |

### Conquistas de Karma

| Badge | Nome                              | Requisito           | Tier     |
| ----- | --------------------------------- | ------------------- | -------- |
| 🌟    | Rising Star / Estrela em Ascensão | Alcançar 100 karma  | Silver   |
| 💎    | Influential Voice / Voz Influente | Alcançar 500 karma  | Gold     |
| 🏅    | Legend / Lenda                    | Alcançar 1000 karma | Platinum |

## Tiers de Conquistas

- **Bronze** 🥉 - Conquistas iniciais para novos utilizadores
- **Silver** 🥈 - Conquistas para utilizadores ativos
- **Gold** 🥇 - Conquistas para utilizadores muito ativos
- **Platinum** 💎 - Conquistas raras para utilizadores lendários

## Implementação Técnica

### Database Schema

```prisma
model User {
  karma Int @default(0)
  achievements UserAchievement[]
}

model Achievement {
  id String @id @default(cuid())
  key String @unique
  name Json // Multilingual
  description Json // Multilingual
  icon String
  tier String @default("bronze")
  requirement Int @default(1)
  users UserAchievement[]
}

model UserAchievement {
  id String @id @default(cuid())
  userId String
  achievementId String
  unlockedAt DateTime @default(now())
  user User @relation(...)
  achievement Achievement @relation(...)

  @@unique([userId, achievementId])
}
```

### Karma Library

Localização: `/lib/karma.ts`

**Funções:**

- `awardKarma(userId, points)` - Atribui pontos de karma a um utilizador
- `checkAchievements(userId)` - Verifica e desbloqueia conquistas elegíveis

### Integração nas APIs

- **POST /api/topics** - Atribui +10 karma ao criar tema
- **POST /api/comments** - Atribui +5 karma ao comentar
- **POST /api/topics/[slug]/vote** - Atribui +2 karma ao votar (primeira vez)

### UI Components

- `AchievementsDisplay` - Componente para mostrar badges desbloqueados
- `Badge` - Componente UI base para badges

### Visualização

- **Perfil do Utilizador**: Mostra karma total e badges desbloqueados
- **Stats**: Karma aparece como primeiro stat no perfil

## Traduções

Sistema totalmente traduzido em 5 idiomas:

- 🇬🇧 English
- 🇵🇹 Português (Europeu)
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## Seed Script

Para popular as conquistas na base de dados:

```bash
pnpm tsx scripts/seed-achievements.ts
```

## Próximos Passos (Futuro)

1. **Leaderboard Semanal/Mensal** - Quando houver mais utilizadores
2. **Notificações de Conquistas** - Toast quando desbloquear um badge
3. **Karma por Votos Recebidos** - +1 karma por cada voto que os teus comentários receberem
4. **Conquistas Especiais** - Badges sazonais ou eventos especiais
5. **Níveis de Utilizador** - Rookie, Contributor, Expert, Master, Legend
6. **Karma Decay** - Sistema opcional para reduzir karma de utilizadores inativos

## Notas de Desenvolvimento

- As conquistas são verificadas automaticamente após cada ação que dá karma
- O sistema é performático - apenas consulta conquistas não desbloqueadas
- Todas as operações são transacionais (evita duplicação)
- Suporta multilinguagem nativamente com JSON fields

## Convenções de Commit

Este sistema foi implementado seguindo Conventional Commits:

```
feat(karma): implement gamification system with karma points and achievements
```

- **Type**: `feat` (nova funcionalidade) → Cria release MINOR
- **Scope**: `karma` (área afetada)
- **Breaking Changes**: Nenhuma (compatível com código existente)
