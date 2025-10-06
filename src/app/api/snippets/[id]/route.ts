import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Snippet from "@/models/Snippet";
import { verifyToken } from "@/lib/auth";
import { estimateTimeComplexity } from "@/lib/analyzer";
import "@/models/User";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  const by = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id };
  const snippet = await Snippet.findOne(by).populate("authorId", "name");

  if (!snippet)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!snippet.isPublic) {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];
    const user = await verifyToken(token as any);

    if (!user || user.id !== String(snippet.authorId._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json(snippet);
}

export async function PUT(req: Request, { params }: any) {
  const id = params.id;
  await dbConnect();

  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  const user = await verifyToken(token as any);

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snippet = await Snippet.findById(id);
  if (!snippet)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (String(snippet.authorId) !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();

  if (data.code) data.timeComplexity = estimateTimeComplexity(data.code);

  Object.assign(snippet, data);
  await snippet.save();

  const populatedSnippet = await Snippet.findById(snippet._id)
    .populate({
      path: "authorId",
      model: "User",
      select: "name email _id",
    })
    .lean();

  return NextResponse.json(populatedSnippet);
}

export async function DELETE(req: Request, { params }: any) {
  const id = params.id;
  await dbConnect();
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  const user = await verifyToken(token as string);
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
