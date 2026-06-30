import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "PlugsVille <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendMagicLinkEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify?token=${token}`;

  if (!resend) {
    console.log("\n--- MAGIC LINK (dev mode) ---");
    console.log(`Email: ${email}`);
    console.log(`Link: ${verifyUrl}`);
    console.log("-----------------------------\n");
    return { success: true, dev: true };
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Sign in to PlugsVille",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2D2926;">Sign in to PlugsVille</h1>
        <p style="color: #6B6661;">Click the button below to sign in. This link expires in 15 minutes.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #2D2926; color: #F9F8F6; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin: 16px 0;">
          Sign in
        </a>
        <p style="color: #6B6661; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return { success: true };
}

export async function sendPurchaseConfirmationEmail(
  email: string,
  pluginTitle: string
) {
  const installUrl = `${APP_URL}/install`;

  if (!resend) {
    console.log(`Purchase confirmation for ${email}: ${pluginTitle}`);
    return { success: true, dev: true };
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to PlugsVille — ${pluginTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2D2926;">Thank you for your purchase!</h1>
        <p style="color: #6B6661;">Your subscription is active. Follow the install guide to set up your Claude plugin.</p>
        <a href="${installUrl}" style="display: inline-block; background: #2D2926; color: #F9F8F6; padding: 12px 24px; border-radius: 9999px; text-decoration: none;">
          View install guide
        </a>
      </div>
    `,
  });

  return { success: true };
}
