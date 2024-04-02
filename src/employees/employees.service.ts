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
      const deletedEmployee: Employee = await this.prisma.employee.findFirst({
        where: {
          OR: [
            { name: createEmployeeDto.name },
            { register: createEmployeeDto.register },
          ],
          AND: [{ deleted: true }],
        },
      });

      if (deletedEmployee) {
        return await this.prisma.employee.update({
          where: { id: deletedEmployee.id },
          data: {
            name: createEmployeeDto.name,
            register: createEmployeeDto.register,
            department: createEmployeeDto.department,
            deleted: false,
          },
        });
      }

      return await this.prisma.employee.create({
        data: createEmployeeDto,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(moves: string) {
    if (moves === 'true') {
      return await this.prisma.employee.findMany({
        where: { moves: { some: {} } },
        orderBy: { name: 'asc' },
      });
    }

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
      const hasMoves = await this.prisma.move.count({
        where: { requester: { id } },
      });

      if (hasMoves) {
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
