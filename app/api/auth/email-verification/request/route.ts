import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateResetToken, hashToken } from "@/lib/password";
import { sendEmailVerificationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Rate limit by IP: 10 requests per minute
    const ipRateLimit = checkRateLimit(`email-verification-ip:${clientIp}`, {
      maxAttempts: 10,
      windowMs: 60 * 1000, // 1 minute
    });

    if (!ipRateLimit.success) {
      return NextResponse.json(
        {
          message: "Muitas tentativas. Tente novamente mais tarde.",
          retryAfter: Math.ceil((ipRateLimit.resetAt - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Get user from session
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const userId = sessionUser.id;

    // Rate limit by user: 3 requests per 10 minutes
    const userRateLimit = checkRateLimit(`email-verification-user:${userId}`, {
      maxAttempts: 3,
      windowMs: 10 * 60 * 1000, // 10 minutes
    });

    if (!userRateLimit.success) {
      return NextResponse.json(
        {
          message: "Muitas tentativas. Tente novamente mais tarde.",
          retryAfter: Math.ceil((userRateLimit.resetAt - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilizador não encontrado" },
        { status: 404 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email já verificado" },
        { status: 400 }
      );
    }

    // Delete any existing unverified tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    // Generate verification token
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

    // Send email with verification link
    try {
      // Get user's preferred language from somewhere - for now default to 'pt'
      const locale = "pt";
      await sendEmailVerificationEmail(user.email, rawToken, locale);
    } catch (error) {
      console.error("Failed to send email verification:", error);
      // Delete the token if email sending fails
      await prisma.emailVerificationToken.delete({
        where: { tokenHash },
      });
      return NextResponse.json(
        { message: "Erro ao enviar email de verificação" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email de verificação enviado com sucesso",
    });
  } catch (error) {
    console.error("Email verification request error:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
