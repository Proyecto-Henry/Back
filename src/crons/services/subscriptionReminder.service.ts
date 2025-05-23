import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Subscription } from 'src/entities/Subscription.entity'; 
import { transporter } from '../../config/nodemailer.config'; 
import * as dayjs from 'dayjs';
import { Status_Sub } from 'src/enums/status_sub.enum';

@Injectable()
export class SubscriptionReminderService {
  private readonly logger = new Logger(SubscriptionReminderService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async sendExpiringMembershipEmails() {
    const today = dayjs();
    const targetDate = today.add(3, 'day').toDate();
    const img = 'https://res.cloudinary.com/dtwxythux/image/upload/v1746139566/37da6594c977bf38c2aa11511ce359249c7fc531_kbk3m9.png';

    const subscriptions = await this.subscriptionRepository.find({
      where: {
        end_date: LessThanOrEqual(targetDate),
        status: Status_Sub.ACTIVE
      },
      relations: ['admin'],
    });

    for (const sub of subscriptions) {
      const admin = sub.admin;
      if (!admin || !admin.email) continue;

      try {
        await transporter.sendMail({
          from: '"Safe Stock 🛒" <no-responder@safestock.com>',
          to: admin.email, 
          subject: 'Tu membresía está por vencer',
          html: ` 
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
    <img src="${img}" alt="Logo de SafeStock" style="display: block; margin: 0 auto 20px auto; max-width: 150px;">
    
    <h1 style="color: #2c3e50;">Hola ${admin.name},</h1>
    
    <p>Queremos recordarte que tu <strong>membresía de SafeStock</strong> está por vencer.</p>

    <p>
      La fecha de vencimiento es el <strong>${dayjs(sub.end_date).format('DD/MM/YYYY')}</strong>. Para evitar interrupciones en el servicio y seguir gestionando tus ventas sin problemas, te recomendamos renovarla cuanto antes.
    </p>

    <p style="margin-top: 20px;">
      ¡Gracias por confiar en <strong>SafeStock</strong>! Estamos para ayudarte a crecer.
    </p>

    <p style="margin-top: 30px;">Saludos cordiales,</p>

    <p>SafeStock</p>
  </div>
`,
        });

        this.logger.log(`📩 Email enviado a ${admin.email}`);
      } catch (error) {
        this.logger.error(`❌ Error al enviar a ${admin.email}: ${error.message}`);
      }
    }
  }
}
