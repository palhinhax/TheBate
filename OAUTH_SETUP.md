# OAuth Authentication Setup Guide

This guide explains how to set up Google OAuth and Magic Link authentication in TheBate.

## Overview

TheBate now supports two authentication methods:

1. **Google OAuth** - One-click sign-in with Google
2. **Magic Link (Email)** - Passwordless authentication via email

Users are automatically created on first login. No manual registration is required.

## Prerequisites

- A Google Cloud project with OAuth 2.0 credentials
- Resend API key (already configured)
- Production or staging database

## Step 1: Run Database Migration

Apply the OAuth support migration to your database:

```bash
# Development
npm run db:migrate

# Production (using Prisma CLI directly)
npx prisma migrate deploy
```

This migration:

- Makes `username` and `passwordHash` optional in the User table
- Creates `Account` table for OAuth provider accounts
- Creates `Session` table for user sessions
- Creates `VerificationToken` table for magic links

## Step 2: Set Up Google OAuth

### 2.1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 2.2. Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: TheBate
   - User support email: your email
   - Developer contact: your email
4. Application type: **Web application**
5. Name: TheBate Production (or Development)
6. Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### 2.3. Configure Environment Variables

Add to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Auth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-random-secret-here"

# Application URL
NEXTAUTH_URL="http://localhost:3000"  # or your production URL

# Resend (already configured)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

## Step 3: Configure Resend for Magic Links

Magic links use your existing Resend configuration. Ensure:

1. **Domain verification** is complete in Resend dashboard
2. **DKIM and SPF records** are configured
3. **From address** matches your verified domain

The system will automatically send magic link emails using the templates in `/lib/email.ts`.

## Step 4: Test Authentication

### Test Google OAuth

1. Start the development server: `npm run dev`
2. Navigate to any topic page
3. Try to vote or comment
4. Click "Sign in with Google" in the modal
5. Complete the Google sign-in flow
6. You should be redirected back and authenticated

### Test Magic Link

1. Navigate to any topic page
2. Try to vote or comment
3. Enter your email in the modal
4. Click "Send Magic Link"
5. Check your email inbox
6. Click the link in the email
7. You should be signed in automatically

## User Flow

### First-Time Login (OAuth)

1. User clicks "Sign in with Google"
2. Google authenticates the user
3. System creates a new User record with:
   - Email from Google
   - Name from Google (optional)
   - Image from Google (optional)
   - Auto-generated username (from email)
   - `emailVerified` set to current timestamp
4. User is signed in and redirected back

### First-Time Login (Magic Link)

1. User enters their email
2. System sends a magic link email
3. User clicks the link
4. System creates a new User record with:
   - Email provided
   - Auto-generated username (from email)
   - `emailVerified` set to current timestamp
5. User is signed in and redirected back

### Returning Users

Both methods use the same User record based on email address.

## Security Considerations

### Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// In /api/auth/[...nextauth]/route.ts or middleware
import { rateLimit } from "@/lib/rate-limit";

// Limit magic link requests
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// Apply to magic link endpoint
```

### Email Verification

- OAuth providers (Google) automatically mark email as verified
- Magic links also mark email as verified upon first sign-in
- No separate verification step needed

### Account Linking

The system uses `allowDangerousEmailAccountLinking: true` for Google OAuth. This means:

- If a user signs up with email/password, they can later sign in with Google using the same email
- Both methods will access the same account

## Troubleshooting

### Google OAuth Errors

**Error: "redirect_uri_mismatch"**

- Ensure the redirect URI in Google Console exactly matches your callback URL
- Check for trailing slashes and http vs https

**Error: "invalid_client"**

- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Check that credentials are for the correct Google Cloud project

### Magic Link Issues

**Email not received**

- Check spam folder
- Verify RESEND_API_KEY is correct
- Ensure domain is verified in Resend
- Check Resend dashboard for delivery logs

**Link expired**

- Magic links expire after 24 hours by default
- Request a new link

### Database Issues

**Error: "username unique constraint"**

- The system generates unique usernames automatically
- If this error occurs, check the username generation logic in `/lib/auth/config.ts`

## Customization

### Email Templates

Customize magic link emails in `/lib/email.ts`:

- Update the HTML template
- Change email subject lines
- Add your branding

### Translations

Auth modal translations are in `/locales/{lang}.json`:

- `auth.login_modal_title`
- `auth.login_modal_description`
- `auth.sign_in_google`
- `auth.sign_in_email`
- `auth.magic_link_sent_message`

Currently supported languages: English, Portuguese (PT), Spanish, French, German

## Production Deployment

1. Set all environment variables in your hosting platform (Vercel, etc.)
2. Run database migration: `npx prisma migrate deploy`
3. Test both authentication methods
4. Monitor error logs for any issues

## Support

For issues or questions:

- Check GitHub issues
- Review NextAuth.js documentation: https://next-auth.js.org
- Review Resend documentation: https://resend.com/docs
