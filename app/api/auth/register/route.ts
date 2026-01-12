import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateResetToken, hashToken } from "@/lib/password";
import { sendEmailVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .max(30, "O username não pode ter mais de 30 caracteres")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username só pode conter letras, números, underscore e ponto"
    ),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, username, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "Este email já está em uso" },
          { status: 409 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { message: "Este username já está em uso" },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate and send email verification token
    try {
      const rawToken = generateResetToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store token in database
      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      // Send verification email
      // TODO: Get user's preferred language from request or browser
      const locale = "pt";
      await sendEmailVerificationEmail(user.email, rawToken, locale);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails - user can resend later
    }

    return NextResponse.json(
      {
        ...user,
        message:
          "Registo concluído! Verifique o seu email para confirmar a conta.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
