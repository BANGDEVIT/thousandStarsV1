// invoice.controller.ts
import { Controller, Get, Patch, Param, Body, HttpCode } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { UpdateInvoiceDiscountDto } from './dto/update-invoice.dto';
import { Roles } from '../../common/decorators/role-decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAccount } from '../../common/decorators/get-account.decorator';

@ApiTags('invoices')
@ApiBearerAuth('JWT-auth')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // ==================== FIND BY BOOKING ====================
  @Get('booking/:bookingId')
  @HttpCode(200)
  @Roles('customer', 'staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Xem hóa đơn theo booking',
    description: 'Lấy hóa đơn của một booking cụ thể',
  })
  @ApiParam({
    name: 'bookingId',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về hóa đơn',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy booking hoặc hóa đơn',
  })
  async findByBooking(
    @Param('bookingId') bookingId: string,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.findByBooking(bookingId);
  }

  // ==================== FIND ONE ====================
  @Get(':id')
  @HttpCode(200)
  @Roles('customer', 'staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Xem chi tiết hóa đơn',
    description: 'Xem thông tin hóa đơn kèm danh sách thanh toán',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của hóa đơn',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết hóa đơn',
    type: InvoiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hóa đơn' })
  async findOne(
    @Param('id') id: string,
    @GetAccount('sub') accountId: string,
    @GetAccount('roles') roles: string[],
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.findOne(id, accountId, roles);
  }

  // ==================== UPDATE DISCOUNT ====================
  @Patch(':id/discount')
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật discount',
    description:
      'Chỉ manager và admin mới có quyền. Không cập nhật được hóa đơn đã paid',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của hóa đơn',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật discount thành công',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Hóa đơn đã paid hoặc discount > total_amount',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hóa đơn' })
  async updateDiscount(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDiscountDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.updateDiscount(id, dto);
  }
}
