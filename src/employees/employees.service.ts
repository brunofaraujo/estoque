import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {

    try {
      return await this.prisma.employee.create({
        data: createEmployeeDto
      })
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async findAll() {
    return await this.prisma.employee.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.employee.findUnique({where: {id}})
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {

    try {
      return await this.prisma.employee.update({data: updateEmployeeDto, where: {id}})
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.employee.delete({where: {id}})
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}
