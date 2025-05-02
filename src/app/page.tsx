"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center">
        <p>...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Bienvenido</h1>
      <button type="button" onClick={() => router.push("/sign-in")}>
        Inicia sesión
      </button>
    </main>
  );
}