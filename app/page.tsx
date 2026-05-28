"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/chat");
          router.refresh();
        } else {
          setInfo("Revisa tu correo para confirmar la cuenta.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/chat");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message ?? "Algo salió mal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-5xl mb-2 text-center">un espacio para ti</h1>
        <p className="text-center text-muted text-xl mb-12">
          {mode === "signin" ? "bienvenido de vuelta" : "crea tu cuenta"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <input
              className="minimal-input"
              placeholder="¿cómo te llamas?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="minimal-input"
            type="email"
            placeholder="correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="minimal-input"
            type="password"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="text-sm text-red-700">{error}</p>}
          {info && <p className="text-sm text-muted">{info}</p>}

          <div className="flex justify-center pt-4">
            <button className="minimal-btn" disabled={loading}>
              {loading ? "..." : mode === "signin" ? "entrar" : "registrarse"}
            </button>
          </div>
        </form>

        <p className="text-center text-muted mt-10 text-lg">
          {mode === "signin" ? "¿primera vez aquí? " : "¿ya tienes cuenta? "}
          <span
            className="link"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
          >
            {mode === "signin" ? "regístrate" : "entra"}
          </span>
        </p>
      </div>
    </main>
  );
}
