import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { StreamingModule } from 'src/streaming/streaming.module';

@Module({
  imports: [StreamingModule],
  providers: [PongService],
})
export class PongModule {}
