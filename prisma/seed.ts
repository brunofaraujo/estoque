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

    const user2 = await prisma.user.upsert({
        where: { username: '01234' },
        update: {},
        create: {
            username: '01234',
            name: 'Aurora Elora',
            email: 'aurora@fiepb.org.br',
            password: await bcrypt.hash('123456', 10)
        }
    })

    const employee1 = await prisma.employee.upsert({
        where: { name: 'Jonas Constancio' },
        update: {},
        create: {
            name: 'Jonas Constancio',
            register: '01234',
            department: 'Financeiro'
        }
    })

    const employee2 = await prisma.employee.upsert({
        where: { name: 'Andreza Teles' },
        update: {},
        create: {
            name: 'Andreza Teles',
            register: '43210',
            department: 'Administrativo'
        }
    })

    const employee3 = await prisma.employee.upsert({
        where: { name: 'Daiane Silva' },
        update: {},
        create: {
            name: 'Daiane Silva',
            register: '11111',
            department: 'TI'
        }
    })

    const volume1 = await prisma.volume.create({
        data: {
            name: "Fardo"
        }
    })

    const volume2 = await prisma.volume.create({
        data: {
            name: "Unidade"
        }
    })

    const volume3 = await prisma.volume.create({
        data: {
            name: "Caixa"
        }
    })
    

    const brand1 = await prisma.brand.create({
        data: {
            name: 'Faber Castell'
        }
    })

    const brand2 = await prisma.brand.create({
        data: {
            name: 'Samsung'
        }
    })

    const brand3 = await prisma.brand.create({
        data: {
            name: 'Dell'
        }
    })

    const brand4 = await prisma.brand.create({
        data: {
            name: 'Cadersil'
        }
    })

    const brand5 = await prisma.brand.create({
        data: {
            name: 'BIC'
        }
    })

    const category1 = await prisma.category.create({
        data: {
            name: "Eletrônico"
        }
    })

    const category2 = await prisma.category.create({
        data: {
            name: "Consumo"
        }
    })

    const category3 = await prisma.category.create({
        data: {
            name: "Vestuário"
        }
    })

    const category4 = await prisma.category.create({
        data: {
            name: "Limpeza"
        }
    })

    const category5 = await prisma.category.create({
        data: {
            name: "Expediente"
        }
    })

    const item1 = await prisma.item.create({
        data: {
            title: "Caneta esferográfica",
            description: "Edição especial",
            brand: {
                connect: {
                    id: 5
                }
            },
            volume: {
                connect: {
                    id: 2
                }
            },
            category: {
                connect: {
                    id: 5
                }
            },
            supply: {
                create: {
                    current: 5
                }
            }
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