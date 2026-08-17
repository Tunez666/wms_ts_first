import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this login already exists',
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      10,
    );

    return this.prisma.user.create({
      data: {
        login: dto.login,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        status: dto.status ?? 'ACTIVE',
      },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    currentUserId: string,
  ) {
    const user = await this.findOne(id);

    const isSelf = id === currentUserId;

    if (
      isSelf &&
      (dto.role !== undefined ||
        dto.status !== undefined)
    ) {
      throw new ForbiddenException(
        'You cannot change your own role or status',
      );
    }

    if (
      dto.role !== undefined &&
      dto.role !== 'ADMIN' &&
      user.role === 'ADMIN' &&
      user.status === 'ACTIVE'
    ) {
      const activeAdmins =
        await this.prisma.user.count({
          where: {
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        });

      if (activeAdmins <= 1) {
        throw new ForbiddenException(
          'Cannot remove the last active administrator',
        );
      }
    }

    if (
      dto.status === 'INACTIVE' &&
      user.role === 'ADMIN' &&
      user.status === 'ACTIVE'
    ) {
      const activeAdmins =
        await this.prisma.user.count({
          where: {
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        });

      if (activeAdmins <= 1) {
        throw new ForbiddenException(
          'Cannot deactivate the last active administrator',
        );
      }
    }

    const data: {
      login?: string;
      passwordHash?: string;
      firstName?: string;
      lastName?: string;
      role?: UpdateUserDto['role'];
      status?: UpdateUserDto['status'];
    } = {};

    if (dto.login !== undefined) {
      data.login = dto.login;
    }

    if (dto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(
        dto.password,
        10,
      );
    }

    if (dto.firstName !== undefined) {
      data.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      data.lastName = dto.lastName;
    }

    if (dto.role !== undefined) {
      data.role = dto.role;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data,
        select: {
          id: true,
          login: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint')
      ) {
        throw new ConflictException(
          'User with this login already exists',
        );
      }

      throw error;
    }
  }
  async remove(
    id: string,
    currentUserId: string,
  ) {
    const user = await this.findOne(id);

    if (id === currentUserId) {
      throw new ForbiddenException(
        'You cannot deactivate yourself',
      );
    }

    if (
      user.role === 'ADMIN' &&
      user.status === 'ACTIVE'
    ) {
      const activeAdmins =
        await this.prisma.user.count({
          where: {
            role: 'ADMIN',
            status: 'ACTIVE',
          },
        });

      if (activeAdmins <= 1) {
        throw new ForbiddenException(
          'Cannot deactivate the last active administrator',
        );
      }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
      },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });
  }
}