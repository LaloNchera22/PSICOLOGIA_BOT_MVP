import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `Eres un asistente de acompañamiento emocional con enfoque psicológico.
Tu rol es escuchar con empatía, validar emociones y ofrecer reflexiones suaves basadas en
principios de terapia cognitivo-conductual y escucha activa. NO eres un sustituto de un
profesional. Si detectas señales de crisis (ideación suicida, violencia, abuso), recomienda
buscar ayuda profesional inmediata y comparte recursos de emergencia. Responde siempre en
español, en tono cálido, breve y humano. Haz preguntas abiertas cuando sea apropiado.`;

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "invalid message" }, { status: 400 });
  }

  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(40);

  const { data: userInsert, error: userErr } = await supabase
    .from("messages")
    .insert({ user_id: user.id, role: "user", content: message })
    .select("id")
    .single();
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 500 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "missing api key" }, { status: 500 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const contents = (history ?? []).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: contents });

  let reply = "";
  try {
    const result = await chat.sendMessage(message);
    reply = result.response.text();
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "gemini error" }, { status: 500 });
  }

  const { data: asstInsert, error: asstErr } = await supabase
    .from("messages")
    .insert({ user_id: user.id, role: "assistant", content: reply })
    .select("id")
    .single();
  if (asstErr) return NextResponse.json({ error: asstErr.message }, { status: 500 });

  return NextResponse.json({
    reply,
    userMessageId: userInsert.id,
    assistantMessageId: asstInsert.id,
  });
}
