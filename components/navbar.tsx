"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Plus, Shield, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo_no_bg.png"
              alt="TheBatee"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 xl:flex">
            {session ? (
              <>
                {session.user?.isOwner && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Painel Owner
                    </Button>
                  </Link>
                )}
                <Link href="/new">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Tema
                  </Button>
                </Link>
                <Link href={`/u/${session.user?.username}`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || session.user.username || "User"}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="max-w-[100px] truncate">
                      {session.user?.name || session.user?.username}
                    </span>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Registrar</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t py-4 xl:hidden">
            <div className="flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/new" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Tema
                    </Button>
                  </Link>
                  {session.user?.isOwner && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Painel Owner
                      </Button>
                    </Link>
                  )}
                  <Link
                    href={`/u/${session.user?.username}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || session.user.username || "User"}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {session.user?.name || session.user?.username}
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start">
                      Registrar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
