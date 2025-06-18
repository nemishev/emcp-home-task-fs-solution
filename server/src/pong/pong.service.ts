import { Subscription, from } from 'rxjs';
import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  StreamingService,
  StreamMessage,
  StreamingChannel,
} from '../streaming/streaming.service';

/**
 * Continuously listens to "ping" messages and reacts with "pong" messages.
 */
@Injectable()
export class PongService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PongService.name);

  /**
   * Ping stream subscriber allows to cleanup resources once the module gets destroyed
   */
  private pingStreamSubscriber: Subscription;

  constructor(private readonly streamingService: StreamingService) {}

  /**
   * Subscribe to "ping" stream on module initialization.
   */
  async onModuleInit() {
    this.subscribeToPingStream();
  }

  /**
   * Unsubscribe from "ping" stream on module destruction.
   */
  async onModuleDestroy() {
    this.unsubscribeFromPingStream();
  }

  /**
   * Continuously listen to "ping" messages
   */
  private async subscribeToPingStream() {
    this.logger.log('Subscribing to ping stream...');

    this.pingStreamSubscriber = from(
      this.streamingService.pull(StreamingChannel.PING),
    ).subscribe({
      next: (message) => this.processPingMessage(message),
    });
  }

  /**
   * Unsubscribe from "ping" data stream to release resources
   */
  private unsubscribeFromPingStream() {
    this.pingStreamSubscriber.unsubscribe();
  }

  /**
   * Process a "ping" message. Non ping messages get discarded.
   *
   * @param {String} message The incoming ping message
   *
   * @returns {Void}
   */
  private processPingMessage(message: StreamMessage): void {
    const [, value] = message.data;

    // discard non-ping messages
    if (value !== 'ping') {
      return;
    }

    // stream a "pong" message back
    this.streamingService.push(StreamingChannel.PONG, {
      message: 'pong',
    });
  }
}
