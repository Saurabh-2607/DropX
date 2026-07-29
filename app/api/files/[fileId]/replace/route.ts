import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get the existing file record
    const [existingFile] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const originalFilename = file.name || existingFile.name;
    const fileExtension = originalFilename.split(".").pop()?.toLowerCase() || "";
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const folderPath = existingFile.parentId
      ? `/DropX/${userId}/folders/${existingFile.parentId}`
      : `/DropX/${userId}`;

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFilename,
      folder: folderPath,
      useUniqueFileName: false,
    });

    const fileData = {
      path: uploadResponse.filePath,
      size: file.size,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      updatedAt: new Date(),
    };

    const [updatedFile] = await db
      .update(files)
      .set(fileData)
      .where(eq(files.id, fileId))
      .returning();

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("Error replacing file:", error);
    return NextResponse.json(
      { error: "Failed to replace file" },
      { status: 500 }
    );
  }
}
