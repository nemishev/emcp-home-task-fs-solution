import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PingMessageDto } from './dto/ping-message.dto';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Post()
  @HttpCode(202)
  ping(@Body() pingMessageDto: PingMessageDto) {
    this.pingService.sendPingMessage(pingMessageDto);
  }
}
