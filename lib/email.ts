/**
 * Email sending utilities
 * 
 * Uses Resend for production email delivery
 * For development, emails are logged to console
 */

import { Resend } from "resend";

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email using Resend
 * In development, logs to console instead
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // For development: log email to console
  if (process.env.NODE_ENV === "development") {
    console.log("=".repeat(60));
    console.log("📧 Email to send:");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("-".repeat(60));
    console.log(options.text);
    console.log("=".repeat(60));
    return;
  }

  // Production: Use Resend
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not configured");
    throw new Error("Email service not configured. Please set RESEND_API_KEY environment variable.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

  try {
    await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  locale: string = "pt"
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  const messages: Record<
    string,
    { subject: string; getText: (url: string) => string }
  > = {
    pt: {
      subject: "Recuperar Senha - TheBate",
      getText: (url: string) => `
Olá,

Recebemos um pedido para recuperar a sua senha.

Clique no link abaixo para criar uma nova senha:
${url}

Este link expira em 15 minutos.

Se não foi você que solicitou esta recuperação, pode ignorar este email.

Atenciosamente,
Equipa TheBate
      `.trim(),
    },
    en: {
      subject: "Password Reset - TheBate",
      getText: (url: string) => `
Hello,

We received a request to reset your password.

Click the link below to create a new password:
${url}

This link expires in 15 minutes.

If you didn't request this reset, you can safely ignore this email.

Best regards,
TheBate Team
      `.trim(),
    },
    es: {
      subject: "Recuperar Contraseña - TheBate",
      getText: (url: string) => `
Hola,

Recibimos una solicitud para recuperar tu contraseña.

Haz clic en el enlace a continuación para crear una nueva contraseña:
${url}

Este enlace expira en 15 minutos.

Si no solicitaste esta recuperación, puedes ignorar este correo.

Saludos,
Equipo TheBate
      `.trim(),
    },
  };

  const message = messages[locale] || messages.pt;

  await sendEmail({
    to: email,
    subject: message.subject,
    text: message.getText(resetUrl),
  });
}
