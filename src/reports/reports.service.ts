import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryReportDto } from './dto/category-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  async getCategories(categoryReport: CategoryReportDto) {
    try {
      return await this.prisma.category.findUnique({
        where: { id: categoryReport.categoryId },
        include: {
          _count: { select: { items: {where: {deleted: false}} } },
          items: {
            where: {deleted: false},
            orderBy: [{supply: {current: 'desc'}}, {title: "asc"}],
            include: {
              brand: true,
              category: true,
              supply: {
                include: {
                  history: {
                    orderBy: {createdAt: "desc"},
                    include: {
                      requester: true,
                      user: {
                        select: { id: true, name: true, username: true },
                      },
                    },
                  },
                },
              },
              volume: true,
            },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
