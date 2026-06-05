// room/dto/query-available-room.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class QueryAvailableRoomDto {
  @ApiProperty({
    example: '2026-06-10',
    description: 'Ngày check-in (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Ngày check-in không được để trống' })
  @IsDateString({}, { message: 'Ngày check-in không đúng định dạng' })
  check_in_date: string;

  @ApiProperty({
    example: '2026-06-12',
    description: 'Ngày check-out (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Ngày check-out không được để trống' })
  @IsDateString({}, { message: 'Ngày check-out không đúng định dạng' })
  check_out_date: string;

  @ApiPropertyOptional({
    example: 'uuid-123',
    description: 'Lọc theo loại phòng',
  })
  @IsOptional()
  @IsUUID('4')
  room_type_id?: string;

  @ApiPropertyOptional({ example: 1, description: 'Số người' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
