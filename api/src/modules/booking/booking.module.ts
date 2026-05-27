import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
