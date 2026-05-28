"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[#6b7f7c] text-base">
        algo salió mal. por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="text-sm text-[#3d8c87] underline underline-offset-2"
      >
        reintentar
      </button>
    </div>
  );
}
