import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import crypto from 'crypto';
import { saveDevis } from '../data/storage.js';
import { generatePDF } from '../services/pdfService.js';
import { sendDevisEmails } from '../services/mailService.js';

const router = Router();

const devisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de demandes. Veuillez réessayer dans 15 minutes.' }
});

router.post('/devis', devisLimiter, async (req, res) => {
  try {
    const {
      societe,
      prenom,
      nom,
      email,
      collaborateurs,
      quantite,
      secteur,
      telephone,
      ville,
      frequence,
      moutures,
      message
    } = req.body;

    // Validation champs obligatoires
    const champsObligatoires = { societe, prenom, nom, email, collaborateurs, quantite };
    for (const [champ, valeur] of Object.entries(champsObligatoires)) {
      if (!valeur || String(valeur).trim() === '') {
        return res.status(400).json({ error: `Champ manquant : ${champ}` });
      }
    }

    // Validation email basique
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const devis = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      societe,
      prenom,
      nom,
      email,
      collaborateurs,
      quantite,
      secteur: secteur || '',
      telephone: telephone || '',
      ville: ville || '',
      frequence: frequence || '',
      moutures: moutures || [],
      message: message || ''
    };

    saveDevis(devis);

    const pdfBuffer = await generatePDF(devis);

    // Envoi email best-effort — ne bloque pas la réponse
    try {
      await sendDevisEmails(devis, pdfBuffer);
    } catch (mailErr) {
      console.error('Erreur envoi email (non bloquant) :', mailErr.message);
    }

    res.json({ success: true, id: devis.id });
  } catch (err) {
    console.error('Erreur /api/devis :', err);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
  }
});

export default router;
