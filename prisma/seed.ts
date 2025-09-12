import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('superadmin123', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {}, // if already exists then add (role: 'SUPERADMIN')
    create: {
      email: 'superadmin@example.com',
      password,
      role: 'SUPERADMIN',
    },
  });

  console.log(' Superadmin created ');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
