import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    try {
      return await this.prisma.item.create({
        data: {
          title: createItemDto.title,
          description: createItemDto.description,
          serial: createItemDto.serial,
          expiration: createItemDto.expiration
            ? new Date(createItemDto.expiration)
            : null,
          batch: createItemDto.batch,
          volume: { connect: { id: createItemDto.volumeId } },
          brand: { connect: { id: createItemDto.brandId } },
          category: { connect: { id: createItemDto.categoryId } },
          supply: { create: { current: createItemDto.amount } },
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.item.findMany({
      where: {
        deleted: false,
      },
      include: {
        volume: true,
        brand: true,
        category: true,
        supply: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.item.findUnique({
      where: { id, deleted: false },
      include: {
        volume: true,
        brand: true,
        category: true,
        supply: true,
      },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    try {
      if (updateItemDto.expiration) {
        updateItemDto.expiration = new Date(updateItemDto.expiration);
        return await this.prisma.item.update({
          where: { id, deleted: false },
          data: updateItemDto,
        });
      }
      return await this.prisma.item.update({
        where: { id, deleted: false },
        data: updateItemDto,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
        return await this.prisma.item.update({
          where: { id, deleted: false },
          data: {
            deleted: true,
            supply: {
              update: {
                deleted: true,
              },
            },
          },
          include: {
            supply: true,
          },
        });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async isValidOperation(supplyId: number, type: string, amount: number) {
    const current: number = (
      await this.prisma.supply.findUnique({ where: { id: supplyId } })
    ).current;
    if (amount && type === 'I') {
      return true;
    }
    if (amount && type === 'O') {
      if (current - amount < 0) {
        return false;
      }
      return true;
    }
    return false;
  }

  async createMove(createMoveDto: CreateMoveDto) {
    //Now receiving the supplyId (Maybe check by ItemId)
    try {
      if (
        await this.isValidOperation(
          createMoveDto.supplyId,
          createMoveDto.type,
          createMoveDto.amount,
        )
      ) {
        let result: number;
        const current: number = (
          await this.prisma.supply.findUnique({
            where: { id: createMoveDto.supplyId },
          })
        ).current;
        if (createMoveDto.type === 'I') {
          result = current + createMoveDto.amount;
          await this.prisma.supply.update({
            where: { id: createMoveDto.supplyId },
            data: { current: result },
          });
          return this.prisma.move.create({
            data: {
              type: createMoveDto.type,
              amount: createMoveDto.amount,
              user: { connect: { id: createMoveDto.userId } },
              supply: { connect: { id: createMoveDto.supplyId } },
            },
            include: { supply: true },
          });
        }
        if (createMoveDto.requesterId && createMoveDto.type === 'O') {
          result = current - createMoveDto.amount;
          await this.prisma.supply.update({
            where: { id: createMoveDto.supplyId },
            data: { current: result },
          });
          return this.prisma.move.create({
            data: {
              type: createMoveDto.type,
              amount: createMoveDto.amount,
              requester: { connect: { id: createMoveDto.requesterId } },
              user: { connect: { id: createMoveDto.userId } },
              supply: { connect: { id: createMoveDto.supplyId } },
            },
            include: { supply: true },
          });
        }
      }
      throw new BadRequestException('Invalid request');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
