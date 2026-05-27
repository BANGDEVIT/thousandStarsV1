import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { S3Module } from '../../common/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
