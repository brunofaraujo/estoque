import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

  // async create(createUserDto: CreateUserDto) {
  //   return await this.prisma.user.create({
  //     data: {
  //       username: createUserDto.username,
  //       email: createUserDto.email,
  //       name: createUserDto.name,
  //       password: createUserDto.password
  //     }
  //   });
  // }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id?: number, username?: string) {
    if (username) {
      return await this.prisma.user.findFirst({
        where: {
          username
        }
      })
    }
    return await this.prisma.user.findFirst({
      where: {
        id
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({data: updateUserDto, where: {id}});
  }


  // async remove(id: number) {
  //   return await `This action removes a #${id} user`;
  // }
  
}
