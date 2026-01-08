"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Plus, Shield } from "lucide-react";
import { LanguageSelector } from "./language-selector";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_no_bg.png"
            alt="Thebate"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSelector />
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
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  {session.user?.name || session.user?.username}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
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
      </div>
    </nav>
  );
}
