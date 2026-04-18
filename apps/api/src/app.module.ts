import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RetroModule } from './modules/retro/retro.module';

@Module({
  imports: [PrismaModule, RetroModule],
})
export class AppModule {}
