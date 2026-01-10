import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100).optional(),
  username: z
    .string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username só pode conter letras, números e underscore"
    )
    .optional(),
  email: z.string().email("Email inválido").optional(),
  preferredLanguage: z.enum(["pt", "en", "es", "fr", "de"]).optional(),
  preferredContentLanguages: z
    .array(z.enum(["pt", "en", "es", "fr", "de"]))
    .optional(),
});

/**
 * PATCH /api/users/me/profile
 * Atualiza informações do perfil do utilizador
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, username, email } = validation.data;
    const preferredLanguage = validation.data.preferredLanguage;
    const preferredContentLanguages = validation.data.preferredContentLanguages;

    // Get current user data to check what actually changed
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Utilizador não encontrado" },
        { status: 404 }
      );
    }

    // Only validate username if it's actually being changed
    if (username && username !== currentUser.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: "Username já está em uso" },
          { status: 400 }
        );
      }
    }

    // Only validate email if it's actually being changed
    if (email && email !== currentUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email já está em uso" },
          { status: 400 }
        );
      }
    }

    // Atualizar utilizador
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(email && { email }),
        ...(preferredLanguage && { preferredLanguage }),
        ...(preferredContentLanguages && { preferredContentLanguages }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        preferredLanguage: true,
        preferredContentLanguages: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
