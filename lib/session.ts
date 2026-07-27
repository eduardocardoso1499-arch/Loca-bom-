import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieOptions, verifySessionToken } from "@/lib/auth";

export async function getCurrentUser() {
  const token = cookies().get(sessionCookieOptions.name)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return null;

  const { password: _password, ...safeUser } = user;
  return safeUser;
}
