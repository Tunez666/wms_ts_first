import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getDashboard() {
    const [
      totalClients,
      activeClients,
      totalUsers,
      activeUsers,
      recentEvents,
    ] = await Promise.all([
      this.prisma.client.count(),

      this.prisma.client.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.user.count(),

      this.prisma.user.count({
        where: {
          status: 'ACTIVE',
        },
      }),

      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          description: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              login: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return {
  clients: {
    total: totalClients,
    active: activeClients,
  },

  users: {
    total: totalUsers,
    active: activeUsers,
  },

  requests: {
    total: 0,
  },

  products: {
    total: 0,
  },

  warehouses: {
    total: 0,
  },

  operations: {
    newRequests: 0,
    inProgress: 0,
    receiving: 0,
    placement: 0,
    completed: 0,
  },

  recentEvents,
};
}
}