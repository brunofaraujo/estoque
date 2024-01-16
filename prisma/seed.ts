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
            name: 'Motorola'
        }
    })
    const brand6 = await prisma.brand.create({
        data: {
            name: 'Apple'
        }
    })
    const brand7 = await prisma.brand.create({
        data: {
            name: 'Logitech'
        }
    })
    const brand8 = await prisma.brand.create({
        data: {
            name: 'Compactor'
        }
    })
    const brand9 = await prisma.brand.create({
        data: {
            name: 'BIC'
        }
    })
    const brand10 = await prisma.brand.create({
        data: {
            name: 'Lenovo'
        }
    })
    const brand11 = await prisma.brand.create({
        data: {
            name: 'Genérico'
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
            description: "Cor Azul",
            register: "3170041580",
            brand: {
                connect: {
                    id: 9
                }
            },
            volume: {
                connect: {
                    id: 1
                }
            },
            category: {
                connect: {
                    id: 5
                }
            },
            supply: {
                create: {
                    current: 150
                }
            }
        }
    })

    const item2 = await prisma.item.create({
        data: {
            title: "Caneta esferográfica",
            description: "Cor Vermelha",
            register: "3170041581",
            brand: {
                connect: {
                    id: 9
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
                    current: 10
                }
            }
        }
    })

    const item3 = await prisma.item.create({
        data: {
            title: "Notebook Core i7",
            description: "Cinza",
            register: "3170041588",
            brand: {
                connect: {
                    id: 1
                }
            },
            volume: {
                connect: {
                    id: 3
                }
            },
            category: {
                connect: {
                    id: 1
                }
            },
            supply: {
                create: {
                    current: 10
                }
            }
        }
    })

    const item4 = await prisma.item.create({
        data: {
            title: "Mousepad",
            description: "Personalizado SESI 2024",
            register: "3170041570",
            brand: {
                connect: {
                    id: 3
                }
            },
            volume: {
                connect: {
                    id: 2
                }
            },
            category: {
                connect: {
                    id: 4
                }
            },
            supply: {
                create: {
                    current: 50
                }
            }
        }
    })

    const item5 = await prisma.item.create({
        data: {
            title: "Água sanitária",
            description: "5 litros",
            register: "3170041522",
            brand: {
                connect: {
                    id: 3
                }
            },
            volume: {
                connect: {
                    id: 2
                }
            },
            category: {
                connect: {
                    id: 1
                }
            },
            supply: {
                create: {
                    current: 30
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