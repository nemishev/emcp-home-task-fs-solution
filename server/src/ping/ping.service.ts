import { Injectable } from '@nestjs/common';
import {
  StreamingChannel,
  StreamingService,
} from '../streaming/streaming.service';
import { PingMessageDto } from './dto/ping-message.dto';

/**
 * Service responsible for "ping" message sendong
 */
@Injectable()
export class PingService {
  constructor(private readonly streamingService: StreamingService) {}

  /**
   * Sends a "ping" message to the Redis stream.
   *
   * @param {PingMessageDto} message - The ping message to send.
   */
  sendPingMessage(message: PingMessageDto) {
    this.streamingService.push(StreamingChannel.PING, message);
  }
}
