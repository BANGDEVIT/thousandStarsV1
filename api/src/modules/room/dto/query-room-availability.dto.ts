import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class QueryRoomAvailabilityDto {
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
}
