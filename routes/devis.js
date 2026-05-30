import { Router } from 'express';
import crypto from 'crypto';
import { saveDevis } from '../data/storage.js';
import { generatePDF } from '../services/pdfService.js';
import { sendDevisEmails } from '../services/mailService.js';

const router = Router();

// Prix TTC par quantité — TVA non applicable art. 293 B CGI (franchise en base)
const PRICING = {
  '250 g':               { pu_ttc: 14.99, qte_label: '250 g',      sur_devis: false },
  '500 g – 1 kg':        { pu_ttc: 28.00, qte_label: '500 g',      sur_devis: false },
  '1 – 3 kg':            { pu_ttc: 52.00, qte_label: '1 kg',       sur_devis: false },
  '3 – 5 kg':            { pu_ttc: 145.00, qte_label: '3 kg',      sur_devis: false },
  'À estimer':           { pu_ttc: 0,     qte_label: '',            sur_devis: true  },
  '250 g — Découverte':  { pu_ttc: 14.99, qte_label: '250 g',      sur_devis: false },
  '500 g — 1 personne':  { pu_ttc: 26.50, qte_label: '500 g',      sur_devis: false },
  '1 kg — Couple':       { pu_ttc: 49.99, qte_label: '1 kg',       sur_devis: false },
  '2 kg — Famille':      { pu_ttc: 94.99, qte_label: '2 kg',       sur_devis: false },
  'Abonnement découverte': { pu_ttc: 12.99, qte_label: '250 g/mois', sur_devis: false },
  'Coffret cadeau':      { pu_ttc: 34.99, qte_label: '1 coffret',  sur_devis: false },
};

function formatDate(d) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function fmt(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function computePricing(quantite) {
  const entry = PRICING[quantite];
  if (!entry || entry.sur_devis) return null;
  return {
    designation:   'Café arabica de spécialité — Éthiopien grade 1, torréfié artisanalement en France',
    qte_label:     entry.qte_label,
    pu_ttc_fmt:    fmt(entry.pu_ttc),
    total_ttc_fmt: fmt(entry.pu_ttc),
  };
}

router.post('/devis', async (req, res) => {
  try {
    const {
      societe, prenom, nom, email, telephone,
      collaborateurs, secteur,
      adresse, codepostal, ville,
      quantite, frequence, moutures, message,
    } = req.body;

    const isParticulier = societe === 'Particulier';

    // Validation
    if (!prenom?.trim()) return res.status(400).json({ error: 'Champ manquant : prenom' });
    if (!nom?.trim())    return res.status(400).json({ error: 'Champ manquant : nom' });
    if (!email?.includes('@')) return res.status(400).json({ error: 'Email invalide' });
    if (!quantite?.trim()) return res.status(400).json({ error: 'Champ manquant : quantite' });

    if (!isParticulier) {
      if (!societe?.trim()) return res.status(400).json({ error: 'Champ manquant : societe' });
      if (!collaborateurs?.trim()) return res.status(400).json({ error: 'Champ manquant : collaborateurs' });
    } else {
      if (!adresse?.trim()) return res.status(400).json({ error: 'Champ manquant : adresse' });
    }

    const now = new Date();
    const validite = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const id = crypto.randomUUID();

    const devis = {
      id,
      timestamp: now.toISOString(),
      // Numéro lisible
      devis_numero: `MB-${now.getFullYear()}-${id.slice(0, 8).toUpperCase()}`,
      date_emission: formatDate(now),
      date_validite: formatDate(validite),
      // Client
      societe:       isParticulier ? 'Particulier' : societe,
      prenom, nom, email,
      telephone:     telephone || '',
      collaborateurs: collaborateurs || '',
      secteur:       secteur || '',
      adresse:       adresse || '',
      codepostal:    codepostal || '',
      ville:         ville || '',
      // Commande
      quantite, frequence: frequence || '', moutures: moutures || [], message: message || '',
      // Pricing
      pricing:        computePricing(quantite),
      sur_devis:      !computePricing(quantite),
      is_particulier: isParticulier,
    };

    saveDevis(devis);

    res.json({ success: true, id: devis.id });

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
