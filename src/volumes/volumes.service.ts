import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VolumesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVolumeDto: CreateVolumeDto) {
    try {
      return await this.prisma.volume.create({ data: createVolumeDto });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.volume.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    return await this.prisma.volume.findUnique({ where: { id } });
  }

  async update(id: number, updateVolumeDto: UpdateVolumeDto) {
    try {
      return await this.prisma.volume.update({
        data: updateVolumeDto,
        where: { id },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.volume.delete({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
