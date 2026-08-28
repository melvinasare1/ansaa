"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@ansaa/shared/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
          return;
        }
        window.history.replaceState(null, "", "/auth/callback");
        router.replace("/dashboard");
        router.refresh();
      })
      .catch(() => {
        setError("Could not start your dashboard session.");
      });
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6 text-ink-950">
      <p className="text-sm text-ink-700">{error ?? "Signing you in…"}</p>
    </main>
  );
}
