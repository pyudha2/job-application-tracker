import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QueryProvider from "@/providers/QueryProvider";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getServerSession(authOptions))) redirect("/login");

  return (
    <QueryProvider>
      <nav className="flex gap-4 border-b bg-white px-6 py-3 text-sm">
        <Link href="/board">Board</Link>
        <LogoutButton />
      </nav>
      <main className="p-6">{children}</main>
    </QueryProvider>
  );
}
