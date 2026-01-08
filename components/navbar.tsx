"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Plus } from "lucide-react";
import { LanguageSelector } from "./language-selector";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Thebate
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          {session ? (
            <>
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
