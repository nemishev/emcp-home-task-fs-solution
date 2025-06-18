import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

type StreamPushResult = ReturnType<RedisService['xadd']>;
type XreadResult = Awaited<ReturnType<RedisService['xread']>>;
type XreadResultMessage = XreadResult[0][1][1];

export type StreamableRecord = Record<string, any>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Redis client wrapper service
 */
@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  public constructor(private readonly configServicd: ConfigService) {
    super(configServicd.get('REDIS_CONNECT_URL'));

    this.on('connect', this.handleConnect.bind(this));
    this.on('ready', this.handleReady.bind(this));
    this.on('error', this.handleError.bind(this));
    this.on('close', this.handleClose.bind(this));
    this.on('reconnecting', this.handleReconnecting.bind(this));
    this.on('end', this.handleEnd.bind(this));
  }

  /**
   * "Ready" indicator
   */
  get isReady() {
    return this.status === 'ready';
  }

  /**
   * Appends data to a provided stream channel
   *
   * @param {String} streamName
   * @param {StreamableRecord} data
   *
   * @returns {StreamPushResult}
   */
  async streamData(
    streamName: string,
    data: StreamableRecord,
  ): StreamPushResult {
    this.logger.log(`Streaming data to channel: ${streamName}`, data);

    const res = (await this.callWhenReady([
      'XADD',
      streamName,
      '*',
      ...Object.entries(data).flat(),
    ])) as StreamPushResult;

    return res;
  }

  /**
   * Reads data from a provided stream channel.
   *
   * @param {String} streamName - Name of the stream to read from
   * @param {String} lastMessageId - ID of last fetched message
   *
   * @returns {Promise<XreadResultMessage | null>} - Returns messages or null if no messages are available
   */
  async readStream(
    streamName: string,
    lastMessageId: string,
  ): Promise<XreadResultMessage[] | null> {
    const response = (await this.callWhenReady([
      'XREAD',
      'STREAMS',
      streamName,
      lastMessageId,
    ])) as XreadResult;

    if (!response?.length) {
      return null;
    }

    const [, result] = response[0];

    return result;
  }

  /**
   * Convinient wrapper around Redis's call method that delays Redis's command execution until the Redis client is ready.
   *
   * @param {Parameters<RedisService['call']>} callMethodArgs - Redis's call method arguments
   * @param {Number} maxRetries - Maximum number of retries to execute the command
   * @param {Number} delayMs - Delay in milliseconds between retries
   *
   * @returns {Promise<ReturnType<RedisService['call']>>}
   */
  async callWhenReady(
    callMethodArgs: Parameters<RedisService['call']>,
    maxRetries: number = 3,
    delayMs: number = 1000,
  ): Promise<ReturnType<RedisService['call']>> {
    let currentTry = 0;
    while (true) {
      if (!this.isReady) {
        const [command, ...restCommandArgs] = callMethodArgs[0];
        // if Redis fails to connect even after "maxRetries" attempts, log a warning and break the loop
        if (currentTry === maxRetries) {
          this.logger.warn(
            `Failed to execute Redis command ${command} with args [${JSON.stringify(restCommandArgs)}] after ${maxRetries} retries.`,
          );

          break;
        }
        currentTry++;

        this.logger.log(
          `Redis is not ready yet. Retrying command ${command}...`,
          {
            currentTry,
            retriesLeft: maxRetries - currentTry,
          },
        );

        await delay(delayMs);
      }

      // once Redis is ready, execute the command
      return await this.call(...callMethodArgs);
    }
  }

  onModuleDestroy() {
    this.disconnect(false);
  }

  /**
   * Log redis "connect" event
   */
  private handleConnect() {
    this.logger.log('Redis connecting...');
  }

  /**
   * Log redis "ready" event
   */
  private handleReady() {
    this.logger.log('Redis connected!');
  }

  /**
   * Log redis "close" event
   */
  private handleClose() {
    this.logger.warn('Redis disconnected!');
  }

  /**
   * Log redis "reconnecting" event
   */
  private handleReconnecting() {
    this.logger.log('Redis reconnecting...');
  }

  /**
   * Log redis "end" event
   */
  private handleEnd() {
    this.logger.warn('Redis connection ended!');
  }

  /**
   * Log redis "error" event
   *
   * @param {*} err - Error object
   */
  private handleError(err: any) {
    this.logger.error('Redis error occurred', { status: this.status, err });
  }
}
