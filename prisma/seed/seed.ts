import { PrismaClient, user } from '@prisma/client';

const prisma  = new PrismaClient();

async function main() {
  
  const userTeacher: user = await prisma.user.upsert({
    where: { email: 't@mail' },
    update: {},
    create: {
      email: 't@mail',
      password: '$2b$10$sNMPhHviR4DMUgPDc8QUyeeTWZGxVyiEDY94KxySZegcLr5ai/MIC',
      name: 'Professor 1',
      role: 0,
    },
  });

  const userStudent: user = await prisma.user.upsert({
    where: { email: 's@mail' },
    update: {},
    create: {
      email: 's@mail',
      password: '$2b$10$sNMPhHviR4DMUgPDc8QUyeeTWZGxVyiEDY94KxySZegcLr5ai/MIC',
      name: 'Estudante 1',
      role: 1,
    },
  });

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })