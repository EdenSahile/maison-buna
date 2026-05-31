import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

function loadTemplate(name) {
  return readFileSync(join(__dirname, '../templates', name), 'utf8');
}

async function sendOne({ apiKey, from, to, subject, html, attachments }) {
  const body = {
    sender: { name: from.name, email: from.email },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  const allAttachments = [];

  if (attachments?.length) {
    attachments.forEach(a => allAttachments.push({
      name: a.filename,
      content: a.content.toString('base64'),
    }));
  }

  if (allAttachments.length) body.attachment = allAttachments;

  const res = await fetch(BREVO_API, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo API ${res.status}: ${err}`);
  }
}

export async function sendDevisEmails(devis, pdfBuffer) {
  const apiKey   = process.env.SMTP_PASS;
  const fromName  = 'Maison Buna';
  const fromEmail = process.env.SMTP_USER;

  const clientTemplate = Handlebars.compile(loadTemplate('email-client.html'));
  const adminTemplate  = Handlebars.compile(loadTemplate('email-admin.html'));

  const attachments = pdfBuffer ? [{
    filename: `devis-${devis.id.slice(0, 8)}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf',
  }] : [];

  const clientSubject = devis.sur_devis
    ? `Maison Buna — Votre demande a bien été reçue`
    : `Maison Buna — Confirmation de votre demande de devis`;

  const adminSubject = devis.sur_devis
    ? `[Maison Buna] Demande sur mesure — ${devis.societe || devis.prenom}`
    : `[Maison Buna] Nouvelle demande de devis — ${devis.societe || devis.prenom}`;

  await sendOne({
    apiKey,
    from: { name: fromName, email: fromEmail },
    to: devis.email,
    subject: clientSubject,
    html: clientTemplate(devis),
    attachments,
  });
  console.log(`Email client envoyé — id:${devis.id}`);

  await sendOne({
    apiKey,
    from: { name: fromName, email: fromEmail },
    to: process.env.ADMIN_EMAIL,
    subject: adminSubject,
    html: adminTemplate(devis),
    attachments,
  });
  console.log(`Email admin envoyé — id:${devis.id}`);
}
