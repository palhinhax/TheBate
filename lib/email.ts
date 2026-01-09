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
    throw new Error(
      "Email service not configured. Please set RESEND_API_KEY environment variable."
    );
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
      getText: (url: string) =>
        `
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
      getText: (url: string) =>
        `
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
      getText: (url: string) =>
        `
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

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(
  email: string,
  token: string,
  locale: string = "pt"
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  const messages: Record<
    string,
    { subject: string; getText: (url: string) => string }
  > = {
    pt: {
      subject: "Verificar Email - TheBate",
      getText: (url: string) =>
        `
Olá,

Bem-vindo ao TheBate! Para completar o seu registo, precisa verificar o seu email.

Clique no link abaixo para confirmar o seu email:
${url}

Este link expira em 24 horas.

Se não foi você que se registou, pode ignorar este email.

Atenciosamente,
Equipa TheBate
      `.trim(),
    },
    en: {
      subject: "Verify Email - TheBate",
      getText: (url: string) =>
        `
Hello,

Welcome to TheBate! To complete your registration, you need to verify your email.

Click the link below to confirm your email:
${url}

This link expires in 24 hours.

If you didn't sign up for TheBate, you can safely ignore this email.

Best regards,
TheBate Team
      `.trim(),
    },
    es: {
      subject: "Verificar Email - TheBate",
      getText: (url: string) =>
        `
Hola,

¡Bienvenido a TheBate! Para completar tu registro, necesitas verificar tu email.

Haz clic en el enlace a continuación para confirmar tu email:
${url}

Este enlace expira en 24 horas.

Si no te registraste en TheBate, puedes ignorar este correo.

Saludos,
Equipo TheBate
      `.trim(),
    },
    fr: {
      subject: "Vérifier Email - TheBate",
      getText: (url: string) =>
        `
Bonjour,

Bienvenue sur TheBate ! Pour terminer votre inscription, vous devez vérifier votre adresse e-mail.

Cliquez sur le lien ci-dessous pour confirmer votre email :
${url}

Ce lien expire dans 24 heures.

Si vous ne vous êtes pas inscrit sur TheBate, vous pouvez ignorer cet e-mail.

Cordialement,
Équipe TheBate
      `.trim(),
    },
    de: {
      subject: "E-Mail verifizieren - TheBate",
      getText: (url: string) =>
        `
Hallo,

Willkommen bei TheBate! Um die Registrierung abzuschließen, müssen Sie Ihre E-Mail verifizieren.

Klicken Sie auf den folgenden Link, um Ihre E-Mail zu bestätigen:
${url}

Dieser Link verfällt in 24 Stunden.

Falls Sie sich nicht bei TheBate registriert haben, können Sie diese E-Mail ignorieren.

Mit freundlichen Grüßen,
TheBate Team
      `.trim(),
    },
    pt_BR: {
      subject: "Verificar Email - TheBate",
      getText: (url: string) =>
        `
Olá,

Bem-vindo ao TheBate! Para completar seu cadastro, você precisa verificar seu email.

Clique no link abaixo para confirmar seu email:
${url}

Este link expira em 24 horas.

Se você não se cadastrou no TheBate, pode ignorar este email.

Atenciosamente,
Time TheBate
      `.trim(),
    },
  };

  const message = messages[locale] || messages.pt;

  await sendEmail({
    to: email,
    subject: message.subject,
    text: message.getText(verifyUrl),
  });
}
