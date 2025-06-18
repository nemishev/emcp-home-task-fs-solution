import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  providers: [StreamingService],
  imports: [RedisModule],
  exports: [StreamingService],
})
export class StreamingModule {}
