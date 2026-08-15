import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ClientsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

