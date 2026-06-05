import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ServicesModule } from '../services/services.module';
import { S3Module } from '../../common/s3/s3.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [ServicesModule, S3Module, MailModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
