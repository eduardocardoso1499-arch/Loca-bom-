import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signSessionToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Informe e-mail e senha." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json(
      { error: "E-mail ou senha inválidos." },
      { status: 401 }
    );
  }

  const token = signSessionToken(user.id);
  const res = NextResponse.json({ id: user.id, name: user.name, email: user.email });
  res.cookies.set(sessionCookieOptions.name, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: sessionCookieOptions.maxAge,
  });
  return res;
}
