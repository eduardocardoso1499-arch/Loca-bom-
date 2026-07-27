import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const SESSION_COOKIE = "equipshare_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: SESSION_MAX_AGE_SECONDS });
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  maxAge: SESSION_MAX_AGE_SECONDS,
};
