import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Snippet from "@/models/Snippet";
import { verifyToken } from "@/lib/auth";
import { estimateTimeComplexity } from "@/lib/analyzer";
import "@/models/User"
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
   const { id } = await context.params; // ✅ chờ params resolve
  console.log("Fetching snippet id:", id);
  // allow fetch by slug or id: detect if contains non-objectid -> treat as slug
  const by = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id };
  const snippet = await Snippet.findOne(by).populate("authorId", "name");
  if (!snippet)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  // if snippet private and requester not owner -> 403
  if (!snippet.isPublic) {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split(";").find(Boolean)?.split("token=")?.[1];
    const user = await verifyToken(token);
    if (!user || user.id !== String(snippet.authorId._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  return NextResponse.json(snippet);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  const user = await verifyToken(token);

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snippet = await Snippet.findById(id);
  if (!snippet)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (String(snippet.authorId) !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();
  if (data.code) data.timeComplexity = estimateTimeComplexity(data.code);
  if (data.title && data.title !== snippet.title) {
    // Optionally update slug if title changed:
    // data.slug = makeSlug(data.title)
  }
  Object.assign(snippet, data);
  await snippet.save();
  return NextResponse.json(snippet);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const id = params.id;
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  const user = await verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snippet = await Snippet.findById(id);
  if (!snippet)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (String(snippet.authorId) !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await Snippet.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
