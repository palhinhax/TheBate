# Password Reset System

This document describes the password reset system implementation using magic links.

## Overview

The password reset system allows users to securely reset their passwords using a time-limited token sent via email. The implementation follows security best practices to prevent user enumeration and ensure token safety.

## Features

### Security Features

1. **No User Enumeration**: The API always returns success, even if the email doesn't exist
2. **Token Hashing**: Tokens are hashed using SHA-256 before storage
3. **Single-Use Tokens**: Tokens can only be used once
4. **Time-Limited Tokens**: Tokens expire after 15 minutes
5. **Rate Limiting**:
   - IP-based: 10 requests per minute
   - Email-based: 3 requests per 10 minutes
6. **Password Strength Validation**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

## API Endpoints

### Request Password Reset

**POST** `/api/auth/password-reset/request`

Request a password reset link to be sent via email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Se o email existir, receberá um link para recuperar a senha."
}
```

**Rate Limit Response (429):**
```json
{
  "message": "Muitas tentativas. Tente novamente mais tarde.",
  "retryAfter": 60
}
```

### Confirm Password Reset

**POST** `/api/auth/password-reset/confirm`

Reset the password using the token from the email.

**Request Body:**
```json
{
  "token": "abc123...",
  "newPassword": "NewSecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Error Responses (400):**
```json
// Invalid/expired token
{
  "message": "Token inválido ou expirado"
}

// Weak password
{
  "message": "Senha fraca",
  "errors": {
    "password": [
      "A senha deve conter pelo menos uma letra maiúscula"
    ]
  }
}
```

## User Flow

1. **Request Reset**:
   - User goes to `/auth/forgot-password`
   - Enters their email address
   - Submits the form
   - Sees a generic success message (no indication if email exists)

2. **Receive Email**:
   - If the email exists, user receives an email with a reset link
   - Link format: `/auth/reset-password?token=abc123...`
   - Link expires in 15 minutes

3. **Reset Password**:
   - User clicks the link in email
   - Goes to `/auth/reset-password?token=abc123...`
   - Enters new password (with strength requirements shown)
   - Confirms new password
   - Submits the form
   - On success, redirects to login page

## Database Schema

```prisma
model PasswordResetToken {
  id        String    @id @default(cuid())
  userId    String
  tokenHash String    @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

## Email Configuration

### Development Mode

In development, emails are logged to the console instead of being sent:

```
============================================================
📧 Email to send:
To: user@example.com
Subject: Recuperar Senha - TheBate
------------------------------------------------------------
[Email content...]
============================================================
```

### Production Mode

The system uses **Resend** for email delivery in production.

#### Setup Instructions

1. **Get Resend API Key**:
   - Sign up at [resend.com](https://resend.com)
   - Create an API key from your dashboard
   - Verify your domain (or use the test domain for development)

2. **Configure Environment Variables**:
   ```env
   RESEND_API_KEY="re_..."
   EMAIL_FROM="noreply@yourdomain.com"
   ```

3. **Domain Verification**:
   - For production, verify your domain in Resend dashboard
   - Update `EMAIL_FROM` with your verified domain email
   - For testing, you can use `onboarding@resend.dev`

#### Email Template

Emails are sent with:
- **From**: Value from `EMAIL_FROM` env variable (default: `onboarding@resend.dev`)
- **Subject**: Localized based on user's language (pt/en/es)
- **Content**: Plain text with reset link
- **Link expiration**: Clearly stated (15 minutes)

#### Error Handling

- Missing `RESEND_API_KEY` in production throws an error
- Failed email sends are logged and re-thrown
- Development mode always logs to console (never sends actual emails)

## Rate Limiting

### In-Memory Implementation

The current implementation uses an in-memory Map for rate limiting. This is suitable for:
- Single-server deployments
- Development and testing
- Low to medium traffic applications

### Production Considerations

For production at scale, consider using Redis-based rate limiting:

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Use Redis for distributed rate limiting
  // ...
}
```

## Cleanup

Old expired tokens are not automatically cleaned up. Consider adding a cleanup job:

```typescript
// In a separate cleanup script or cron job
import { prisma } from '@/lib/prisma';

async function cleanupExpiredTokens() {
  await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
```

## Testing

### Manual Testing

1. **Request Reset**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/password-reset/request \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

2. **Check Console**: Look for the email with the token

3. **Confirm Reset**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/password-reset/confirm \
     -H "Content-Type: application/json" \
     -d '{"token":"TOKEN_FROM_EMAIL","newPassword":"NewPassword123!"}'
   ```

### Security Testing

- [ ] Test rate limiting (IP and email)
- [ ] Test token expiration (after 15 minutes)
- [ ] Test token reuse (should fail)
- [ ] Test invalid tokens
- [ ] Test weak passwords
- [ ] Verify no user enumeration

## Future Enhancements

- [ ] Email verification system
- [ ] Magic link authentication (passwordless)
- [ ] Multi-factor authentication (MFA)
- [ ] Passkeys support
- [ ] Account recovery options
- [ ] Notification on password change
- [ ] Password history (prevent reuse)

## Migration

To apply the database migration:

```bash
npm run db:migrate
```

Or manually apply the SQL:

```sql
-- See: prisma/migrations/20260108195051_add_password_reset_token/migration.sql
```

## Translations

The system supports multiple languages. Current translations:
- Portuguese (pt)
- English (en)
- Spanish (es) - email only

To add more languages, update:
1. `locales/{locale}.json` - UI translations
2. `lib/email.ts` - Email templates
