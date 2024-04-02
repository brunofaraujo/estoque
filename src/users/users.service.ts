import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const deletedUser: User = await this.prisma.user.findFirst({
        where: {
          OR: [
            { name: createUserDto.name },
            { email: createUserDto.email },
            { username: createUserDto.username },
          ],
          AND: [{ deleted: true }],
        },
      });

      if (deletedUser) {
        return await this.prisma.user.update({
          where: { id: deletedUser.id },
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            password: hashedPassword,
            deleted: false,
          },
        });
      }

      return await this.prisma.user.create({
        data: { ...createUserDto, password: hashedPassword },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      where: { deleted: false },
      orderBy: { name: 'asc' },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        username,
        deleted: false,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
        deleted: false,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      return await this.prisma.user.update({
        data: updateUserDto,
        where: { id, deleted: false },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const hasMoves = await this.prisma.move.count({
        where: { user: { id } },
      });
      if (hasMoves) {
        return await this.prisma.user.update({
          where: { id },
          data: { deleted: true },
        });
      }
      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
