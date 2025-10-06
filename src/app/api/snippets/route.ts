import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Snippet from "@/models/Snippet";
import { verifyToken } from "@/lib/auth";
import "@/models/User";
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const tag = url.searchParams.get("tag");
    const language = url.searchParams.get("language");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "20");

    // Chỉ lấy snippet công khai
    const filter: any = { isPublic: true };
    if (q) filter.$text = { $search: q };
    if (tag) filter.topics = tag;
    if (language) filter.language = language;

    const skip = (page - 1) * limit;
    const total = await Snippet.countDocuments(filter);
    const snippets = await Snippet.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "name");
    return NextResponse.json({ total, page, limit, snippets });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const { title, code, language, topics, description, isPublic } =
    await req.json();

  const slug = generateSlug(title);

  const snippet = await Snippet.create({
    title,
    code,
    programmingLanguage: language,
    topics,
    slug,
    authorId: user.id,
    description,
    isPublic: typeof isPublic === "boolean" ? isPublic : true,
  });

  return NextResponse.json(snippet, { status: 201 });
}
