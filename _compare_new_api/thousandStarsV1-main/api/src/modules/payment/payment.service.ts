// payment.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentMethod } from '@prisma/client';
import { MailService } from '../../common/mail/mail.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  // ==================== CREATE ====================
  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const { invoice_id, amount, payment_method, reference_number } = dto;

    // 1. Check invoice tồn tại
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoice_id },
      include: {
        payments: true,
        booking: {
          select: { status: true, customer: true },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    // 2. Check invoice đã paid chưa
    if (invoice.status === 'paid') {
      throw new BadRequestException('Hóa đơn đã được thanh toán đầy đủ');
    }

    // 3. Check booking phải đang checked_in hoặc checked_out
    if (!['checked_in', 'checked_out'].includes(invoice.booking.status)) {
      throw new BadRequestException(
        'Chỉ có thể thanh toán khi khách đang check-in hoặc check-out',
      );
    }

    // 4. Tính tổng đã thanh toán
    const totalPaid = invoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const finalAmount = Number(invoice.final_amount);
    const remaining = finalAmount - totalPaid;

    // 5. Check số tiền không vượt quá remaining
    if (amount > remaining) {
      throw new BadRequestException(
        `Số tiền thanh toán (${amount.toLocaleString('vi-VN')}đ) vượt quá số tiền còn lại (${remaining.toLocaleString('vi-VN')}đ)`,
      );
    }

    // 6. Validate reference_number cho bank_transfer và e_wallet
    if (
      (payment_method === PaymentMethod.bank_transfer ||
        payment_method === PaymentMethod.e_wallet) &&
      !reference_number
    ) {
      throw new BadRequestException(
        'Mã giao dịch bắt buộc với thanh toán chuyển khoản và ví điện tử',
      );
    }

    // 7. Tạo payment + cập nhật invoice trong transaction
    const payment = await this.prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          invoice_id,
          amount,
          payment_method,
          reference_number,
          paid_at: new Date(),
        },
      });

      // Tính tổng mới sau khi thêm payment
      const newTotalPaid = totalPaid + amount;
      const newRemaining = finalAmount - newTotalPaid;

      // Cập nhật invoice status
      await tx.invoice.update({
        where: { id: invoice_id },
        data: {
          status: newRemaining <= 0 ? 'paid' : 'unpaid',
        },
      });

      return newPayment;
    });

    // 8. Lấy lại invoice sau khi cập nhật
    const updatedInvoice = await this.prisma.invoice.findUnique({
      where: { id: invoice_id },
      include: { payments: true },
    });

    const newTotalPaid = updatedInvoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const customerEmail = invoice.booking.customer.email;
    if (customerEmail) {
      this.mailService
        .sendPaymentReceipt(customerEmail, {
          customerName: `${invoice.booking.customer.first_name} ${invoice.booking.customer.last_name}`,
          invoiceId: invoice_id,
          bookingId: updatedInvoice.booking_id,
          // amount: amount.toLocaleString('vi-VN'),
          amount: amount,
          paymentMethod: payment_method,
          referenceNumber: reference_number,
          // paidAt: new Date().toLocaleDateString('vi-VN'),
          // totalAmount: Number(updatedInvoice.total_amount).toLocaleString(
          //   'vi-VN',
          // ),
          // totalPaid: newTotalPaid.toLocaleString('vi-VN'),
          // remaining: Math.max(
          //   0,
          //   Number(updatedInvoice.final_amount) - newTotalPaid,
          // ).toLocaleString('vi-VN'),
          paidAt: new Date().toISOString(),
          totalAmount: Number(updatedInvoice.total_amount),
          remaining: Math.max(
            0,
            Number(updatedInvoice.final_amount) - newTotalPaid,
          ),
          totalPaid: newTotalPaid,
          status: updatedInvoice.status,
        })
        .catch(() => {});
    }

    return {
      id: payment.id,
      invoice_id: payment.invoice_id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method,
      reference_number: payment.reference_number,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      invoice_status: updatedInvoice.status,
      invoice_final_amount: Number(updatedInvoice.final_amount),
      total_paid: newTotalPaid,
      remaining: Math.max(
        0,
        Number(updatedInvoice.final_amount) - newTotalPaid,
      ),
    };
  }

  // ==================== FIND ONE ====================
  async findOne(id: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: { payments: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy thanh toán');
    }

    const totalPaid = payment.invoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    return {
      id: payment.id,
      invoice_id: payment.invoice_id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method,
      reference_number: payment.reference_number,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      invoice_status: payment.invoice.status,
      invoice_final_amount: Number(payment.invoice.final_amount),
      total_paid: totalPaid,
      remaining: Math.max(0, Number(payment.invoice.final_amount) - totalPaid),
    };
  }

  // ==================== FIND BY INVOICE ====================
  async findByInvoice(invoiceId: string): Promise<PaymentResponseDto[]> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        payments: {
          orderBy: { paid_at: 'asc' },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    const totalPaid = invoice.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    return invoice.payments.map((p) => ({
      id: p.id,
      invoice_id: p.invoice_id,
      amount: Number(p.amount),
      payment_method: p.payment_method,
      reference_number: p.reference_number,
      paid_at: p.paid_at,
      created_at: p.created_at,
      invoice_status: invoice.status,
      invoice_final_amount: Number(invoice.final_amount),
      total_paid: totalPaid,
      remaining: Math.max(0, Number(invoice.final_amount) - totalPaid),
    }));
  }
}
