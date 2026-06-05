import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
