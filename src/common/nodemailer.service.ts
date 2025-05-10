import { Injectable } from '@nestjs/common';
import { transporter } from '../config/nodemailer.config';
import { welcomeMessage } from 'src/utils/emails/welcomeMessage';

@Injectable()
export class MailService {
  async sendNotificationMail(email: string, pass?: string) {
    const img =
      'https://res.cloudinary.com/dtwxythux/image/upload/v1746139566/37da6594c977bf38c2aa11511ce359249c7fc531_kbk3m9.png';
    try {
      const info = await transporter.sendMail({
        from: '"Safe Stock" <safestock08@gmail.com>', // quien envian el correo
        to: email, // quien lo recibe
        subject: 'Cuenta creada con exito!', // asunto del mensaje
        text: `Bienvenido a SafeStock`,
        html: welcomeMessage(email,img,pass), // cuerpo del mensaje 
      });

      console.log('📨 Mensaje enviado:', info.messageId);
    } catch (error) {
      console.log(`❌ Algo salio mal al enviar el mensaje: ${error}`)
    }
  }
}
