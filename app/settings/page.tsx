"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";
import {
  User,
  Lock,
  AlertTriangle,
  Settings as SettingsIcon,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

type TabType = "profile" | "security" | "preferences" | "account";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslations();

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    email: "",
    preferredLanguage: "pt",
  });

  // Content languages state
  const [preferredContentLanguages, setPreferredContentLanguages] = useState<
    string[]
  >(["pt", "en", "es", "fr", "de"]);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user) {
      setProfileForm({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        preferredLanguage: session.user.preferredLanguage || "pt",
      });
      setPreferredContentLanguages(
        session.user.preferredContentLanguages || ["pt", "en", "es", "fr", "de"]
      );
    }
  }, [status, session, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/users/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        toast({
          title: t("settings.changes_saved"),
        });
        // Recarregar sessão para atualizar dados
        window.location.reload();
      } else {
        const data = await response.json();
        toast({
          title: t("settings.changes_error"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: t("settings.changes_error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t("settings.password_mismatch"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: t("settings.password_changed"),
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        toast({
          title: t("settings.password_change_error"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: t("settings.password_change_error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: t("profile.delete_account_success"),
        });
        await signOut({ redirect: false });
        router.push("/");
      } else {
        toast({
          title: t("profile.delete_account_error"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: t("profile.delete_account_error"),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    if (preferredContentLanguages.includes(lang)) {
      // Don't allow removing the last language
      if (preferredContentLanguages.length > 1) {
        setPreferredContentLanguages(
          preferredContentLanguages.filter((l) => l !== lang)
        );
      }
    } else {
      setPreferredContentLanguages([...preferredContentLanguages, lang]);
    }
  };

  const handleContentLanguagesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/users/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredContentLanguages,
        }),
      });

      if (response.ok) {
        toast({
          title: t("settings.changes_saved"),
        });
        // Recarregar sessão para atualizar dados
        window.location.reload();
      } else {
        const data = await response.json();
        toast({
          title: t("settings.changes_error"),
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Content languages update error:", error);
      toast({
        title: t("settings.changes_error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className={`rounded-b-none ${activeTab === "profile" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              {t("settings.profile_tab")}
            </Button>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              className={`rounded-b-none ${activeTab === "security" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Lock className="mr-2 h-4 w-4" />
              {t("settings.security_tab")}
            </Button>
            <Button
              variant={activeTab === "preferences" ? "default" : "ghost"}
              className={`rounded-b-none ${activeTab === "preferences" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <Globe className="mr-2 h-4 w-4" />
              {t("settings.preferences_tab")}
            </Button>
            <Button
              variant={activeTab === "account" ? "default" : "ghost"}
              className={`rounded-b-none ${activeTab === "account" ? "border-b-2 border-primary" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {t("settings.account_tab")}
            </Button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile_info")}</CardTitle>
              <CardDescription>
                {t("settings.profile_info_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.name")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("settings.name_placeholder")}
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{t("settings.username")}</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("settings.username_placeholder")}
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        username: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("settings.email_placeholder")}
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? t("settings.saving") : t("settings.save_changes")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.password_settings")}</CardTitle>
              <CardDescription>
                {t("settings.password_settings_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    {t("settings.current_password")}
                  </Label>
                  <PasswordInput
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    {t("settings.new_password")}
                  </Label>
                  <PasswordInput
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t("settings.confirm_new_password")}
                  </Label>
                  <PasswordInput
                    id="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading
                    ? t("settings.saving")
                    : t("settings.change_password")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            {/* UI Language */}
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.ui_language")}</CardTitle>
                <CardDescription>
                  {t("settings.ui_language_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">
                      {t("settings.ui_language")}
                    </Label>
                    <select
                      id="preferredLanguage"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={profileForm.preferredLanguage}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          preferredLanguage: e.target.value,
                        })
                      }
                    >
                      <option value="pt">🇵🇹 Português</option>
                      <option value="en">🇬🇧 English</option>
                      <option value="es">🇪🇸 Español</option>
                      <option value="fr">🇫🇷 Français</option>
                      <option value="de">🇩🇪 Deutsch</option>
                    </select>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.ui_language_description")}
                    </p>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading
                      ? t("settings.saving")
                      : t("settings.save_changes")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Content Languages */}
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.content_language")}</CardTitle>
                <CardDescription>
                  {t("settings.content_language_description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleContentLanguagesSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={preferredContentLanguages.includes("pt")}
                          onChange={() => handleLanguageToggle("pt")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-2xl">🇵🇹</span>
                        <span className="flex-1">Português</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={preferredContentLanguages.includes("en")}
                          onChange={() => handleLanguageToggle("en")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-2xl">🇬🇧</span>
                        <span className="flex-1">English</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={preferredContentLanguages.includes("es")}
                          onChange={() => handleLanguageToggle("es")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-2xl">🇪🇸</span>
                        <span className="flex-1">Español</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={preferredContentLanguages.includes("fr")}
                          onChange={() => handleLanguageToggle("fr")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-2xl">🇫🇷</span>
                        <span className="flex-1">Français</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={preferredContentLanguages.includes("de")}
                          onChange={() => handleLanguageToggle("de")}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-2xl">🇩🇪</span>
                        <span className="flex-1">Deutsch</span>
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.content_language_description")}
                    </p>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading
                      ? t("settings.saving")
                      : t("settings.save_changes")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                {t("settings.danger_zone")}
              </CardTitle>
              <CardDescription>
                {t("settings.danger_zone_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <h3 className="mb-2 font-semibold text-destructive">
                    {t("settings.delete_account_title")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("settings.delete_account_description")}
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {t("profile.delete_account")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("profile.delete_account")}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {t("profile.delete_account_confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              {t("topics.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {t("profile.delete_account")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
