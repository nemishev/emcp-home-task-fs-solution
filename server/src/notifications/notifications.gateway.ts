import { Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { from, Subscription } from 'rxjs';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  StreamingService,
  StreamMessage,
  StreamingChannel,
} from '../streaming/streaming.service';

/**
 * WebSocket gateway for handling notifications.
 * It listens to "pong" messages from the streaming service and broadcasts them to connected clients.
 */
@WebSocketGateway()
export class NotificationsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  /**
   * Pong stream subscriber allows to cleanup resources once the module gets destroyed
   */
  private pongStreamSubscriber: Subscription;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly streamingService: StreamingService) {}

  @WebSocketServer()
  io: Server;

  afterInit() {
    this.logger.log('Initialized');

    this.subscribeToPongStream();
  }

  handleConnection(client: any) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  /**
   * Subscribe to "pong" stream on module initialization.
   */
  async onModuleInit() {
    this.subscribeToPongStream();
  }

  /**
   * Unsubscribe from "pong" stream on module destruction.
   */
  onModuleDestroy() {
    this.unsubscribeFromPongStream();
  }

  /**
   * Continuously listen to "pong" messages
   */
  private async subscribeToPongStream() {
    this.logger.log('Subscribing to pong stream...');

    this.pongStreamSubscriber = from(
      this.streamingService.pull(StreamingChannel.PONG),
    ).subscribe({
      next: (message) => this.broadcastPong(message),
    });
  }

  /**
   * Unsubscribe from "ping" data stream to release resources
   */
  private unsubscribeFromPongStream() {
    this.pongStreamSubscriber.unsubscribe();
  }

  /**
   * Broadcasts the message to all connected clients.
   *
   * @param {String} message The incoming pong message
   *
   * @returns {Void}
   */
  private broadcastPong(message: StreamMessage): void {
    const [key, value] = message.data;

    process.nextTick(() => {
      this.io.emit('pong', JSON.stringify({ [key]: value }));
    });
  }
}
