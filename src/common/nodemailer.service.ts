import { Injectable } from '@nestjs/common';
import { transporter } from '../config/nodemailer.config';
import { createAdmin } from 'src/modules/auth/dtos/createAdmin.dto';

@Injectable()
export class MailService {
  async sendNotificationMail(email: string, pass: string) {
    const img =
      'https://res.cloudinary.com/dtwxythux/image/upload/v1746139566/37da6594c977bf38c2aa11511ce359249c7fc531_kbk3m9.png';
    try {
      const info = await transporter.sendMail({
        from: '"Safe Stock 🛒" <no-responder@safestock.com>', // quien envian el correo
        to: email, // quien lo recibe
        subject: 'Cuenta creada con exito!', // asunto del mensaje
        text: `Bienvenido a SafeStock`,
        // cuerpo del mensajegit 
        html: ` 
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
          <img src="${img}" alt="Logo de SafeStock" style="display: block; margin: 0 auto 20px auto; max-width: 150px;">
          <h1 style="color: #2c3e50;">Gracias por registrarte en nuestra plataforma</h1>
          
          <p>Nos alegra tenerte con nosotros.</p>
          
          <p>
          A partir de ahora, podrás acceder a <strong>SafeStock</strong> y gestionar tu inventario asi como ventas y disfrutar de todas nuestras funcionalidades.
          </p>
          
          <p style="font-weight: bold; margin-bottom: 5px;">Tus credenciales de acceso:</p>
          <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Correo:</strong> ${email}</li>
          <li><strong>Contraseña:</strong> ${pass}</li>
          </ul>
          
          <p style="margin-top: 20px;">
          ¡Bienvenido/a a <strong>SafeStock</strong>! Esperamos que disfrute de nuestros servicios.
          </p>
          
          <p style="margin-top: 30px;">Atentamente,</p>
          <p><strong>Equipo de Soporte</strong></p>
          <p>SafeStock</p>
          <p><a href="mailto:soporte@safestore.com" style="color: #3498db;">soporte@safestock.com</a></p>
            </div>
          `,
      });

      console.log('📨 Mensaje enviado:', info.messageId);
    } catch (error) {
      console.log(`❌ Algo salio mal al enviar el mensaje: ${error}`)
    }
  }
}
