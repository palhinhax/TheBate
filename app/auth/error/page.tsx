"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description: "There is a problem with the server configuration. This is likely due to missing environment variables (AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or DATABASE_URL).",
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You do not have permission to sign in. Please contact support if you believe this is an error.",
  },
  Verification: {
    title: "Verification Failed",
    description: "The sign-in link is no longer valid. It may have been used already or it may have expired.",
  },
  OAuthSignin: {
    title: "OAuth Sign-in Error",
    description: "Error signing in with OAuth provider. Please check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correctly configured.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description: "Error processing OAuth callback. This might be due to incorrect redirect URIs in Google Cloud Console or database connection issues.",
  },
  OAuthCreateAccount: {
    title: "Error Creating Account",
    description: "Could not create account with OAuth provider. This is usually caused by database connection issues or missing database tables.",
  },
  EmailCreateAccount: {
    title: "Error Creating Email Account",
    description: "Could not create account with email. Please check database connection.",
  },
  Callback: {
    title: "Callback Error",
    description: "Error in the authentication callback. This might be due to database issues or missing OAuth configuration.",
  },
  CredentialsSignin: {
    title: "Sign In Failed",
    description: "The credentials you provided are incorrect. Please check your email and password.",
  },
  SessionRequired: {
    title: "Session Required",
    description: "You must be signed in to access this page.",
  },
  Default: {
    title: "Authentication Error",
    description: "An error occurred during authentication. Please try again.",
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  const errorInfo = errorMessages[error] || errorMessages.Default;

  // Get additional error details if provided
  const errorDetails = searchParams.get("details");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>{errorInfo.title}</CardTitle>
          </div>
          <CardDescription className="text-base">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorDetails && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Technical Details:</p>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {errorDetails}
              </p>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-sm">What you can try:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {error === "Configuration" && (
                <>
                  <li>• Check that AUTH_SECRET is set in environment variables</li>
                  <li>• Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are configured</li>
                  <li>• Ensure DATABASE_URL points to a valid Neon PostgreSQL database</li>
                  <li>• Run database migrations: <code className="bg-muted px-1 rounded">pnpm prisma migrate deploy</code></li>
                </>
              )}
              {(error === "OAuthCallback" || error === "OAuthCreateAccount") && (
                <>
                  <li>• Check database connection (DATABASE_URL)</li>
                  <li>• Verify OAuth redirect URIs in Google Cloud Console match your domain</li>
                  <li>• Ensure database tables exist (run migrations)</li>
                  <li>• Check server logs for detailed error messages</li>
                </>
              )}
              {error === "Verification" && (
                <>
                  <li>• Request a new verification email</li>
                  <li>• Make sure you&apos;re using the latest link</li>
                  <li>• Check your spam folder</li>
                </>
              )}
              {error === "CredentialsSignin" && (
                <>
                  <li>• Double-check your email address</li>
                  <li>• Verify your password is correct</li>
                  <li>• Try resetting your password</li>
                </>
              )}
              <li>• Clear your browser cache and cookies</li>
              <li>• Try again in an incognito/private window</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href="/auth/login">Try Again</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Development Mode:</strong> Check your terminal/console for detailed error logs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
