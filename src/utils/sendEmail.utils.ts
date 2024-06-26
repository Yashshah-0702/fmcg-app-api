import { EMAIL, PASSWORD, SERVICE } from '@/config';
import nodemailer from 'nodemailer';


export const sendEmail = (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: SERVICE,
    secure: false,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

transporter.sendMail({
    from: EMAIL,
    to,
    subject,
    html,
  });
};