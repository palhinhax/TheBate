# Email Verification System

## Overview

The email verification system ensures users confirm their email addresses after registration using a time-limited token sent via email. This implementation follows security best practices similar to the password reset system.

## Features

### Security Features

1. **Token Hashing**: Tokens are hashed using SHA-256 before storage
2. **Single-Use Tokens**: Tokens can only be used once
3. **Time-Limited Tokens**: Tokens expire after 24 hours
4. **Rate Limiting**:
   - IP-based: 10 requests per minute
   - User-based: 3 requests per 10 minutes
5. **Automatic Email on Registration**: Verification email is sent immediately after user registration

## User Flow

1. **Registration**:
   - User completes registration form
   - Account is created
   - Verification email is sent automatically
   - User sees success message prompting them to check email

2. **Receive Email**:
   - User receives email with verification link
   - Link format: `/auth/verify-email?token=abc123...`
   - Link expires in 24 hours

3. **Verify Email**:
   - User clicks the link in email
   - Goes to `/auth/verify-email?token=abc123...`
   - Token is validated and email is marked as verified
   - User is redirected to home page

4. **Resend Verification** (if needed):
   - User goes to `/auth/resend-verification`
   - Clicks button to resend email
   - New verification email is sent

## API Endpoints

### Request Email Verification (Resend)

**POST** `/api/auth/email-verification/request`

Resend a verification email to the authenticated user.

**Authentication**: Required (user must be logged in)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email de verificação enviado com sucesso"
}
```

**Rate Limit Response (429):**

```json
{
  "message": "Muitas tentativas. Tente novamente mais tarde.",
  "retryAfter": 60
}
```

**Error Response (400):**

```json
{
  "message": "Email já verificado"
}
```

**Error Response (401):**

```json
{
  "message": "Não autenticado"
}
```

---

### Confirm Email Verification

**POST** `/api/auth/email-verification/confirm`

Verify the email using the token from the email.

**Request Body:**

```json
{
  "token": "abc123..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verificado com sucesso"
}
```

**Error Responses (400):**

```json
// Invalid/expired token
{
  "message": "Token inválido ou expirado"
}

// Invalid data
{
  "message": "Dados inválidos",
  "errors": {
    "token": ["Token é obrigatório"]
  }
}
```

---

## Database Schema

```prisma
model User {
  id                      String                   @id @default(cuid())
  email                   String                   @unique
  emailVerified           DateTime?
  emailVerificationTokens EmailVerificationToken[]
  // ... other fields
}

model EmailVerificationToken {
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

---

## Email Configuration

The email verification system uses **Resend** for email delivery, same as the password reset system.

### Development Mode

In development (when `RESEND_API_KEY` is not set):

- Emails are logged to the console
- No actual email is sent
- Check terminal output for the verification link

### Production Mode

Uses Resend API for reliable email delivery.

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
- **Subject**: Localized based on user's language (pt/en/es/fr/de)
- **Content**: Plain text with verification link
- **Link expiration**: Clearly stated (24 hours)

Example email (Portuguese):

```
Olá,

Bem-vindo ao TheBate! Para completar o seu registo, precisa de verificar o seu email.

Clique no link abaixo para confirmar o seu email:
https://yourdomain.com/auth/verify-email?token=abc123...

Este link expira em 24 horas.

Se não foi o utilizador que se registou, pode ignorar este email.

Atenciosamente,
Equipa TheBate
```

---

## Integration with Registration

The email verification is automatically integrated with the registration process:

1. User submits registration form
2. Account is created in database
3. Email verification token is generated and stored
4. Verification email is sent
5. User sees success message

If email sending fails:

- Registration still succeeds
- Error is logged
- User can resend verification email later from `/auth/resend-verification`

---

## Pages

### Verify Email Page

**Route**: `/auth/verify-email`

Features:

- Automatic verification on page load
- Loading state while verifying
- Success message with redirect countdown
- Error message for invalid/expired tokens

### Resend Verification Page

**Route**: `/auth/resend-verification`

Features:

- Simple button to resend verification email
- Success/error messages
- Link back to login page

---

## Testing

### Manual Testing

1. **Register New User**:

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name":"Test User",
       "username":"testuser",
       "email":"test@example.com",
       "password":"Password123!"
     }'
   ```

2. **Check Console**: Look for the email with the verification token

3. **Verify Email**:

   ```bash
   curl -X POST http://localhost:3000/api/auth/email-verification/confirm \
     -H "Content-Type: application/json" \
     -d '{"token":"TOKEN_FROM_EMAIL"}'
   ```

4. **Resend Verification** (requires authentication):
   - Login with the user
   - Visit `/auth/resend-verification`
   - Click "Resend Verification Email"

### Security Testing

- [ ] Test rate limiting (IP and user)
- [ ] Test token expiration (after 24 hours)
- [ ] Test token reuse (should fail)
- [ ] Test invalid tokens
- [ ] Verify tokens are hashed in database

---

## Future Enhancements

- [ ] Integration with NextAuth to require email verification for login
- [ ] Email change verification (when user updates email)
- [ ] Configurable token expiration time
- [ ] Email templates with HTML formatting
- [ ] Multiple language support in UI (currently supports pt/en/es/fr/de in emails)
- [ ] Admin panel to manually verify emails
- [ ] Notification when email is verified

---

## Migration

To apply the database migration:

```bash
pnpm prisma migrate dev
```

Or manually apply the SQL:

```sql
-- See: prisma/migrations/20260109103101_add_email_verification/migration.sql
```

---

## Translations

The system supports multiple languages. Current translations:

- Portuguese (pt)
- English (en)
- Spanish (es)
- French (fr)
- German (de)

To add more languages, update:

1. `locales/{locale}.json` - UI translations
2. `lib/email.ts` - Email templates

---

## Related Systems

- **Password Reset**: Similar token-based system for password recovery
- **Authentication**: NextAuth integration for session management

---

## Troubleshooting

### Email not received

1. Check spam folder
2. Verify `RESEND_API_KEY` is set correctly
3. Check console logs for errors
4. Verify domain is verified in Resend dashboard

### Token expired

- Tokens expire after 24 hours
- User can request a new verification email from `/auth/resend-verification`

### Rate limit hit

- Wait for the specified retry time
- Rate limits reset automatically

---

## Security Considerations

1. **Token Storage**: Tokens are hashed with SHA-256 before storage
2. **No Email Enumeration**: API always returns success, even for non-existent users
3. **Rate Limiting**: Prevents abuse through multiple requests
4. **Single Use**: Tokens can only be used once
5. **Time Limited**: Tokens expire after 24 hours
6. **Cascade Delete**: Tokens are deleted when user is deleted
