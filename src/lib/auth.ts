import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User, type IUser } from "@/models/User";
import { MagicLinkToken } from "@/models/MagicLinkToken";

const SESSION_COOKIE = "projectx_session";
const TOKEN_EXPIRY_MINUTES = 15;
const SESSION_EXPIRY_DAYS = 30;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function verifyTokenHash(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}

export async function createMagicLink(email: string) {
  await connectDB();
  const normalizedEmail = email.toLowerCase().trim();
  const token = generateToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

  // Only the latest link should work — avoids stale emails and narrows verify lookup.
  await MagicLinkToken.updateMany(
    { email: normalizedEmail, usedAt: { $exists: false } },
    { $set: { usedAt: new Date() } }
  );

  await MagicLinkToken.create({
    email: normalizedEmail,
    tokenHash,
    expiresAt,
  });

  return { token, email: normalizedEmail };
}

export async function verifyMagicLink(token: string, email?: string) {
  await connectDB();
  const normalizedEmail = email?.toLowerCase().trim();
  const now = new Date();
  const query: {
    expiresAt: { $gt: Date };
    email?: string;
    $or: Array<{ usedAt: { $exists: false } } | { usedAt: { $gt: Date } }>;
  } = {
    expiresAt: { $gt: now },
    $or: [
      { usedAt: { $exists: false } },
      // Allow brief reuse for double-clicks / React Strict Mode / flaky networks.
      { usedAt: { $gt: new Date(now.getTime() - 60_000) } },
    ],
  };
  if (normalizedEmail) {
    query.email = normalizedEmail;
  }

  const tokens = await MagicLinkToken.find(query).sort({ createdAt: -1 }).limit(10);

  for (const record of tokens) {
    const valid = await verifyTokenHash(token, record.tokenHash);
    if (valid) {
      if (!record.usedAt) {
        record.usedAt = now;
        await record.save();
      }

      let user = await User.findOne({ email: record.email });
      if (!user) {
        user = await User.create({ email: record.email });
      }

      await createSession(user);
      return user;
    }
  }

  return null;
}

export async function createSession(user: IUser) {
  const token = await new SignJWT({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_DAYS}d`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    await connectDB();
    const user = await User.findById(payload.sub);
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      stripeCustomerId: user.stripeCustomerId,
    };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
