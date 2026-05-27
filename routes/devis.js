import { Router } from 'express';
import crypto from 'crypto';
import { saveDevis } from '../data/storage.js';
import { generatePDF } from '../services/pdfService.js';
import { sendDevisEmails } from '../services/mailService.js';

const router = Router();

router.post('/devis', async (req, res) => {
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

    // Répondre IMMÉDIATEMENT — ne pas attendre le PDF ni les emails
    res.json({ success: true, id: devis.id });

    // Traitement en arrière-plan (PDF + emails) — ne bloque plus la réponse
    setImmediate(async () => {
      try {
        const pdfBuffer = await generatePDF(devis);
        await sendDevisEmails(devis, pdfBuffer);
      } catch (err) {
        console.error('Erreur traitement arrière-plan :', err.message);
      }
    });
  } catch (err) {
    console.error('Erreur /api/devis :', err);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
  }
});

export default router;
