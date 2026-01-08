/**
 * Script para tornar um usuário OWNER
 *
 * Uso: npx tsx scripts/make-owner.ts <username>
 * Exemplo: npx tsx scripts/make-owner.ts joao
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeOwner(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.error(`❌ Usuário '${username}' não encontrado`);
      process.exit(1);
    }

    if (user.isOwner) {
      console.log(`ℹ️  Usuário '${username}' já é OWNER`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { username },
      data: {
        isOwner: true,
        role: "ADMIN", // Owner também deve ser admin
      },
    });

    console.log(`✅ Usuário '${username}' agora é OWNER`);
    console.log(`   Esse usuário tem acesso completo ao painel administrativo`);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const username = process.argv[2];

if (!username) {
  console.error("❌ Uso: npx tsx scripts/make-owner.ts <username>");
  process.exit(1);
}

makeOwner(username);
