import { BRAND_WORDMARK_FAMILY } from "@/lib/brand-font";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "coolplugz <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const BRAND_WORDMARK_FONT_URL = `${APP_URL}/fonts/brand/milk-peach-clean.ttf`;
const BRAND_WORDMARK_COLOR = "#201721";

function emailBrandStyles() {
  return `
    <style>
      @font-face {
        font-family: '${BRAND_WORDMARK_FAMILY}';
        src: url('${BRAND_WORDMARK_FONT_URL}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      .email-brand-wordmark {
        font-family: '${BRAND_WORDMARK_FAMILY}', 'Segoe UI', system-ui, sans-serif;
        font-weight: 400;
        font-style: normal;
        color: ${BRAND_WORDMARK_COLOR};
        letter-spacing: -0.020em;
        line-height: 1.05;
      }
    </style>
  `;
}

function emailBrandWordmarkHtml(fontSize = "1em") {
  const inline = [
    `font-family: '${BRAND_WORDMARK_FAMILY}', 'Segoe UI', system-ui, sans-serif`,
    "font-weight: 400",
    "font-style: normal",
    `color: ${BRAND_WORDMARK_COLOR}`,
    "letter-spacing: -0.020em",
    "line-height: 1.05",
    `font-size: ${fontSize}`,
    "text-shadow: 0 1px 2px rgba(32, 23, 33, 0.14)",
  ].join("; ");

  return `<span class="email-brand-wordmark" style="${inline}">coolplugz</span>`;
}

function emailShellHtml(body: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${emailBrandStyles()}
      </head>
      <body style="margin: 0; padding: 24px 16px; background: #F9F8F6;">
        ${body}
      </body>
    </html>
  `;
}

function emailLogoHtml() {
  const logoUrl = `${APP_URL}/email.png`;
  return `<img src="${logoUrl}" alt="coolplugz" width="140" style="display: block; margin: 0 auto 24px; max-width: 140px; height: auto;" />`;
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
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        ${emailLogoHtml()}
        <h1 style="color: #2D2926; font-size: 28px; font-weight: 600; margin: 0 0 16px; line-height: 1.2;">
          Continue to ${emailBrandWordmarkHtml("28px")}
        </h1>
        <p style="color: #6B6661;">Click the button below to verify your email. This link expires in 15 minutes.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #2D2926; color: #F9F8F6; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin: 16px 0;">
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
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        ${emailLogoHtml()}
        <h1 style="color: #2D2926; font-size: 28px; font-weight: 600; margin: 0 0 16px; line-height: 1.2;">
          Thank you for your purchase!
        </h1>
        <p style="color: #6B6661;">
          Your ${emailBrandWordmarkHtml("1em")} subscription is active. Follow the install guide to set up your Claude plugin.
        </p>
        <a href="${installUrl}" style="display: inline-block; background: #2D2926; color: #F9F8F6; padding: 12px 24px; border-radius: 9999px; text-decoration: none;">
          View install guide
        </a>
      </div>
    `),
  });

  return { success: true };
}
