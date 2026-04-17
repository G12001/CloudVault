import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import File from "@/app/models/File";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const newFile = await File.create({
    name: data.name,
    key: data.key,
    size: data.size,
    url: data.url,
    folderId: data.folderId || null,
    userId: session.user?.email,
  });

  return NextResponse.json(newFile);
}
