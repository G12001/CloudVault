import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Folder from "@/app/models/Folder";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  const folder = await Folder.findById(id);
  if (!folder || folder.userId !== session.user?.email)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Folder.findByIdAndDelete(id);

  return NextResponse.json(folder);
}
