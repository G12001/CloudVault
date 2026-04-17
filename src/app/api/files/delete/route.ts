import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import File from "@/app/models/File";
import { connectDB } from "@/lib/db";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { log } from "@/lib/logger";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const file = await File.findById(id);
  if (!file || file.userId !== session.user?.email)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // delete from s3
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
        Key: file.key,
      }),
    );
  } catch (err) {
    console.error("S3 delete error", err);
    // continue to remove metadata even if S3 delete fails optionally
  }

  await File.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
