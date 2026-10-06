"use client";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/authService";
import { setToken } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false); // blocks double clicks even before state updates

  async function onSubmit(e) {
    e.preventDefault();
    if (inFlight.current) return;
    if (!username.trim() || !password) return setError("Enter username and password");
    inFlight.current = true; setLoading(true); setError("");
    try {
      setToken(await login(username.trim(), password));
      router.replace(next && next.startsWith("/products") ? next : "/products");
    } catch (err) {
      setError(err.message === "Invalid credentials" ? "Wrong username or password" : err.message);
      inFlight.current = false; setLoading(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="mx-auto mt-24 w-full max-w-sm space-y-4 rounded bg-white p-6 shadow">
      <h1 className="text-xl font-bold">Admin login</h1>
      {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} suppressHydrationWarning />
      <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} suppressHydrationWarning />
      <button className="btn w-full" disabled={loading} suppressHydrationWarning>{loading ? "Logging in..." : "Login"}</button>
      <p className="text-xs text-gray-500">Demo: emilys / emilyspass</p>
    </form>
  );
}
export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }
