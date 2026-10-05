import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'Nội dung tin nhắn phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung tin nhắn không được để trống' })
  content!: string;

  @IsOptional()
  @IsString()
  agentSlug?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
