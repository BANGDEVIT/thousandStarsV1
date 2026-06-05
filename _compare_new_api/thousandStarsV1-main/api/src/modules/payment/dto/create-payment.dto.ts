// dto/create-payment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'uuid-123',
    description: 'UUID của hóa đơn',
  })
  @IsNotEmpty({ message: 'invoice_id không được để trống' })
  @IsUUID('4', { message: 'invoice_id không hợp lệ' })
  invoice_id: string;

  @ApiProperty({
    example: 500000,
    description: 'Số tiền thanh toán (VNĐ)',
  })
  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Min(1, { message: 'Số tiền phải lớn hơn 0' })
  amount: number;

  @ApiProperty({
    example: 'cash',
    enum: PaymentMethod,
    description: 'Phương thức thanh toán',
  })
  @IsNotEmpty({ message: 'Phương thức thanh toán không được để trống' })
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  payment_method: PaymentMethod;

  @ApiPropertyOptional({
    example: 'TXN123456',
    description: 'Mã giao dịch (bắt buộc với bank_transfer và e_wallet)',
  })
  @IsOptional()
  @IsString()
  reference_number?: string;
}
