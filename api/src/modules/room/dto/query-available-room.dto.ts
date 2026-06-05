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
    description: 'Check-in date (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'check_in_date is required' })
  @IsDateString({}, { message: 'check_in_date must be a valid date' })
  check_in_date: string;

  @ApiProperty({
    example: '2026-06-12',
    description: 'Check-out date (YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'check_out_date is required' })
  @IsDateString({}, { message: 'check_out_date must be a valid date' })
  check_out_date: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Optional room type id',
  })
  @IsOptional()
  @IsUUID('4')
  room_type_id?: string;

  @ApiPropertyOptional({ example: 2, description: 'Minimum capacity' })
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
