import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';

export class PaymentInInvoiceDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 5000000 })
  amount: number;

  @ApiProperty({ example: 'cash' })
  paymnet_method: string;

  @ApiProperty({ example: 'TXN123456' })
  reference_number: string | null;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  paid_at: Date;
}

export class InvoiceResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'uuid-booking' })
  booking_id: string;

  @ApiProperty({ example: 1000000 })
  total_amount: number;

  @ApiProperty({ example: 0 })
  discount: number;

  @ApiProperty({ example: 1000000 })
  final_amount: number;

  @ApiProperty({ example: 'unpaid', enum: InvoiceStatus })
  status: InvoiceStatus;

  @ApiProperty({ example: 1000000, description: 'Tổng đã thanh toán' })
  total_paid: number;

  @ApiProperty({ example: 0, description: 'Còn lại phải trả' })
  remaining: number;

  @ApiProperty({ type: [PaymentInInvoiceDto] })
  payments: PaymentInInvoiceDto[];

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-05-12T00:00:00.000Z' })
  updated_at: Date;
}
