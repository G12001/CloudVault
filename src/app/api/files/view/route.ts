import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import File from "@/app/models/File";
import { connectDB } from "@/lib/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
    Key: file.key,
  });

  // URL valid for 5 minutes
  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.json({ url });
}
