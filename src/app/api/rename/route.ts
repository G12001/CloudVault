import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Folder from "@/app/models/Folder";
import File from "@/app/models/File";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, id, newName } = await req.json();
  if (type === "folder") {
    const folder = await Folder.findById(id);
    if (!folder || folder.userId !== session.user?.email) return NextResponse.json({ error: "Not found" }, { status: 404 });
    folder.name = newName;
    await folder.save();
    return NextResponse.json(folder);
  } else {
    const file = await File.findById(id);
    if (!file || file.userId !== session.user?.email) return NextResponse.json({ error: "Not found" }, { status: 404 });
    file.name = newName;
    await file.save();
    return NextResponse.json(file);
  }
}
