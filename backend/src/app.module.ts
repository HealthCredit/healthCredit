import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthenticationModule, PrismaModule],
controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
