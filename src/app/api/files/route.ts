import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import File from "@/app/models/File";
import { connectDB } from "@/lib/db";
import { log } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      log.warn("Unauthorized access attempt to files API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    log.file("create-metadata", data.name, session.user?.email!, {
      size: data.size,
      folderId: data.folderId,
    });

    const newFile = await File.create({
      name: data.name,
      key: data.key,
      size: data.size,
      url: data.url,
      folderId: data.folderId || null,
      userId: session.user?.email,
    });

    log.db("create", "files", {
      fileId: newFile._id,
      name: newFile.name,
    });

    return NextResponse.json(newFile);
  } catch (error) {
    log.error("Error creating file metadata", error);
    return NextResponse.json(
      { error: "Failed to create file metadata" },
      { status: 500 },
    );
  }
}
