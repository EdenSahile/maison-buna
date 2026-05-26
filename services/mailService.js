import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadTemplate(name) {
  return readFileSync(join(__dirname, '../templates', name), 'utf8');
}

export async function sendDevisEmails(devis, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const clientTemplate = Handlebars.compile(loadTemplate('email-client.html'));
  const adminTemplate = Handlebars.compile(loadTemplate('email-admin.html'));

  const attachment = {
    filename: `devis-${devis.id.slice(0, 8)}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
  };

  const from = process.env.SMTP_FROM;

  await transporter.sendMail({
    from,
    to: devis.email,
    subject: `Maison Buna — Confirmation de votre demande de devis`,
    html: clientTemplate(devis),
    attachments: [attachment]
  });
  console.log(`Email client envoyé à ${devis.email}`);

  await transporter.sendMail({
    from,
    to: process.env.ADMIN_EMAIL,
    subject: `[Maison Buna] Nouvelle demande de devis — ${devis.societe}`,
    html: adminTemplate(devis),
    attachments: [attachment]
  });
  console.log(`Email admin envoyé à ${process.env.ADMIN_EMAIL}`);
}
