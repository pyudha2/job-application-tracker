"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: f.get("email"),
      password: f.get("password"),
      redirect: false,
    });
    if (res?.error) return setError("Email atau password salah");
    router.push("/board");
  }

  return (
    <main className="mx-auto mt-24 grid max-w-sm gap-3 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="btn">Login</button>
      </form>
      <Link href="/register" className="text-sm underline">
        Register
      </Link>
    </main>
  );
}
