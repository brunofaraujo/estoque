import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VolumesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVolumeDto: CreateVolumeDto) {
    try {
      const deletedVolume = await this.prisma.volume.findFirst({
        where: { name: createVolumeDto.name, deleted: true },
      });
      if (deletedVolume) {
        return await this.prisma.volume.update({
          where: { id: deletedVolume.id },
          data: { deleted: false },
        });
      }
      return await this.prisma.volume.create({ data: createVolumeDto });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.volume.findMany({
      where: { deleted: false },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.volume.findUnique({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateVolumeDto: UpdateVolumeDto) {
    try {
      return await this.prisma.volume.update({
        data: updateVolumeDto,
        where: { id, deleted: false },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      const hasMoves = await this.prisma.move.count({
        where: { supply: { item: { volume: { id } } } },
      });
      if (hasMoves) {
        return await this.prisma.volume.update({
          where: { id },
          data: { deleted: true },
        });
      }
      return await this.prisma.volume.delete({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
