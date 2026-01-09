"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/use-translations";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ResendVerificationPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/email-verification/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (response.status === 429) {
        setError(
          t(
            "common.error",
            `Muitas tentativas. Tente novamente em ${result.retryAfter} segundos.`
          )
        );
        return;
      }

      if (!response.ok) {
        setError(
          result.message || t("common.error", "Ocorreu um erro inesperado")
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError(t("common.error", "Ocorreu um erro inesperado"));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              {t("auth.email_sent", "Email Enviado")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("auth.check_inbox", "Verifique a sua caixa de entrada")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              {t(
                "auth.verification_email_sent_message",
                "Se o email estiver associado a uma conta, receberá um link para verificar o seu email nos próximos minutos."
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t(
                "auth.check_spam",
                "Não se esqueça de verificar a pasta de spam."
              )}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/auth/login")}
            >
              {t("auth.back_to_login", "Voltar ao Login")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {t("auth.verify_email", "Verificar Email")}
          </CardTitle>
          <CardDescription className="text-center">
            {t(
              "auth.verify_email_description",
              "Reenviamos um link para verificar o seu email"
            )}
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground">
              {t(
                "auth.verify_email_prompt",
                "Clique no botão abaixo para reenviar o email de verificação"
              )}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner size="sm" className="mr-2" />}
              {t("auth.resend_verification", "Reenviar Email de Verificação")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.remembered_password", "Lembrou-se da senha?")}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t("common.login", "Entrar")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
