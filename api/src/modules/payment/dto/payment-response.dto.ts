// dto/payment-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'uuid-invoice' })
  invoice_id: string;

  @ApiProperty({ example: 500000 })
  amount: number;

  @ApiProperty({ example: 'cash', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @ApiPropertyOptional({ example: 'TXN123456' })
  reference_number: string | null; // nullable — tiền mặt không có mã GD

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  paid_at: Date;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  created_at: Date;

  // Thông tin invoice sau khi thanh toán
  @ApiProperty({ example: 'unpaid' })
  invoice_status: string;

  @ApiProperty({ example: 900000 })
  invoice_final_amount: number;

  @ApiProperty({ example: 500000 })
  total_paid: number;

  @ApiProperty({ example: 400000 })
  remaining: number;
}
