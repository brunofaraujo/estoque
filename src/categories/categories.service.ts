import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: createCategoryDto });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.category.findMany({
      where: { deleted: false },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.category.findUnique({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        data: updateCategoryDto,
        where: { id, deleted: false },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      if (
        (await this.prisma.item.count({
          where: {
            category: { id },
          },
        })) > 0
      ) {
        return await this.prisma.category.update({
          where: { id },
          data: { deleted: true },
        });
      }
      return await this.prisma.category.delete({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
