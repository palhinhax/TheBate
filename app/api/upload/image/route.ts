import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToB2, validateImageFile } from "@/lib/b2-storage";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum ficheiro fornecido" }, { status: 400 });
    }

    console.log("Uploading file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate file
    validateImageFile(file);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate buffer is not empty
    if (buffer.length === 0) {
      return NextResponse.json({ error: "Ficheiro vazio" }, { status: 400 });
    }

    // Upload to B2
    const imageUrl = await uploadToB2(buffer, file.name, file.type);

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao fazer upload da imagem" },
      { status: 500 }
    );
  }
}
