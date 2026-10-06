import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRuleDto {
  @IsOptional()
  @IsString({ message: 'Phạm vi (scope) phải là chuỗi ký tự' })
  scope?: string;

  @IsString({ message: 'Tiêu đề rule phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề rule không được để trống' })
  title!: string;

  @IsString({ message: 'Nội dung rule phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung rule không được để trống' })
  content!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
