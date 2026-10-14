"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="ml-auto cursor-pointer"
      onClick={() =>
        confirm("Yakin mau logout?") && signOut({ callbackUrl: "/login" })
      }
    >
      Logout
    </button>
  );
}
