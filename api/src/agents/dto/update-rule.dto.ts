import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRuleDto {
  @IsOptional()
  @IsString({ message: 'Phạm vi (scope) phải là chuỗi ký tự' })
  scope?: string;

  @IsOptional()
  @IsString({ message: 'Tiêu đề rule phải là chuỗi ký tự' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung rule phải là chuỗi ký tự' })
  content?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString({ message: 'Lý do thay đổi phải là chuỗi ký tự' })
  changeReason?: string;
}
