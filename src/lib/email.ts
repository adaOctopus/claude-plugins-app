import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "coolplugz <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Milk Peach Clean wordmark as PNG — Gmail blocks web fonts, so we use an image. */
function emailBrandWordmarkHtml(heightPx = 30) {
  const wordmarkUrl = `${APP_URL}/email-wordmark.png`;
  return `<img src="${wordmarkUrl}" alt="coolplugz" height="${heightPx}" style="display: inline-block; vertical-align: -5px; border: 0; height: ${heightPx}px; width: auto;" />`;
}

function emailShellHtml(body: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="margin: 0; padding: 24px 16px; background: #F9F8F6;">
        ${body}
      </body>
    </html>
  `;
}

export type MagicLinkEmailResult = {
  success: true;
  dev?: boolean;
  verifyUrl?: string;
};

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  redirect?: string
): Promise<MagicLinkEmailResult> {
  const redirectParam = redirect
    ? `&redirect=${encodeURIComponent(redirect)}`
    : "";
  const verifyUrl = `${APP_URL}/api/auth/verify?token=${token}${redirectParam}`;

  if (!resend) {
    console.log("\n--- MAGIC LINK (dev mode) ---");
    console.log(`Email: ${email}`);
    console.log(`Link: ${verifyUrl}`);
    console.log("-----------------------------\n");
    return { success: true, dev: true, verifyUrl };
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Sign in to coolplugz",
    html: emailShellHtml(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2D2926; font-size: 28px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
          Continue to ${emailBrandWordmarkHtml(30)}
        </h1>
        <p style="color: #6B6661; font-size: 16px; line-height: 1.5;">Click the button below to verify your email. This link expires in 15 minutes.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #2D2926; color: #F9F8F6; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin: 16px 0; font-size: 16px;">
          Continue
        </a>
        <p style="color: #6B6661; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `),
  });

  return { success: true };
}

export async function sendPurchaseConfirmationEmail(
  email: string,
  pluginTitle: string
) {
  const installUrl = `${APP_URL}/install/context-engineer`;

  if (!resend) {
    console.log(`Purchase confirmation for ${email}: ${pluginTitle}`);
    return { success: true, dev: true };
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to coolplugz — ${pluginTitle}`,
    html: emailShellHtml(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2D2926; font-size: 28px; font-weight: 600; margin: 0 0 16px; line-height: 1.3;">
          Thank you for your purchase!
        </h1>
        <p style="color: #6B6661; font-size: 16px; line-height: 1.5;">
          Your ${emailBrandWordmarkHtml(20)} subscription is active. Add your CoolPlugz MCP URL to Claude and connect your tools.
        </p>
        <a href="${installUrl}" style="display: inline-block; background: #2D2926; color: #F9F8F6; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-size: 16px;">
          Get started
        </a>
      </div>
    `),
  });

  return { success: true };
}
