import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const deletedEmployee: Employee = await this.prisma.employee.findUnique({
        where: { register: createEmployeeDto.register, deleted: true },
      });

      if (deletedEmployee) {
        return (
          (await this.prisma.employee.update({
            where: { register: createEmployeeDto.register },
            data: createEmployeeDto,
          })) &&
          this.prisma.employee.update({
            where: { register: createEmployeeDto.register },
            data: { deleted: false },
          })
        );
      }

      return await this.prisma.employee.create({
        data: createEmployeeDto,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.employee.findMany({
      where: { deleted: false },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.employee.findUnique({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      return await this.prisma.employee.update({
        data: updateEmployeeDto,
        where: { id, deleted: false },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      if (
        (await this.prisma.move.count({
          where: {
            requester: { id },
          },
        })) > 0
      ) {
        return await this.prisma.employee.update({
          where: { id },
          data: { deleted: true },
        });
      }
      return await this.prisma.employee.delete({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
