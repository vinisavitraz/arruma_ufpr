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
      status: 'ativo',
      phone: '41996690000',
      document: '14318817083',
      address: 'Fake street, number 2 - PR',
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
      status: 'ativo',
      phone: '41996691200',
      document: '53089037009',
      address: 'Fake quarter, number 1 - PR',
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