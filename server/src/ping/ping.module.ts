import { Module } from '@nestjs/common';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';
import { StreamingModule } from '../streaming/streaming.module';

@Module({
  imports: [StreamingModule],
  controllers: [PingController],
  providers: [PingService],
})
export class PingModule {}
