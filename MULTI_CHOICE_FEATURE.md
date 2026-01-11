# Multi-Choice Topics Feature

## Overview

This feature adds support for multi-choice voting topics to TheBate, allowing topics to have multiple predefined options that users can vote on, in addition to the existing Yes/No debate format.

## Topic Types

### YES_NO (Original)
- Binary voting: Sim, Não, Depende
- Comments are associated with a side (A Favor/Contra)
- Filter comments by side

### MULTI_CHOICE (New)
- Vote for one or multiple predefined options
- Configurable max choices per user
- Comments can be associated with specific options
- Filter comments by option
- Results displayed as a ranking

## Database Schema Changes

### New Tables

#### TopicOption
Stores the available options for multi-choice topics:
- `id`: Unique identifier
- `label`: Option name (e.g., "Messi", "Ronaldo")
- `description`: Optional description
- `order`: Display order
- `topicId`: Reference to parent topic

### Modified Tables

#### Topic
Added fields:
- `type`: TopicType enum (YES_NO | MULTI_CHOICE)
- `allowMultipleVotes`: Boolean - allow voting for multiple options
- `maxChoices`: Integer - maximum number of options user can select

#### TopicVote
Modified fields:
- `vote`: Now optional (null for MULTI_CHOICE)
- `optionId`: New field - reference to TopicOption for MULTI_CHOICE votes
- Unique constraint updated to `(userId, topicId, optionId)`

#### Comment
Added fields:
- `optionId`: Optional reference to TopicOption for MULTI_CHOICE topics

## API Changes

### Voting Endpoint: POST /api/topics/[slug]/vote

#### YES_NO Topics
Request body:
```json
{
  "vote": "SIM" | "NAO" | "DEPENDE"
}
```

Response:
```json
{
  "success": true,
  "userVote": "SIM",
  "voteStats": {
    "SIM": 10,
    "NAO": 5,
    "DEPENDE": 3,
    "total": 18
  }
}
```

#### MULTI_CHOICE Topics
Request body:
```json
{
  "optionIds": ["option-id-1", "option-id-2"]
}
```

Response:
```json
{
  "success": true,
  "userVotes": ["option-id-1", "option-id-2"],
  "optionVoteCounts": {
    "option-id-1": 15,
    "option-id-2": 8,
    "option-id-3": 12
  },
  "totalVotes": 35
}
```

### Comments Endpoint: GET /api/topics/[slug]/comments

New query parameter:
- `optionId`: Filter comments by option (for MULTI_CHOICE topics)

Existing parameter:
- `side`: Filter by side (for YES_NO topics)

### Create Comment: POST /api/comments

New fields in request body:
- `side`: Required for YES_NO topics (AFAVOR | CONTRA)
- `optionId`: Optional for MULTI_CHOICE topics

## Frontend Components

### New Components

1. **MultiChoiceVoteButtons**
   - Displays options as selectable cards
   - Supports single or multiple selection
   - Shows selection count and limits
   - Handles vote submission

2. **MultiChoiceVoteResults**
   - Displays ranking of options
   - Shows vote counts and percentages
   - Visual progress bars
   - Medal indicators for top 3

### Modified Components

1. **NewCommentForm**
   - Shows side selection (A Favor/Contra) for YES_NO
   - Shows option dropdown for MULTI_CHOICE
   - Adapts based on topic type

2. **CommentsList**
   - Accepts optionId filter
   - Includes option info in comments display

3. **Topic Page** (`app/t/[slug]/page.tsx`)
   - Conditional rendering based on topic type
   - Different vote buttons and results
   - Option-based comment filtering

## Usage

### Creating a Multi-Choice Topic (Admin)

Currently, multi-choice topics must be created via database or API:

```typescript
await prisma.topic.create({
  data: {
    title: "Best Football Player of All Time",
    description: "Vote for the greatest footballer ever",
    type: "MULTI_CHOICE",
    allowMultipleVotes: false,
    maxChoices: 1,
    slug: "best-football-player",
    language: "pt",
    tags: ["football", "sports"],
    createdById: userId,
    options: {
      create: [
        { label: "Messi", order: 0 },
        { label: "Ronaldo", order: 1 },
        { label: "Pelé", order: 2 },
        { label: "Maradona", order: 3 },
      ]
    }
  }
});
```

### Voting on Multi-Choice Topics

Users can:
1. Select one or multiple options (based on settings)
2. See real-time feedback on selection limits
3. Submit their vote
4. Change their vote at any time
5. Remove their vote

### Commenting on Multi-Choice Topics

Users can:
1. Optionally associate their comment with a specific option
2. View all comments or filter by option
3. See which option other comments are associated with

## Migration Guide

### For Production Deployment

1. **Backup Database**
   ```bash
   pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Run Migration**
   ```bash
   # Using Prisma (recommended)
   npx prisma migrate deploy
   ```
   
   The migration `20260111000000_add_multi_choice_topics` will be automatically applied.

3. **Regenerate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Verify**
   - Check that existing YES_NO topics still work
   - Create a test MULTI_CHOICE topic
   - Test voting and commenting

### Rollback Plan

If issues occur:

1. **Restore Database Backup**
2. **Revert Code Changes**
   ```bash
   git revert <commit-hash>
   ```

## Testing Checklist

- [ ] Existing YES_NO topics work without regression
- [ ] Can create MULTI_CHOICE topics with options
- [ ] Single-choice voting works correctly
- [ ] Multiple-choice voting respects maxChoices
- [ ] Can change votes on MULTI_CHOICE topics
- [ ] Can remove votes
- [ ] Ranking displays correctly
- [ ] Comments can be associated with options
- [ ] Option filtering works for comments
- [ ] SSR/SEO metadata correct for both types
- [ ] Mobile responsive

## Future Enhancements

### Phase 2 Features
1. **Admin UI for Multi-Choice Creation**
   - Visual option builder
   - Drag-and-drop ordering
   - Image upload for options

2. **Advanced Voting**
   - Time-based trends
   - Demographic breakdowns
   - Voting history

3. **Tournament Mode**
   - Head-to-head eliminations
   - Bracket visualization
   - Progressive voting rounds

4. **Option Images**
   - Upload images for each option
   - Gallery view mode

## Troubleshooting

### Common Issues

**Issue**: Votes not being recorded
- Check that optionIds match existing options
- Verify user is authenticated
- Check maxChoices configuration

**Issue**: Comments not showing option association
- Ensure optionId is included in comment queries
- Verify option exists and belongs to topic

**Issue**: Type errors in TypeScript
- Regenerate Prisma client: `npx prisma generate`
- Clear Next.js cache: `rm -rf .next`

## Support

For questions or issues:
1. Check existing GitHub issues
2. Review this documentation
3. Create a new issue with:
   - Topic type (YES_NO/MULTI_CHOICE)
   - Expected vs actual behavior
   - Steps to reproduce
   - Screenshots if applicable
