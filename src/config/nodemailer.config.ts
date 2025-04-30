import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './.env.development' });

export const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.email',
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: '4cristianm@gmail.com',
    pass: 'aatq wliy mena muuk',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify().then(() => {
  console.log('📨 Listo para enviar emails');
});
