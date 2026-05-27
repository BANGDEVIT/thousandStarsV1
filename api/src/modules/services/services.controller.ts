import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServiceDto } from './dto/query-service.dto';
import {
  ServiceResponseDto,
  PaginatedServiceResponseDto,
} from './dto/service-response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/role-decorator';

@ApiTags('services')
@ApiBearerAuth('JWT-auth')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @HttpCode(201)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Tạo dịch vụ mới',
    description: 'Chỉ manager và admin mới có quyền tạo dịch vụ',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo dịch vụ thành công',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 409, description: 'Tên dịch vụ đã tồn tại' })
  async create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ',
    description: 'Hỗ trợ tìm kiếm, lọc theo danh mục, trạng thái và phân trang',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách dịch vụ',
    type: PaginatedServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async findAll(
    @Query() query: QueryServiceDto,
  ): Promise<PaginatedServiceResponseDto> {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles('staff', 'manager', 'admin')
  @ApiOperation({
    summary: 'Xem chi tiết dịch vụ',
    description: 'Lấy thông tin một dịch vụ theo ID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của dịch vụ',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về chi tiết dịch vụ',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Cập nhật dịch vụ',
    description: 'Chỉ manager và admin mới có quyền cập nhật',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của dịch vụ',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  @ApiResponse({ status: 409, description: 'Tên dịch vụ đã tồn tại' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles('manager', 'admin')
  @ApiOperation({
    summary: 'Xóa mềm dịch vụ',
    description: 'Chỉ manager và admin mới có quyền xóa (vô hiệu hóa)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID của dịch vụ',
    example: 'uuid-123',
  })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 400, description: 'Dịch vụ đã bị vô hiệu hóa' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.servicesService.remove(id);
    return { message: 'Xóa dịch vụ thành công' };
  }
}
