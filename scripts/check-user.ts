/**
 * Script para verificar informações de um usuário
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isOwner: true,
      },
    });

    if (!user) {
      console.error(`❌ Usuário com email '${email}' não encontrado`);
      process.exit(1);
    }

    console.log("✅ Usuário encontrado:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is Owner: ${user.isOwner}`);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.error("❌ Uso: npx tsx scripts/check-user.ts <email>");
  process.exit(1);
}

checkUser(email);
