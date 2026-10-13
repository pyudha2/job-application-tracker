import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json());
  if (!parsed.success)
    return Response.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, password } = parsed.data;
  if (await prisma.user.findUnique({ where: { email } })) {
    return Response.json({ error: "Email already used" }, { status: 409 });
  }

  await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  });
  return Response.json({ ok: true }, { status: 201 });
}
