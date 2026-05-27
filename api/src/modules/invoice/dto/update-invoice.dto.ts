// dto/update-invoice.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class UpdateInvoiceDiscountDto {
  @ApiProperty({ example: 10, description: 'Phần trăm giảm giá (0-100)' })
  @IsInt({ message: 'Discount percent phải là số nguyên' })
  @Min(0)
  @Max(100)
  discountPercent: number;
}
