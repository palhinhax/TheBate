"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "@/lib/use-translations";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslations();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t("common.error", "Email inválido")),
  });

  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 429) {
        setError(
          t("common.error", `Muitas tentativas. Tente novamente em ${result.retryAfter} segundos.`)
        );
        return;
      }

      if (!response.ok) {
        setError(result.message || t("common.error", "Ocorreu um erro inesperado"));
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
                "auth.reset_email_sent_message",
                "Se o email existir na nossa base de dados, receberá um link para recuperar a sua senha nos próximos minutos."
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.check_spam", "Não se esqueça de verificar a pasta de spam.")}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" className="w-full" onClick={() => router.push("/auth/login")}>
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
            {t("auth.reset_password", "Recuperar Senha")}
          </CardTitle>
          <CardDescription className="text-center">
            {t(
              "auth.forgot_password_description",
              "Digite o seu email para receber um link de recuperação"
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="maria@exemplo.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner size="sm" className="mr-2" />}
              {t("auth.send_reset_link", "Enviar Link de Recuperação")}
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
