import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Palavra-passe atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "Nova palavra-passe deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Nova palavra-passe deve ter pelo menos uma maiúscula")
    .regex(/[a-z]/, "Nova palavra-passe deve ter pelo menos uma minúscula")
    .regex(/[0-9]/, "Nova palavra-passe deve ter pelo menos um número"),
});

/**
 * PATCH /api/users/me/password
 * Altera a palavra-passe do utilizador
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validation = passwordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { currentPassword, newPassword } = validation.data;

    // Buscar utilizador com password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
    }

    // Verificar se a palavra-passe atual está correta
    const isValid = await verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Palavra-passe atual incorreta" }, { status: 401 });
    }

    // Hash da nova palavra-passe
    const hashedPassword = await hashPassword(newPassword);

    // Atualizar palavra-passe
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Erro ao alterar palavra-passe" }, { status: 500 });
  }
}
