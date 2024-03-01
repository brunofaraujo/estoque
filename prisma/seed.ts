import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function seed() {

    const user1 = await prisma.user.upsert({
        where: { username: '03149' },
        update: {},
        create: {
            username: '03149',
            name: 'Bruno Freire Araujo',
            email: 'brunoaraujo@fiepb.org.br',
            password: await bcrypt.hash('123456', 10)
        }
    })
}

seed()
.catch((e)=> {
    console.error(e);
    process.exit(1);
})
.finally(async ()=> {
    await prisma.$disconnect();
})