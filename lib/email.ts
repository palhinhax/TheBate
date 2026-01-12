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

  const messages: Record<string, { subject: string; getText: (url: string) => string }> = {
    pt: {
      subject: "Recuperar Palavra-passe - TheBatee",
      getText: (url: string) =>
        `
Olá,

Recebemos um pedido para recuperar a sua palavra-passe.

Clique no link abaixo para criar uma nova palavra-passe:
${url}

Este link expira em 15 minutos.

Se não foi o utilizador que solicitou esta recuperação, pode ignorar este email.

Atenciosamente,
Equipa TheBatee
      `.trim(),
    },
    en: {
      subject: "Password Reset - TheBatee",
      getText: (url: string) =>
        `
Hello,

We received a request to reset your password.

Click the link below to create a new password:
${url}

This link expires in 15 minutes.

If you didn't request this reset, you can safely ignore this email.

Best regards,
TheBatee Team
      `.trim(),
    },
    es: {
      subject: "Recuperar Contraseña - TheBatee",
      getText: (url: string) =>
        `
Hola,

Recibimos una solicitud para recuperar tu contraseña.

Haz clic en el enlace a continuación para crear una nueva contraseña:
${url}

Este enlace expira en 15 minutos.

Si no solicitaste esta recuperación, puedes ignorar este correo.

Saludos,
Equipo TheBatee
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

  const messages: Record<string, { subject: string; getText: (url: string) => string }> = {
    pt: {
      subject: "Verificar Email - TheBate",
      getText: (url: string) =>
        `
Olá,

Bem-vindo ao TheBate! Para completar o seu registo, precisa de verificar o seu email.

Clique no link abaixo para confirmar o seu email:
${url}

Este link expira em 24 horas.

Se não foi o utilizador que se registou, pode ignorar este email.

Atenciosamente,
Equipa TheBate
      `.trim(),
    },
    en: {
      subject: "Verify Email - TheBate",
      getText: (url: string) =>
        `
Hello,

Welcome to TheBatee! To complete your registration, you need to verify your email.

Click the link below to verify your email:
${url}

This link expires in 24 hours.

If you didn't sign up for TheBatee, you can safely ignore this email.

Best regards,
TheBatee Team
      `.trim(),
    },
    es: {
      subject: "Verificar Email - TheBatee",
      getText: (url: string) =>
        `
Hola,

¡Bienvenido a TheBatee! Para completar tu registro, necesitas verificar tu email.

Haz clic en el enlace a continuación para verificar tu email:
${url}

Este enlace expira en 24 horas.

Si no te registraste en TheBatee, puedes ignorar este correo.

Saludos,
Equipo TheBatee
      `.trim(),
    },
    fr: {
      subject: "Vérifier Email - TheBatee",
      getText: (url: string) =>
        `
Bonjour,

Bienvenue sur TheBatee ! Pour terminer votre inscription, vous devez vérifier votre adresse e-mail.

Cliquez sur le lien ci-dessous pour confirmer votre email :
${url}

Ce lien expire dans 24 heures.

Si vous ne vous êtes pas inscrit sur TheBatee, vous pouvez ignorer cet e-mail.

Cordialement,
Équipe TheBatee
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
  };

  const message = messages[locale] || messages.pt;

  await sendEmail({
    to: email,
    subject: message.subject,
    text: message.getText(verifyUrl),
  });
}

/**
 * Send magic link login email
 */
export async function sendMagicLinkEmail(
  email: string,
  url: string,
  locale: string = "pt"
): Promise<void> {
  const messages: Record<
    string,
    { subject: string; getText: (url: string) => string; getHtml: (url: string) => string }
  > = {
    pt: {
      subject: "Entrar no TheBate",
      getText: (url: string) =>
        `
Olá,

Clique no link abaixo para entrar no TheBate:

${url}

Se não foi o utilizador que solicitou este acesso, pode ignorar este email com segurança.

Atenciosamente,
Equipa TheBate
      `.trim(),
      getHtml: (url: string) =>
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Entrar no TheBate</h2>
    <p>Olá,</p>
    <p>Clique no botão abaixo para entrar no TheBate:</p>
    <a href="${url}" class="button">Entrar</a>
    <p>Ou copie e cole este link no seu navegador:</p>
    <p style="word-break: break-all; color: #666;">${url}</p>
    <div class="footer">
      <p>Se não foi o utilizador que solicitou este acesso, pode ignorar este email com segurança.</p>
      <p>Atenciosamente,<br>Equipa TheBate</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    },
    en: {
      subject: "Sign in to TheBate",
      getText: (url: string) =>
        `
Hello,

Click the link below to sign in to TheBate:

${url}

If you didn't request this, you can safely ignore this email.

Best regards,
TheBate Team
      `.trim(),
      getHtml: (url: string) =>
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Sign in to TheBate</h2>
    <p>Hello,</p>
    <p>Click the button below to sign in to TheBate:</p>
    <a href="${url}" class="button">Sign In</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;">${url}</p>
    <div class="footer">
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Best regards,<br>TheBate Team</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    },
    es: {
      subject: "Entrar en TheBate",
      getText: (url: string) =>
        `
Hola,

Haz clic en el enlace a continuación para entrar en TheBate:

${url}

Si no solicitaste esto, puedes ignorar este correo con seguridad.

Saludos,
Equipo TheBate
      `.trim(),
      getHtml: (url: string) =>
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Entrar en TheBate</h2>
    <p>Hola,</p>
    <p>Haz clic en el botón a continuación para entrar en TheBate:</p>
    <a href="${url}" class="button">Entrar</a>
    <p>O copia y pega este enlace en tu navegador:</p>
    <p style="word-break: break-all; color: #666;">${url}</p>
    <div class="footer">
      <p>Si no solicitaste esto, puedes ignorar este correo con seguridad.</p>
      <p>Saludos,<br>Equipo TheBate</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    },
    fr: {
      subject: "Se connecter à TheBate",
      getText: (url: string) =>
        `
Bonjour,

Cliquez sur le lien ci-dessous pour vous connecter à TheBate :

${url}

Si vous n'avez pas demandé cela, vous pouvez ignorer cet e-mail en toute sécurité.

Cordialement,
Équipe TheBate
      `.trim(),
      getHtml: (url: string) =>
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Se connecter à TheBate</h2>
    <p>Bonjour,</p>
    <p>Cliquez sur le bouton ci-dessous pour vous connecter à TheBate :</p>
    <a href="${url}" class="button">Se connecter</a>
    <p>Ou copiez et collez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #666;">${url}</p>
    <div class="footer">
      <p>Si vous n'avez pas demandé cela, vous pouvez ignorer cet e-mail en toute sécurité.</p>
      <p>Cordialement,<br>Équipe TheBate</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    },
    de: {
      subject: "Bei TheBate anmelden",
      getText: (url: string) =>
        `
Hallo,

Klicken Sie auf den folgenden Link, um sich bei TheBate anzumelden:

${url}

Falls Sie dies nicht angefordert haben, können Sie diese E-Mail sicher ignorieren.

Mit freundlichen Grüßen,
TheBate Team
      `.trim(),
      getHtml: (url: string) =>
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Bei TheBate anmelden</h2>
    <p>Hallo,</p>
    <p>Klicken Sie auf die Schaltfläche unten, um sich bei TheBate anzumelden:</p>
    <a href="${url}" class="button">Anmelden</a>
    <p>Oder kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:</p>
    <p style="word-break: break-all; color: #666;">${url}</p>
    <div class="footer">
      <p>Falls Sie dies nicht angefordert haben, können Sie diese E-Mail sicher ignorieren.</p>
      <p>Mit freundlichen Grüßen,<br>TheBate Team</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    },
  };

  const message = messages[locale] || messages.pt;

  await sendEmail({
    to: email,
    subject: message.subject,
    text: message.getText(url),
    html: message.getHtml(url),
  });
}
