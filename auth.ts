import { cookies } from "next/headers";
import * as jose from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "bkmsfx-super-secret-key-2026-platform";
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

// Password hashing helpers
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token operations
export async function encrypt(payload: SessionUser): Promise<string> {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jose.jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionUser;
  } catch (error) {
    return null;
  }
}

// Set auth cookie
export async function loginSession(user: SessionUser) {
  const token = await encrypt(user);
  const cookieStore = await cookies();
  cookieStore.set("bkmsfx_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Clear auth cookie
export async function logoutSession() {
  const cookieStore = await cookies();
  cookieStore.delete("bkmsfx_session");
}

// Retrieve current logged in user from cookies (Server Components / Actions)
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bkmsfx_session")?.value;
    if (!token) return null;
    return await decrypt(token);
  } catch (error) {
    return null;
  }
}

// Role authorization checks
export function hasRole(user: SessionUser | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  if (user.role === "SUPERADMIN") return true; // Superadmin bypassed all checks
  return allowedRoles.includes(user.role);
}
