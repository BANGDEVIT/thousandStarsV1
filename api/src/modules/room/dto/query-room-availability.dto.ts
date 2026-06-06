import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryRoomAvailabilityDto {
  @ApiPropertyOptional({
    example: '2026-06-10',
    description: 'Check-in date (YYYY-MM-DD). Also accepts checkInDate.',
  })
  @IsOptional()
  @IsDateString({}, { message: 'check_in_date must be a valid date' })
  check_in_date?: string;

  @ApiPropertyOptional({
    example: '2026-06-12',
    description: 'Check-out date (YYYY-MM-DD). Also accepts checkOutDate.',
  })
  @IsOptional()
  @IsDateString({}, { message: 'check_out_date must be a valid date' })
  check_out_date?: string;

  @ApiPropertyOptional({ example: '2026-06-10' })
  @IsOptional()
  @IsDateString({}, { message: 'checkInDate must be a valid date' })
  checkInDate?: string;

  @ApiPropertyOptional({ example: '2026-06-12' })
  @IsOptional()
  @IsDateString({}, { message: 'checkOutDate must be a valid date' })
  checkOutDate?: string;
}
