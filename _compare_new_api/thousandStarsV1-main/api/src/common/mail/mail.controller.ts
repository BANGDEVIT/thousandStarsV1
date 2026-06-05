import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../decorators/public.decorator'; // nếu có decorator public

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  @Public() // bỏ qua JWT nếu cần, hoặc dùng Roles phù hợp
  async testEmail(@Query('to') to: string) {
    if (!to) return { message: 'Vui lòng cung cấp email qua ?to=xxx' };

    await this.mailService.sendWelcome(to, {
      customerName: 'Người dùng thử nghiệm',
      email: to,
      loginUrl: 'http://localhost:3001/login',
    });

    return { message: `Email test đã được gửi đến ${to}` };
  }
}
