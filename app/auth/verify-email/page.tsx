"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/use-translations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslations();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError(t("common.error", "Token inválido"));
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/email-verification/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(
            result.message || t("common.error", "Ocorreu um erro inesperado")
          );
          return;
        }

        setSuccess(true);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (err) {
        setError(t("common.error", "Ocorreu um erro inesperado"));
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, t, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              {t("auth.verifying_email", "Verificando Email")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Spinner size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              {t("auth.email_verified", "Email Verificado")}
            </CardTitle>
            <CardDescription className="text-center">
              {t(
                "auth.email_verified_success",
                "Seu email foi verificado com sucesso!"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              {t(
                "auth.email_verified_message",
                "Você pode agora aproveitar todos os recursos da plataforma."
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.redirecting", "Redirecionando em alguns segundos...")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {t("auth.verify_email_error", "Erro na Verificação")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground">
            {t(
              "auth.verify_email_error_message",
              "Não conseguimos verificar seu email. O link pode ter expirado."
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <VerifyEmailContent />;
}
