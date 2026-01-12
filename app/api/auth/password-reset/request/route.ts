import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateResetToken, hashToken } from "@/lib/password";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const requestSchema = z.object({
  email: z.string().email("Email inválido"),
});

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Rate limit by IP: 10 requests per minute
    const ipRateLimit = checkRateLimit(`password-reset-ip:${clientIp}`, {
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

    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Rate limit by email: 3 requests per 10 minutes
    // Check email rate limit first to ensure consistent rate limiting
    const emailRateLimit = checkRateLimit(`password-reset-email:${email}`, {
      maxAttempts: 3,
      windowMs: 10 * 60 * 1000, // 10 minutes
    });

    if (!emailRateLimit.success) {
      // Still count against IP rate limit even when email limit is hit
      // This prevents abuse through different emails from same IP
      // Return success to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: "Se o email existir, receberá um link para recuperar a senha.",
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Always return success to prevent user enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Se o email existir, receberá um link para recuperar a senha.",
      });
    }

    // Generate reset token
    const rawToken = generateResetToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Send email with reset link
    try {
      await sendPasswordResetEmail(user.email, rawToken);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      // Don't reveal email sending failure to prevent user enumeration
    }

    return NextResponse.json({
      success: true,
      message: "Se o email existir, receberá um link para recuperar a senha.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
