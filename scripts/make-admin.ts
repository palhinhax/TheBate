/**
 * Script para tornar um usuário ADMIN
 *
 * Uso: npx tsx scripts/make-admin.ts <username>
 * Exemplo: npx tsx scripts/make-admin.ts joao
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.error(`❌ Usuário '${username}' não encontrado`);
      process.exit(1);
    }

    if (user.role === "ADMIN") {
      console.log(`ℹ️  Usuário '${username}' já é ADMIN`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { username },
      data: { role: "ADMIN" },
    });

    console.log(`✅ Usuário '${username}' agora é ADMIN`);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const username = process.argv[2];

if (!username) {
  console.error("❌ Uso: npx tsx scripts/make-admin.ts <username>");
  process.exit(1);
}

makeAdmin(username);
