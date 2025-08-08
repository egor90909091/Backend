const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminMail = 'admin@mail.ru';
  const adminName = 'Админ';
  const adminRole = 'ADMIN';
  const adminPassword = 'password123';

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(adminPassword, salt);

  await prisma.user.upsert({
    where: { mail: adminMail },
    update: {},
    create: {
      mail: adminMail,
      name: adminName,
      hash: hash,
      role: adminRole,
    },
  });

  console.log('Admin user ensured:', adminMail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 