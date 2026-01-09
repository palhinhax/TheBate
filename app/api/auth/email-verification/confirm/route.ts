import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/password";

const confirmSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = confirmSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token } = result.data;

    // Hash the token to find it in database
    const tokenHash = hashToken(token);

    // Find the verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Check if token exists, is expired, or has been used
    // Use same error message for all cases to prevent token enumeration
    if (
      !verificationToken ||
      verificationToken.expiresAt < new Date() ||
      verificationToken.usedAt
    ) {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    // Mark email as verified and mark token as used in a transaction
    await prisma.$transaction([
      // Update user email verified
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() },
      }),
      // Mark token as used
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      }),
      // Delete all other verification tokens for this user
      prisma.emailVerificationToken.deleteMany({
        where: {
          userId: verificationToken.userId,
          id: { not: verificationToken.id },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Email verificado com sucesso",
    });
  } catch (error) {
    console.error("Email verification confirm error:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
