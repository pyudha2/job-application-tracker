import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app = await prisma.application.findFirst({
    where: { id, userId },
    include: { history: { orderBy: { createdAt: "desc" } } },
  });
  if (!app) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(app);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = applicationSchema.partial().safeParse(await req.json());
  if (!parsed.success)
    return Response.json({ error: "Invalid input" }, { status: 400 });

  const { id } = await params;
  const current = await prisma.application.findFirst({ where: { id, userId } });
  if (!current) return Response.json({ error: "Not found" }, { status: 404 });

  const { status } = parsed.data;
  const app = await prisma.application.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(status &&
        status !== current.status && { history: { create: { status } } }),
    },
  });
  return Response.json(app);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { count } = await prisma.application.deleteMany({
    where: { id, userId },
  });
  if (!count) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
