import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisService, StreamableRecord } from '../redis/redis.service';

// available channels for streaming
export enum StreamingChannel {
  PING = 'ping',
  PONG = 'pong',
}

export type StreamMessage = {
  id: string;
  data: string[];
};

const STREAM_MESSAGE_ID_POSITION = 0;
const STREAM_MESSAGE_DATA_POSITION = 1;

const FIRST_STREAM_MESSAGE_ID = '0-0';

/**
 * Streaming service acts an abstraction for data streaming. The usage of Redis is hidden from the client.
 */
@Injectable()
export class StreamingService implements OnModuleInit, OnModuleDestroy {
  /**
   * "working" state affects continuous monitoring of the stream data.
   *
   * When the service is not in a working state the monitoring is put on hold.
   */
  private working: boolean;

  constructor(private readonly redis: RedisService) {}

  /**
   * Streams data to a provided channel.
   *
   * @param {StreamingChannel} channel - Channel to which the data will be streamed
   * @param {StreamableRecord} data
   *
   * @returns {void}
   */
  push(channel: StreamingChannel, data: StreamableRecord): void {
    this.redis.streamData(channel, data);
  }

  /**
   * Continuously pulls data from a provided stream channel.
   *
   * @param {StreamingChannel} channel - Name of the stream to pull data from
   *
   * @returns {AsyncGenerator<StreamMessage>} Async generator that yields messages from the stream
   */
  async *pull(channel: StreamingChannel): AsyncGenerator<StreamMessage> {
    let lastMessageId = FIRST_STREAM_MESSAGE_ID; // start from the first message by default

    // read stream as long as the service is active
    while (this.working) {
      const streamData = await this.redis.readStream(channel, lastMessageId);
      if (!streamData) {
        continue; // No messages available - keep waiting
      }

      for (const message of streamData) {
        yield {
          id: message[STREAM_MESSAGE_ID_POSITION],
          data: message[STREAM_MESSAGE_DATA_POSITION],
        };

        lastMessageId = message[STREAM_MESSAGE_ID_POSITION]; // update last message ID to the current one
      }
    }
  }
  /**
   * Start/resume working
   */
  onModuleInit() {
    this.working = true;
  }

  /**
   * Stop working
   */
  onModuleDestroy() {
    this.working = false;
  }
}
