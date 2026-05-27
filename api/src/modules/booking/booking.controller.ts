import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/role-decorator';
import { GetAccount } from '../../common/decorators/get-account.decorator';
import { QueryBookingDto } from './dto/quey-booking.dto';
import {
  BookingResponseDto,
  PaginatedBookingResponseDto,
} from './dto/booking-response.dto';
import { ServicesService } from '../services/services.service';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingServiceResponseDto } from '../services/dto/booking-service-response.dto';
import { AddBookingServiceDto } from '../services/dto/add-booking-service.dto';

@ApiTags('bookings')
@ApiBearerAuth('JWT-auth')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly servicesService: ServicesService,
  ) {}

  // ==================== MY BOOKINGS ====================
  @Get('my-booking')
  @HttpCode(200)
  @Roles('customer')
  @ApiOperation({
    summary: 'Xem booking của tôi',
    description: 'Khách hàng xem danh sách booking của mình',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách booking',
    type: PaginatedBookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khách hàng' })
  async getMyBooking(
    @GetAccount('sub') accountId: string,
    @Query() query: QueryBookingDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingService.getMyBookings(accountId, query);
  }

  // ==================== CREATE ====================
  @Post()
  @HttpCode(201)
  @Roles('staff', 'manager', 'admin', 'customer')
  @ApiOperation({
    summary: 'Tạo booking mới',
    description: `
      - Customer: tự đặt phòng online
      - Staff/Manager: đặt phòng cho khách tại quầy
      - Booking tạo ra ở trạng thái pending
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo booking thành công',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ngày không hợp lệ hoặc phòng không available',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy khách hàng hoặc phòng',
  })
  @ApiResponse({
    status: 409,
    description: 'Phòng đã được đặt trong khoảng thời gian này',
  })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GetAccount('sub') accountId: string,
    @GetAccount('roles') roles: string[],
  ): Promise<BookingResponseDto> {
    return this.bookingService.create(createBookingDto, accountId, roles);
  }

  // ==================== FIND ALL ====================
  @Get()
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Lấy danh sách booking',
    description:
      'Hỗ trợ filter theo trạng thái, loại, ngày và tìm kiếm theo tên khách',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách booking',
    type: PaginatedBookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async findAll(
    @Query() query: QueryBookingDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingService.findAll(query);
  }

  // ==================== FIND ONE ====================
  @Get(':id')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Xem chi tiết booking',
    description: 'Xem thông tin chi tiết của 1 booking',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết booking',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy booking' })
  async findOne(@Param('id') id: string): Promise<BookingResponseDto> {
    return this.bookingService.findOne(id);
  }

  // ==================== CONFIRM ====================
  @Post(':id/confirm')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Xác nhận booking',
    description: 'Chuyển booking từ pending → confirmed và tự động tạo Invoice',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Xác nhận thành công + Invoice được tạo',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Booking không ở trạng thái pending',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy booking' })
  @ApiResponse({
    status: 409,
    description: 'Phòng đã được đặt trong khoảng thời gian này',
  })
  async confirm(@Param('id') id: string): Promise<BookingResponseDto> {
    return this.bookingService.confirm(id);
  }

  // ==================== CHECK-IN ====================
  @Post(':id/check-in')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Check-in khách',
    description:
      'Chuyển booking confirmed → checked_in. Đổi phòng sang occupied',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Check-in thành công',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Booking không ở trạng thái confirmed hoặc chưa đến ngày check-in',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy booking' })
  async checkIn(
    @Param('id') id: string,
    @GetAccount('sub') accountId: string,
  ): Promise<BookingResponseDto> {
    return this.bookingService.checkIn(id, accountId);
  }

  // ==================== CHECK-OUT ====================
  @Post(':id/check-out')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Check-out khách',
    description:
      'Chuyển booking checked_in → checked_out. Đổi phòng sang cleaning',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Check-out thành công',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Booking không ở trạng thái checked_in hoặc chưa thanh toán',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy booking' })
  async checkOut(
    @Param('id') id: string,
    @GetAccount('sub') accountId: string,
  ): Promise<BookingResponseDto> {
    return this.bookingService.checkOut(id, accountId);
  }

  // ==================== ADD SERVICE ====================
  @Post(':id/services')
  @HttpCode(201)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Thêm dịch vụ vào booking',
    description:
      'Chỉ thêm được khi booking đang checked_in. Tự động cập nhật invoice',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 201,
    description: 'Thêm dịch vụ thành công',
    type: BookingServiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Booking không ở trạng thái check-in',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy booking hoặc dịch vụ',
  })
  async addService(
    @Param('id') bookingId: string,
    @Body() dto: AddBookingServiceDto,
  ): Promise<BookingServiceResponseDto> {
    return this.servicesService.addToBooking(bookingId, dto);
  }

  // ==================== REMOVE SERVICE ====================
  @Delete(':id/services/:bookingServiceId')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Xóa dịch vụ khỏi booking',
    description: 'Tự động cập nhật lại invoice',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiParam({
    name: 'bookingServiceId',
    description: 'UUID của booking_service (không phải service_id)',
    example: 'uuid-456',
  })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({
    status: 400,
    description: 'Booking không ở trạng thái check-in',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy dịch vụ trong booking',
  })
  async removeService(
    @Param('id') bookingId: string,
    @Param('bookingServiceId') bookingServiceId: string,
  ): Promise<{ message: string }> {
    await this.servicesService.removeFromBooking(bookingId, bookingServiceId);
    return { message: 'Xóa dịch vụ khỏi booking thành công' };
  }

  // ==================== UPDATE ====================
  @Patch(':id')
  @HttpCode(200)
  @Roles('customer', 'staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật booking',
    description: 'Chỉ cập nhật được khi booking ở trạng thái pending',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Booking không ở trạng thái pending',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy booking' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingService.update(id, updateBookingDto);
  }

  // ==================== CANCEL ====================
  @Delete(':id')
  @HttpCode(200)
  @Roles('customer', 'staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Hủy booking',
    description: 'Chỉ hủy được khi booking ở trạng thái pending hoặc confirmed',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của booking',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Hủy booking thành công',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể hủy booking ở trạng thái này',
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền hủy booking này' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy booking' })
  async cancel(
    @Param('id') id: string,
    @GetAccount('sub') accountId: string,
  ): Promise<BookingResponseDto> {
    return this.bookingService.cancel(id, accountId);
  }
}
