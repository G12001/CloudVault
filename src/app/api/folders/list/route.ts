import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Folder from "@/app/models/Folder";
import { connectDB } from "@/lib/db";


export async function GET(req: Request) {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId") || null;

  const folders = await Folder.find({
    userId: session.user?.email,
    parentId,
  }).sort({ createdAt: 1 });

  return NextResponse.json(folders);
}
