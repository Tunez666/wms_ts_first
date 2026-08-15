import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.client.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: {
    name: string;
    clientType: string;
    email?: string;
    phone?: string;
  }) {
    return this.prisma.client.create({
      data: {
        name: data.name,
        clientType: data.clientType,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  async update(id: string, data: UpdateClientDto) {
    return this.prisma.client.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.client.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

}