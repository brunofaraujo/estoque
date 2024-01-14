import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username
      }
    })
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    return await this.prisma.user.update({data: updateUserDto, where: {id}});
  }
  
}
