"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
export default function Header() {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow">
      <Link href="/products" className="font-bold">Product Admin</Link>
      <button className="btn-light" onClick={() => { clearToken(); router.replace("/login"); }}>Logout</button>
    </header>
  );
}
