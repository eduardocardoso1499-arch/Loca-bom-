import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSessionToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, phone, city } = body ?? {};

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nome, e-mail e senha são obrigatórios." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "A senha deve ter pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Já existe uma conta com este e-mail." },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      phone: phone || null,
      city: city || null,
    },
  });

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
