const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
  try {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        preferredContentLanguages: true,
      },
    });
    
    console.log('User:', JSON.stringify(user, null, 2));
    
    const topics = await prisma.topic.count({
      where: { status: 'ACTIVE' }
    });
    
    console.log('Active topics:', topics);
    
  } finally {
    await prisma.$disconnect();
  }
}

check();
