import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.topic.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin topic delete error:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { status, clearReports } = body;

    const updateData: Prisma.TopicUpdateInput = {};
    if (status) updateData.status = status;
    if (clearReports) updateData.reportCount = 0;

    const topic = await prisma.topic.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Admin topic update error:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}
