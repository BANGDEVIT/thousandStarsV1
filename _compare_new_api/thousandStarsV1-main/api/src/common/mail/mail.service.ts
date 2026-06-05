// src/common/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface BookingConfirmedContext {
  customerName: string;
  bookingId: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  rooms: { roomNumber: string; roomType: string; pricePerNight: number }[];
  totalAmount: number;
  specialRequests?: string;
  hotelName: string;
  hotelPhone: string;
  hotelAddress: string;
}

interface PaymentReceiptContext {
  customerName: string;
  invoiceId: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  paidAt: string;
  totalAmount: number;
  totalPaid: number;
  remaining: number;
  status: string;
}

interface WelcomeContext {
  customerName: string;
  email: string;
  loginUrl: string;
}

interface BookingReminderContext {
  customerName: string;
  bookingId: string;
  checkInDate: string;
  checkInTime: string;
  rooms: { roomNumber: string; roomType: string }[];
  hotelAddress: string;
  hotelPhone: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  // ==================== WELCOME ====================
  async sendWelcome(to: string, ctx: WelcomeContext) {
    await this.send(to, 'Chào mừng đến ThoundsandStars Hotel!', 'welcome', ctx);
  }

  // ==================== BOOKING PENDING ====================
  async sendBookingPending(
    to: string,
    ctx: {
      customerName: string;
      bookingId: string;
      checkInDate: string;
      checkOutDate: string;
      rooms: { roomNumber: string; roomType: string }[];
    },
  ) {
    await this.send(
      to,
      `Đặt phòng #${ctx.bookingId.slice(-6).toUpperCase()} đang chờ xác nhận`,
      'booking-pending',
      ctx,
    );
  }

  // ==================== BOOKING CONFIRMED ====================
  async sendBookingConfirmed(to: string, ctx: BookingConfirmedContext) {
    await this.send(
      to,
      `Xác nhận đặt phòng #${ctx.bookingId.slice(-6).toUpperCase()} — ${ctx.hotelName}`,
      'booking-confirmed',
      ctx,
    );
  }

  // ==================== BOOKING CANCELLED ====================
  async sendBookingCancelled(
    to: string,
    ctx: {
      customerName: string;
      bookingId: string;
      checkInDate: string;
      checkOutDate: string;
      reason?: string;
    },
  ) {
    await this.send(
      to,
      `Booking #${ctx.bookingId.slice(-6).toUpperCase()} đã bị hủy`,
      'booking-cancelled',
      ctx,
    );
  }

  // ==================== CHECK-IN REMINDER ====================
  async sendCheckInReminder(to: string, ctx: BookingReminderContext) {
    await this.send(
      to,
      `Nhắc nhở: Bạn check-in ngày mai — ${ctx.checkInDate}`,
      'checkin-reminder',
      ctx,
    );
  }

  // ==================== PAYMENT RECEIPT ====================
  async sendPaymentReceipt(to: string, ctx: PaymentReceiptContext) {
    await this.send(
      to,
      `Xác nhận thanh toán hóa đơn #${ctx.invoiceId.slice(-6).toUpperCase()}`,
      'payment-receipt',
      ctx,
    );
  }

  // ==================== RESET PASSWORD ====================
  async sendResetPassword(
    to: string,
    ctx: {
      customerName: string;
      resetLink: string;
      expiresIn: string;
    },
  ) {
    await this.send(
      to,
      'Đặt lại mật khẩu — Aurélien Hotel',
      'reset-password',
      ctx,
    );
  }

  // ==================== PRIVATE ====================
  private async send(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context: {
          ...context,
          currentYear: new Date().getFullYear(),
          hotelName: process.env.HOTEL_NAME || 'ThousandStars Hotel',
          hotelAddress: process.env.HOTEL_ADDRESS || '123 Đường ABC, TP. HCM',
          hotelPhone: process.env.HOTEL_PHONE || '0900 123 456',
        },
      });
      this.logger.log(`Email "${subject}" sent to ${to}`);
    } catch (error) {
      console.log(error);
    }
  }
}
