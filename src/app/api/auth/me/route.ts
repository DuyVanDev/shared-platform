import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  // cookies trong App Router đọc từ headers
  const cookieHeader = (req.headers as any).get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c: string) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const user = verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json({ user });
}
