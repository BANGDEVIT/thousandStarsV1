// dto/add-booking-service.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class AddBookingServiceDto {
  @ApiProperty({
    example: 'uuid-123',
    description: 'UUID của dịch vụ',
  })
  @IsNotEmpty({ message: 'service_id không được để trống' })
  @IsUUID('4', { message: 'service_id không hợp lệ' })
  service_id: string;

  @ApiProperty({ example: 2, description: 'Số lượng' })
  @IsNotEmpty()
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @ApiPropertyOptional({ example: 'Ghi chú đặc biệt' })
  @IsOptional()
  @IsString()
  note?: string;
}
