import { Injectable } from '@nestjs/common';
// import { CreateMoveDto } from './dto/create-move.dto';
// import { UpdateMoveDto } from './dto/update-move.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MovesService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createMoveDto: CreateMoveDto) {
  //   return 'This action adds a new move';
  // }

  async findAll() {
    return await this.prisma.move.findMany({
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        supply: {
          select: {
            item: { include: { volume: true, brand: true, category: true } },
          },
        },
        requester: true,
        user: { select: { id: true, name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} move`;
  // }

  // update(id: number, updateMoveDto: UpdateMoveDto) {
  //   return `This action updates a #${id} move`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} move`;
  // }
}
