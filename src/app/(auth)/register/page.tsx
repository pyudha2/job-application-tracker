"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return setError((await res.json()).error);
    await signIn("credentials", { ...body, redirect: false });
    router.push("/board");
  }

  return (
    <main className="mx-auto mt-24 grid max-w-sm gap-3 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Register</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8)"
          required
          minLength={8}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="btn">Register</button>
      </form>
      <Link href="/login" className="text-sm underline">
        Login
      </Link>
    </main>
  );
}
