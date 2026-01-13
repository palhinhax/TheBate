# Anonymous Voting and Commenting Implementation

## Overview

This document describes the implementation of anonymous voting and commenting functionality for TheBate platform. This feature allows users to interact with the platform without requiring authentication, helping to increase engagement during the initial phase when there are no registered users.

## Feature Flag

The implementation is controlled by an environment variable:

```bash
NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="false"  # Allow anonymous interactions
NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="true"   # Require login (default behavior)
```

**Default**: `false` (anonymous interactions allowed)

## How It Works

### Voting

#### Anonymous Voting (when `NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="false"`)

1. **Client-Side Tracking**: Votes are tracked in the browser's `localStorage`
   - Anonymous users can vote without creating an account
   - Each vote is stored with a key like `vote_{topicId}`
   - An anonymous ID is generated based on browser fingerprint
   - Vote persistence is browser-specific (1 vote per topic per browser)

2. **API Handling**:
   - Anonymous votes return success but are NOT stored in the database
   - Vote counts displayed reflect only authenticated user votes
   - No karma points awarded for anonymous votes

3. **Vote Types Supported**:
   - YES_NO topics: "SIM", "NAO", "DEPENDE"
   - MULTI_CHOICE topics: Multiple option selection

#### Authenticated Voting (when `NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="true"`)

- Original behavior: requires login
- Votes are stored in database
- Karma points are awarded
- Shows authentication modal when attempting to vote without login

### Commenting

#### Anonymous Commenting Status

Currently, anonymous commenting is **prepared but not fully implemented**:

1. **UI**: Comment form does not require login when flag is off
2. **API**: Returns a friendly message indicating anonymous comments are coming soon
3. **Message**: "Comentários anónimos estarão disponíveis em breve"

This allows for future enhancement without requiring code changes to the UI.

## Files Modified

### Core Logic

- **`lib/auth-config.ts`**: New utility functions for auth configuration
  - `requireAuthForInteractions()`: Check if auth is required
  - `generateAnonymousId()`: Generate browser fingerprint ID
  - `storeAnonymousVote()`: Store vote in localStorage
  - `getAnonymousVote()`: Retrieve stored vote
  - `removeAnonymousVote()`: Remove stored vote

### Voting Components

- **`features/topics/components/theme-vote-buttons.tsx`**:
  - Conditional auth check based on feature flag
  - localStorage integration for anonymous votes
  - Success toast for anonymous votes

- **`features/topics/components/multi-choice-vote-buttons.tsx`**:
  - Conditional auth check based on feature flag
  - localStorage integration for anonymous multi-choice votes
  - Conditional display of login prompt

### API Routes

- **`app/api/topics/[slug]/vote/route.ts`**:
  - Bypass auth check when flag is disabled
  - Return success for anonymous votes without database storage
  - Skip karma awards for anonymous votes

- **`app/api/comments/route.ts`**:
  - Bypass auth check when flag is disabled
  - Return friendly message for anonymous comment attempts

### Comment Form

- **`features/comments/components/new-comment-form.tsx`**:
  - Conditional auth check based on feature flag
  - Prepared to send anonymous ID with comment requests

### Configuration

- **`.env.example`**: Added `NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS` documentation

### Translations

Added new translation keys in all 12 supported languages (en, pt, es, fr, de, hi, bn, zh, ru, ja, ar, id):

- `vote_registered`: "Vote registered" / "Voto registado"
- `vote_registered_desc`: "Your vote has been recorded successfully!" / "O teu voto foi registado com sucesso!"

## Usage

### For Development

1. Set environment variable:
   ```bash
   NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="false"
   ```

2. Restart the development server:
   ```bash
   pnpm dev
   ```

3. Test voting without authentication:
   - Visit any topic page
   - Click vote buttons without logging in
   - Votes are stored in browser localStorage
   - Refreshing the page should maintain your vote selection

### For Production

To enable anonymous interactions:

```bash
# In production environment
NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="false"
```

To require authentication (revert to original behavior):

```bash
# In production environment
NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="true"
```

## Testing

### Unit Tests

Run the auth configuration tests:

```bash
pnpm test -- auth-config.test.ts
```

Tests cover:
- Environment variable parsing
- Default behavior (false when not set)
- Case insensitive "true" detection

### Manual Testing

1. **Test Anonymous Voting**:
   - Set `NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="false"`
   - Visit a topic without logging in
   - Vote on the topic
   - Verify vote is selected and success message appears
   - Refresh page and verify vote is still selected
   - Try voting again on same topic (should change vote)

2. **Test Vote Removal**:
   - Click the same vote button again
   - Verify vote is removed
   - Check localStorage is cleared

3. **Test Multiple Topics**:
   - Vote on different topics
   - Verify each topic maintains separate vote state

4. **Test Auth Required**:
   - Set `NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="true"`
   - Try voting without login
   - Verify auth modal appears

## Limitations

### Current Phase

1. **Anonymous Votes Not Counted**:
   - Anonymous votes are NOT stored in database
   - Vote statistics only reflect authenticated users
   - This is intentional for the initial phase

2. **Browser-Specific**:
   - Anonymous votes stored in localStorage
   - Clearing browser data loses votes
   - Different browsers/devices have separate votes
   - No protection against determined users voting multiple times

3. **No Anonymous Comments (Yet)**:
   - Comment UI accepts anonymous users
   - API returns "coming soon" message
   - Database schema requires userId for comments

### Future Enhancements

When ready to fully support anonymous interactions:

1. **Anonymous Vote Storage**:
   - Create anonymous user system
   - Store anonymous votes in database
   - Implement better duplicate prevention (IP tracking)

2. **Anonymous Comments**:
   - Create anonymous user entries
   - Store comments with anonymous user attribution
   - Add moderation for anonymous content

3. **Migration Path**:
   - Allow anonymous users to claim their votes/comments
   - Convert to authenticated user on registration

## Security Considerations

1. **Duplicate Votes**: Browser localStorage provides basic protection only
2. **Spam**: No rate limiting for anonymous users (should be added)
3. **Abuse**: No moderation for anonymous interactions
4. **Data**: Anonymous interactions not persisted (no backup/recovery)

## Rollback Plan

To revert to requiring authentication:

1. Set environment variable:
   ```bash
   NEXT_PUBLIC_REQUIRE_AUTH_FOR_INTERACTIONS="true"
   ```

2. Restart application

3. All auth checks re-activate automatically

No code changes or database migrations needed.

## Questions?

Contact the development team for clarification or issues.
