import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import File from "@/app/models/File";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId") || null;
  const files = await File.find({ userId: session.user?.email, folderId }).sort({ createdAt: -1 });

  return NextResponse.json(files);
}
