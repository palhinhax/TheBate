import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Prevenir que o owner elimine a si mesmo
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { role, isOwner } = body;

    // Validar role
    if (role && !["USER", "MOD", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevenir que o owner remova seu próprio status de owner
    if (params.id === session.user.id && isOwner === false) {
      return NextResponse.json(
        { error: "Cannot remove your own owner status" },
        { status: 400 }
      );
    }

    const updateData: { role?: UserRole; isOwner?: boolean } = {};
    if (role !== undefined) updateData.role = role as UserRole;
    if (isOwner !== undefined) updateData.isOwner = isOwner;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isOwner: true,
        createdAt: true,
        _count: {
          select: {
            topics: true,
            comments: true,
            votes: true,
            topicVotes: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
