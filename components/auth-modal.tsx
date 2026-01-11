"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        callbackUrl: window.location.href,
      });
    } catch {
      toast({
        title: t("common.error"),
        description: t("auth.magic_link_error"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t("common.error"),
        description: t("auth.email_placeholder"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: window.location.href,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setEmailSent(true);
      toast({
        title: t("auth.magic_link_sent"),
        description: t("auth.magic_link_sent_message"),
      });
    } catch {
      toast({
        title: t("common.error"),
        description: t("auth.magic_link_error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmailSent(false);
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("auth.login_modal_title")}</DialogTitle>
          <DialogDescription>
            {t("auth.login_modal_description")}
          </DialogDescription>
        </DialogHeader>

        {emailSent ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950">
              <p className="text-sm text-green-800 dark:text-green-200">
                {t("auth.magic_link_sent_message")}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full" variant="outline">
              {t("common.close")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("auth.sign_in_google")}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("auth.or")}
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("settings.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading
                  ? t("common.loading")
                  : t("auth.send_magic_link")}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
