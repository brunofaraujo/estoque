import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRequestDto: CreateRequestDto) {
    return await this.prisma.request.create({
      data: {
        RequestAmounts: {
          createMany: {
            data: createRequestDto.requestAmounts.map((item) => ({
              amount: item['amount'],
              itemId: item['itemId'],
            })),
          },
        },
        requester: {
          connect: { id: createRequestDto.employeeId },
        },
        description: createRequestDto.description,
        status: 'C',
      },
    });
  }

  async findAll() {
    return await this.prisma.request.findMany({
      include: {
        requester: true,
        user: true,
        RequestAmounts: {
          include: {
            item: {
              include: {
                brand: true,
                category: true,
                supply: true,
                volume: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
