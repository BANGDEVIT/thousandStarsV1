// dto/create-service.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Dịch vụ spa', description: 'Tên dịch vụ' })
  @IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'spa',
    description: 'Danh mục: spa, food, laundry, transport...',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 200000, description: 'Giá dịch vụ (VNĐ)' })
  @IsNotEmpty({ message: 'Giá dịch vụ không được để trống' })
  @IsNumber({}, { message: 'Giá dịch vụ phải là số' })
  @Min(0, { message: 'Giá dịch vụ không được âm' })
  price: number;
}
