import { Optional } from '@nestjs/common';
import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class UpdateRoomDto {
  @Optional()
  @IsString()
  room_number: string;

  @Optional()
  @IsUUID('4', { message: 'room_type_id không hợp lệ' })
  room_type_id: string;

  @Optional()
  @IsInt({ message: 'Số tầng phải là số nguyên' })
  @Min(1, { message: 'Số tầng phải lớn hơn 0' })
  floor: number;
}
