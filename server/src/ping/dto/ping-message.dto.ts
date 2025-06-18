import { IsString } from 'class-validator';

/**
 * DTO representing a ping message from the client.
 */
export class PingMessageDto {
  @IsString()
  message: string;
}
