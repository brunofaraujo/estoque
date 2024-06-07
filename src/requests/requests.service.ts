import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { SimpleFaker } from '@faker-js/faker';
import { RequestStatusEnum } from './enum/request-status.enum';
import { Request } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailQueue: MailService,
    private readonly faker: SimpleFaker,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      const generatedRequest = await this.generateRequest(createRequestDto);
      const email = (
        await this.prisma.employee.findFirst({
          where: { id: generatedRequest.employeeId },
        })
      ).email;
      const code = (
        await this.prisma.request.findFirst({
          where: { id: generatedRequest.id },
        })
      ).code;
      this.sendRequestCode(email, code);
      return { id: generatedRequest.id, createdAt: generatedRequest.createdAt };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    return await this.prisma.request.findMany({
      where: { status: { not: RequestStatusEnum.Unconfirmed } },
      include: {
        requester: true,
        user: { select: { id: true, name: true, username: true } },
        requestAmounts: {
          include: {
            item: {
              include: {
                brand: true,
                category: true,
                supply: true,
                volume: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    return await this.prisma.request.update({
      where: { id },
      data: {
        status: updateRequestDto.status,
        userId: updateRequestDto.userId,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }

  async getEmployees() {
    return await this.prisma.employee.findMany({
      where: { deleted: false },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  async getItems() {
    return await this.prisma.item.findMany({
      where: { deleted: false, supply: { current: { not: 0 } } },
      select: { id: true, title: true, brand: true, volume: true },
      orderBy: { title: 'asc' },
    });
  }

  async generateRequest(requestData: CreateRequestDto): Promise<Request> {
    return await this.prisma.request.create({
      data: {
        requestAmounts: {
          createMany: {
            data: requestData.requestAmounts.map((item) => ({
              amount: item['amount'],
              itemId: item['itemId'],
            })),
          },
        },
        requester: {
          connect: { id: requestData.employeeId },
        },
        description: requestData.description,
        status: RequestStatusEnum.Unconfirmed,
        code: (await this.generateRequestCode()).toString(),
      },
    });
  }

  async generateRequestCode() {
    const generatedCode = this.faker.string.alphanumeric({
      casing: 'upper',
      length: 4,
    });
    const checkIfUnique = await this.prisma.request.findFirst({
      where: { code: generatedCode },
    });
    if (!checkIfUnique) {
      return `${generatedCode}`;
    } else {
      this.generateRequestCode();
    }
  }

  async sendRequestCode(address: string, code: string) {
    const data = { to: address, code: code };
    this.mailQueue.sendRequestCode(data);
  }

  async validateRequest(id: number, code: string) {
    try {
      const request = await this.prisma.request.findUnique({
        where: { id: id, AND: { status: RequestStatusEnum.Unconfirmed } },
      });
      if (request && request.code === code) {
        request.status = RequestStatusEnum.Confirmed;
        await this.prisma.request.update({
          where: { id: request.id },
          data: { status: RequestStatusEnum.Confirmed },
        });
        return { id: request.id, updatedAt: request.updatedAt };
      }
      throw new BadRequestException('Invalid request code');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
