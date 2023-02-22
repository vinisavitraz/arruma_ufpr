import { PrismaClient, user } from '@prisma/client';

const prisma  = new PrismaClient();

async function main() {
  
  const userAdmin: user = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      password: '$2b$10$sNMPhHviR4DMUgPDc8QUyeeTWZGxVyiEDY94KxySZegcLr5ai/MIC',
      name: 'Admin',
      role: 0,
      status: 'ativo',
      phone: '41996690000',
      document: '14318817083',
      address: 'Fake street, number 2 - PR',
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