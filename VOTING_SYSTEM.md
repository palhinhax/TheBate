# Voting System Implementation

This document describes the voting and sided comments system implemented in TheBate.

## Features Implemented

### 1. Theme Voting (SIM/NÃO/DEPENDE)

Users can vote on themes without commenting:
- **SIM** - User agrees with the theme
- **NÃO** - User disagrees with the theme  
- **DEPENDE** - User's opinion depends on context

**Key Features:**
- Login required to vote
- One vote per user per theme (can be changed)
- Vote statistics displayed with percentages
- Public results visible to all users

**API Endpoints:**
- `POST /api/topics/[slug]/vote` - Create or update vote
- `DELETE /api/topics/[slug]/vote` - Remove vote
- `GET /api/topics/[slug]` - Includes vote stats and user's vote

### 2. Sided Comments (A FAVOR/CONTRA)

Comments are now arguments that must have a side:
- **A FAVOR** (👍) - Argument in favor of the theme
- **CONTRA** (👎) - Argument against the theme

**Key Features:**
- Side selection is mandatory for top-level comments
- Replies inherit context and don't require side selection
- Character limit: 20-800 characters
- Side badge displayed on each comment
- Filter comments by side (Todos/A Favor/Contra)

### 3. Quality Voting on Comments

Changed from upvote/downvote to quality-based voting:
- Only thumbs up (👍) for "Bom argumento" (good argument)
- One vote per user per comment
- Toggle to remove vote
- Users cannot vote on their own comments

## Database Changes

### New Enums
```prisma
enum CommentSide {
  AFAVOR
  CONTRA
}

enum ThemeVote {
  SIM
  NAO
  DEPENDE
}
```

### Updated Models
- **Comment**: Added `side` field (nullable for replies)
- **TopicVote**: Changed `value` (Int) to `vote` (ThemeVote enum), added `updatedAt`
- **Vote**: Now only accepts value of 1 (quality vote)

## UI Components

### Theme Voting
- `ThemeVoteButtons` - Three button interface for voting
- `ThemeVoteResults` - Visual percentage bars showing vote distribution

### Comments
- `NewCommentForm` - Updated with side selector (A FAVOR/CONTRA)
- `CommentItem` - Shows side badge, quality voting with thumbs up
- `CommentsList` - Supports filtering by side

## Usage Examples

### Voting on a Theme
1. Navigate to a theme page
2. Click one of: SIM, NÃO, or DEPENDE
3. Click again to change vote
4. See results update immediately

### Adding a Sided Comment
1. Navigate to a theme page
2. Select either "A Favor" or "Contra"
3. Write your argument (20-800 characters)
4. Click "Publicar Argumento"
5. Comment appears with side badge

### Filtering Comments
1. On theme page, use filter buttons:
   - **Todos** - Show all comments
   - **👍 A Favor** - Show only pro arguments
   - **👎 Contra** - Show only con arguments
2. Combine with sort options (Top/Novos)

### Quality Voting on Comments
1. Find a well-written argument
2. Click thumbs up (👍) icon
3. Click again to remove vote
4. Score reflects number of quality votes

## Migration

To apply the database changes:

```bash
# Apply the migration
npx prisma migrate deploy

# Or generate and push to dev database
npx prisma generate
npx prisma db push
```

## Validation Rules

- **Theme Vote**: Must be one of SIM, NAO, or DEPENDE
- **Comment Content**: 20-800 characters for top-level, 1-800 for replies
- **Comment Side**: Required for top-level comments, must be AFAVOR or CONTRA
- **Quality Vote**: Can only be +1, not -1

## Anti-Abuse Measures

- Login required for all voting and commenting
- Users cannot vote on their own comments
- Character limits prevent spam
- Side selection ensures meaningful contribution
- Toggle voting prevents vote spamming
