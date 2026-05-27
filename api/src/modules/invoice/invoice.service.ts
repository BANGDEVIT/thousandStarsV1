import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { UpdateInvoiceDiscountDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}
  // ==================== FIND ONE ====================
  async findOne(id: string, currentAccountId: string, roles: string[]) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: {
        ...this.invoiceSelect(),
        booking: { select: { customer_id: true } },
      },
    });
    if (!invoice) throw new NotFoundException();

    // Nếu là customer (role 'customer'), cần kiểm tra quyền sở hữu
    if (roles?.includes('customer')) {
      const customer = await this.prisma.customer.findUnique({
        where: { account_id: currentAccountId },
      });
      if (!customer || invoice.booking.customer_id !== customer.id) {
        throw new ForbiddenException('Bạn không có quyền xem hóa đơn này');
      }
    }
    // Admin/staff có thể xem tất cả
    return this.transformInvoice(invoice);
  }

  // ==================== FIND BY BOOKING ====================
  async findByBooking(bookingId: string): Promise<InvoiceResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Not found booking');
    }

    const invoice = await this.prisma.invoice.findUnique({
      where: { booking_id: bookingId },
      select: this.invoiceSelect(),
    });

    if (!invoice) {
      throw new NotFoundException(
        'Booking dose not have invoice. Need confirm booking ',
      );
    }

    return this.transformInvoice(invoice);
  }

  // ==================== UPDATE DISCOUNT ====================
  async updateDiscount(
    id: string,
    dto: UpdateInvoiceDiscountDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Not found invoice');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot update discount for paid invoice');
    }

    const { discountPercent } = dto;
    const totalAmount = Number(invoice.total_amount);
    const discountAmount = (totalAmount * discountPercent) / 100;

    // Kiểm tra không âm (discountPercent >=0) đã có trong DTO
    const finalAmount = totalAmount - discountAmount;

    const updated = await this.prisma.invoice.update({
      where: { id },
      data: {
        discount: discountAmount,
        final_amount: finalAmount,
      },
      select: this.invoiceSelect(),
    });

    return this.transformInvoice(updated);
  }

  // ==================== HELPERS ====================
  private invoiceSelect() {
    return {
      id: true,
      booking_id: true,
      total_amount: true,
      discount: true,
      final_amount: true,
      status: true,
      created_at: true,
      updated_at: true,
      payments: {
        select: {
          id: true,
          amount: true,
          payment_method: true,
          reference_number: true,
          paid_at: true,
        },
        orderBy: { paid_at: 'asc' as const },
      },
    };
  }

  private transformInvoice(invoice: any): InvoiceResponseDto {
    const totalPaid = invoice.payments.reduce(
      (sum: number, p: any) => sum + Number(p.amount),
      0,
    );

    const remaining = Number(invoice.final_amount) - totalPaid;

    return {
      id: invoice.id,
      booking_id: invoice.booking_id,
      total_amount: Number(invoice.total_amount),
      discount: Number(invoice.discount),
      final_amount: Number(invoice.final_amount),
      status: invoice.status,
      total_paid: totalPaid,
      remaining: remaining < 0 ? 0 : remaining,
      payments: invoice.payments.map((p: any) => ({
        id: p.id,
        amount: Number(p.amount),
        payment_method: p.payment_method,
        reference_number: p.reference_number,
        paid_at: p.paid_at,
      })),
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
    };
  }
}
