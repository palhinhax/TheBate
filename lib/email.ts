/**
 * Email sending utilities
 * 
 * For production, integrate with:
 * - Resend: https://resend.com/docs/send-with-nextjs
 * - SendGrid: https://www.npmjs.com/package/@sendgrid/mail
 * - AWS SES: https://aws.amazon.com/ses/
 * 
 * For development, emails are logged to console
 */

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email
 * This is a placeholder implementation that logs to console
 * Replace with actual email provider in production
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // In production, replace with actual email provider
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM || 'noreply@example.com',
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.html || options.text,
  // });

  // For development: log email to console
  if (process.env.NODE_ENV === "development") {
    console.log("=".repeat(60));
    console.log("📧 Email to send:");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("-".repeat(60));
    console.log(options.text);
    console.log("=".repeat(60));
  } else {
    // In production, log a warning if no email provider is configured
    console.warn(
      "⚠️  Email sending not configured for production. Configure RESEND_API_KEY or another email provider."
    );
  }

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
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
