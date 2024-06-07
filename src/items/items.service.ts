import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    try {
      const item = await this.prisma.item.create({
        data: {
          title: createItemDto.title,
          description: createItemDto.description,
          serial: createItemDto.serial,
          register: createItemDto.register,
          expiration: createItemDto.expiration
            ? new Date(createItemDto.expiration)
            : null,
          batch: createItemDto.batch,
          volume: { connect: { id: createItemDto.volumeId } },
          brand: { connect: { id: createItemDto.brandId } },
          category: { connect: { id: createItemDto.categoryId } },
          supply: { create: { current: 0 } },
        },
      });

      if (item)
        return await this.createMove({
          itemId: item.id,
          supplyId: item.supplyId,
          type: 'I',
          amount: createItemDto.amount,
          requesterId: null,
          userId: createItemDto.userId,
          description: 'Cadastro inicial',
        });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(withDeleted: string) {
    if (withDeleted === 'true') {
      return await this.prisma.item.findMany({
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

  async findAllWithMoves() {
    return await this.prisma.item.findMany({
      where: {
        supply: {
          history: { some: {} },
        },
      },
      select: {
        id: true,
        title: true,
        volume: true,
        brand: true,
        category: true,
        supply: {
          select: {
            history: {
              select: {
                type: true,
                amount: true,
                description: true,
                requester: true,
                user: { select: { name: true } },
                createdAt: true,
              },
            },
          },
        },
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
              [createMoveDto.requesterId ? 'requester' : undefined]:
                createMoveDto.requesterId
                  ? { connect: { id: createMoveDto.requesterId } }
                  : undefined,
              description: createMoveDto.description,
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
              description: createMoveDto.description,
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

  async restoreItem(id: number) {
    try {
      return await this.prisma.item.update({
        where: { id, AND: { deleted: true } },
        data: { deleted: false, supply: { update: { deleted: false } } },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
