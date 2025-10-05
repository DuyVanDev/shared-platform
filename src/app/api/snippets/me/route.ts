import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Snippet from "@/models/Snippet";
import { verifyToken } from "@/lib/auth";
import "@/models/User";
export async function GET(req: Request) {
  await dbConnect();

  // Lấy token từ cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("token=")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Lấy các snippet của user đã đăng nhập
    const snippets = await Snippet.find({ authorId: user.id })
      .sort({
        createdAt: -1,
      })
      .populate("authorId", "name");

    return NextResponse.json({ snippets });
  } catch (error) {
    console.error("Error fetching user snippets:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
