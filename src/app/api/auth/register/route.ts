import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = registerSchema.parse(body);

  const email = data.email.toLowerCase();
  const existing = await getPrisma().user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
  }

  const passwordHash = await hash(data.password, 12);

  const user = await getPrisma().user.create({
    data: {
      name: data.name,
      email,
      passwordHash
    },
    select: { id: true, name: true, email: true, role: true }
  });

  return NextResponse.json({ user }, { status: 201 });
}
