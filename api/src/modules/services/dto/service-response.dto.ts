// dto/service-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'Dịch vụ spa' })
  name: string;

  @ApiPropertyOptional({ example: 'spa' })
  category: string | null;

  @ApiProperty({ example: 200000 })
  price: number;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  updated_at: Date;
}

export class PaginatedServiceResponseDto {
  @ApiProperty({ type: [ServiceResponseDto] })
  data: ServiceResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
