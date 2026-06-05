// dto/update-service.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiPropertyOptional({ example: true, description: 'Kích hoạt/vô hiệu hóa' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
