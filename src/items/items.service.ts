import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
          expiration: createItemDto.expiration ? new Date(createItemDto.expiration) : null,
          batch: createItemDto.batch,
          volume: { connect: { id: createItemDto.volumeId }},
          brand: { connect: { id: createItemDto.brandId }},
          category: { connect: { id: createItemDto.categoryId }},
          supply: { create: { current: createItemDto.amount }}
        }
      })
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async findAll() {
    return await this.prisma.item.findMany({include: {
      volume: true,
      brand: true,
      category: true,
      supply: true
    }})
  }

  async findOne(id: number) {
    return this.prisma.item.findUnique({where: {id}, include: {
      volume: true,
      brand: true,
      category: true,
      supply: true
    }})
  }

  async update(id: number, updateItemDto: UpdateItemDto) {

    try {
      if (updateItemDto.expiration) {
        updateItemDto.expiration = new Date(updateItemDto.expiration)
        return this.prisma.item.update({
          where: {id},
          data: updateItemDto
        })
      }
      return this.prisma.item.update({
        where: {id},
        data: updateItemDto
      })
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async remove(id: number) {
    try {

      return this.prisma.item.update({
        where: {id},
        data: {
          deleted: true,
          supply: {
            update: {
              deleted: true
            }
          }
        },
        include: {
          supply: true
        }
      })
      
    
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}
 