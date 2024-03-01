import { Injectable } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createSummaryDto: CreateSummaryDto) {
  //   return 'This action adds a new summary';
  // }

  async findAll() {
    const categories = await this.prisma.category.count({where: { deleted: false }});
    const items = await this.prisma.item.count({ where: { deleted: false } });
    const users = await this.prisma.user.count({ where: { deleted: false } });
    const volumes = await this.prisma.volume.count({where: { deleted: false }});
    const employees = await this.prisma.employee.count({where: { deleted: false }});
    const brands = await this.prisma.brand.count({ where: { deleted: false } });
    const moves = await this.prisma.move.count();

    return { categories, items, users, volumes, employees, brands, moves };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} summary`;
  // }

  // update(id: number, updateSummaryDto: UpdateSummaryDto) {
  //   return `This action updates a #${id} summary`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} summary`;
  // }
}
