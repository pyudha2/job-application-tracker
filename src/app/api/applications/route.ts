import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  return Response.json(
    await prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
  );
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = applicationSchema.safeParse(await req.json());
  if (!parsed.success)
    return Response.json({ error: "Invalid input" }, { status: 400 });

  const status = parsed.data.status ?? "WISHLIST";
  const app = await prisma.application.create({
    data: { ...parsed.data, status, userId, history: { create: { status } } },
  });
  return Response.json(app, { status: 201 });
}
