import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      return await this.prisma.brand.create({
        data: createBrandDto,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.brand.findMany({orderBy: {name: 'asc'}});
  }

  async findOne(id: number) {
    return await this.prisma.brand.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      return await this.prisma.brand.update({
        data: updateBrandDto,
        where: { id },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.brand.delete({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
