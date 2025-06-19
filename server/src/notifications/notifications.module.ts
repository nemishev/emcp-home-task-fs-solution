import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { StreamingModule } from '../streaming/streaming.module';

@Module({
  imports: [StreamingModule],
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
