import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDirectMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
