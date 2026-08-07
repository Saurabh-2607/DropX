import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");

    // Verify the user is requesting their own files
    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch files from database based on parentId
    let userFiles;
    if (parentId) {
      // Fetch files within a specific folder
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.parentId, parentId)))
        .orderBy(desc(files.createdAt));
    } else {
      // Fetch root-level files (where parentId is null)
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), isNull(files.parentId)))
        .orderBy(desc(files.createdAt));
    }

    return NextResponse.json(userFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, path, size, type, fileUrl, thumbnailUrl, parentId } = body;

    if (!name || !path || size === undefined || !type || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const fileData = {
      name,
      path,
      size,
      type,
      fileUrl,
      thumbnailUrl: thumbnailUrl || null,
      userId,
      parentId: parentId || null,
      isFolder: false,
      isStarred: false,
      isTrash: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [newFile] = await db.insert(files).values(fileData).returning();

    return NextResponse.json(newFile);
  } catch (error) {
    console.error("Error creating file record:", error);
    return NextResponse.json(
      { error: "Failed to create file record" },
      { status: 500 },
    );
  }
}
