import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './.env.development' });

export const transporter = nodemailer.createTransport({
    // host: process.env.MAIL_HOST,
  service: 'gmail',
  port: 465,  //465 para gmail
  secure: true, //true para 465, false para el resto
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify().then(() => {
  console.log('📩 Listo para enviar emails');
});
