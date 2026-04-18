import { Module } from '@nestjs/common';
import { RetroController } from './retro.controller';
import { RetroService } from './retro.service';
import { RetroGateway } from './gateway/retro.gateway';

@Module({
  controllers: [RetroController],
  providers: [RetroService, RetroGateway],
  exports: [RetroService],
})
export class RetroModule {}
