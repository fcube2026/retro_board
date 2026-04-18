import { Module } from '@nestjs/common';
import { RetroController } from './retro.controller';
import { RetroService } from './retro.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RetroController],
  providers: [RetroService],
})
export class RetroModule {}
