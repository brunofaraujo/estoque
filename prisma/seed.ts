import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { fakerPT_BR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  const adminUser = await prisma.user.create({
    data: {
      username: '03149',
      name: 'Bruno Freire Araujo',
      email: 'brunoaraujo@fiepb.org.br',
      password: await bcrypt.hash('123456', 10),
    },
  });

  for (let index = 0; index < 15; index++) {
    await prisma.user.create({
      data: {
        email: faker.helpers.unique(faker.internet.email),
        name: faker.person.fullName(),
        username: faker.string.numeric(5),
        password: await bcrypt.hash('123456', 10),
      },
    });
  }

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Expediente' },
      { name: 'Eletrônico' },
      { name: 'Perecível' },
      { name: 'Limpeza' },
      { name: 'Manutenção' },
      { name: 'Informática' },
      { name: 'Lazer' },
      { name: 'Mobília' },
    ],
  });

  const volumes = await prisma.volume.createMany({
    data: [{ name: 'Caixa' }, { name: 'Unidade' }],
  });

  for (let index = 0; index < 50; index++) {
    await prisma.brand.create({
      data: { name: faker.helpers.unique(faker.company.name) },
    });
  }

  const departments = [
    'Administrativo',
    'Pedagógico',
    'Prestador',
    'DR',
    'Aluno',
    'Outro',
  ];

  for (let index = 0; index < 150; index++) {
    await prisma.employee.create({
      data: {
        name: faker.helpers.unique(faker.person.fullName),
        register: faker.string.numeric(5),
        department: departments[Math.floor(Math.random() * 6)],
        email: faker.helpers.unique(faker.internet.email),
      },
    });
  }

  for (let index = 0; index < 550; index++) {
    const amount = Math.floor(Math.random() * 700) + 1;
    const item = await prisma.item.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        serial: faker.string.alphanumeric(10),
        register: faker.string.alpha(10),
        expiration: faker.date.future(),
        batch: faker.string.alphanumeric(8),
        volume: { connect: { id: Math.floor(Math.random() * 2) + 1 } },
        brand: { connect: { id: Math.floor(Math.random() * 50) + 1 } },
        category: { connect: { id: Math.floor(Math.random() * 8) + 1 } },
        supply: { create: { current: amount } },
      },
    });
    if (item)
      await prisma.move.create({
        data: {
          supply: { connect: { id: item.supplyId } },
          requester: {},
          type: 'I',
          amount: amount,
          user: { connect: { id: Math.floor(Math.random() * 16) + 1 } },
          description: 'Cadastro inicial',
        },
      });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
