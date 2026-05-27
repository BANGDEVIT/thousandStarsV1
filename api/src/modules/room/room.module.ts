import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { S3Module } from '../../common/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
